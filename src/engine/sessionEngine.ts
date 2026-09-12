import {
  DemoScenarioId,
  SimulationConfig,
  StrategyId,
  Telemetry,
  WorkloadType,
} from '../types';
import { DEMO_INITIAL_TELEMETRY, WORKLOAD_PROFILES } from '../data/simulationData';
import { DEMO_SCENARIOS } from '../data/scenarioData';

export class SessionSimulator {
  private currentTelemetry: Telemetry;
  private config: SimulationConfig;
  private tickCount: number = 0;
  private durationSeconds: number = 0;
  private activeScenario: DemoScenarioId | null = null;

  constructor(
    workload: WorkloadType = 'COMPETITIVE',
    initial?: Partial<Telemetry>,
    scenarioId?: DemoScenarioId
  ) {
    this.activeScenario = scenarioId || null;
    this.config = {
      workload,
      adaptationModifier: 1.0,
      strategyActive: false,
      activeStrategy: null,
    };

    let baseTelemetry = { ...DEMO_INITIAL_TELEMETRY, timestamp: Date.now() };

    if (scenarioId && DEMO_SCENARIOS[scenarioId]) {
      const scen = DEMO_SCENARIOS[scenarioId];
      this.config.workload = scen.workload;
      baseTelemetry = { ...baseTelemetry, ...scen.initialTelemetry };
      if (scenarioId === 'LONG_COMPETITIVE') {
        this.durationSeconds = 1680; // 28 minutes baseline
      }
    } else if (initial) {
      baseTelemetry = { ...baseTelemetry, ...initial };
    }

    this.currentTelemetry = baseTelemetry;
  }

  public setScenario(scenarioId: DemoScenarioId): void {
    this.activeScenario = scenarioId;
    const scen = DEMO_SCENARIOS[scenarioId];
    if (scen) {
      this.config.workload = scen.workload;
      this.currentTelemetry = {
        ...this.currentTelemetry,
        ...scen.initialTelemetry,
        timestamp: Date.now(),
      };
      this.durationSeconds = scenarioId === 'LONG_COMPETITIVE' ? 1680 : 0;
      this.tickCount = 0;
      this.resetStrategy();
    }
  }

  public setWorkload(workload: WorkloadType): void {
    this.config.workload = workload;
  }

  public applyStrategy(strategyId: StrategyId): void {
    this.config.strategyActive = true;
    this.config.activeStrategy = strategyId;

    if (strategyId === 'STABILITY_FIRST') {
      this.config.adaptationModifier = 0.82; // 18% load pacing
    } else if (strategyId === 'THERMAL_BALANCE') {
      this.config.adaptationModifier = 0.74; // 26% thermal dampening
    } else if (strategyId === 'BATTERY_EFFICIENCY') {
      this.config.adaptationModifier = 0.68; // 32% power draw cap
    } else if (strategyId === 'NETWORK_PRIORITY') {
      this.config.adaptationModifier = 0.86;
    } else if (strategyId === 'PEAK_PERFORMANCE') {
      this.config.adaptationModifier = 1.05;
    } else {
      this.config.adaptationModifier = 0.88;
    }
  }

  public resetStrategy(): void {
    this.config.strategyActive = false;
    this.config.activeStrategy = null;
    this.config.adaptationModifier = 1.0;
  }

  public getDurationSeconds(): number {
    return this.durationSeconds;
  }

  public getDuration(): number {
    return this.durationSeconds;
  }

  /**
   * Advances simulation by 1 interval (~1-2 real seconds).
   * Generates deterministic, physically sound telemetry evolution.
   */
  public tick(deltaSeconds: number = 2): Telemetry {
    this.tickCount++;
    this.durationSeconds += deltaSeconds;

    const profile = WORKLOAD_PROFILES[this.config.workload] || WORKLOAD_PROFILES.COMPETITIVE;
    const prev = this.currentTelemetry;

    // 1. CPU & GPU usage
    const targetCpu = profile.cpuIntensity * 100 * this.config.adaptationModifier;
    const targetGpu = profile.gpuIntensity * 100 * this.config.adaptationModifier;
    const cpuUsage = Math.round(
      prev.cpuUsage * 0.82 + (targetCpu + (Math.sin(this.tickCount * 0.8) * 3)) * 0.18
    );
    const gpuUsage = Math.round(
      prev.gpuUsage * 0.82 + (targetGpu + (Math.cos(this.tickCount * 0.7) * 4)) * 0.18
    );

    // RAM usage (gradual memory pressure accumulation)
    const memoryUsage = Math.round(
      Math.min(78, 52 + Math.min(18, this.durationSeconds * 0.02) + Math.sin(this.tickCount * 0.5) * 1.5)
    );

    // 2. Thermal Progression
    let targetRateOfRise = 0.12;

    if (this.activeScenario === 'NORMAL_GAMING') {
      targetRateOfRise = this.config.strategyActive ? 0.02 : 0.05;
    } else if (this.activeScenario === 'THERMAL_RISE') {
      targetRateOfRise = this.config.strategyActive ? 0.06 : Math.min(0.48, 0.38 + this.tickCount * 0.02);
    } else if (this.activeScenario === 'LONG_COMPETITIVE') {
      targetRateOfRise = this.config.strategyActive ? 0.06 : 0.28;
    } else {
      if (!this.config.strategyActive) {
        if (this.config.workload === 'COMPETITIVE') {
          targetRateOfRise = Math.min(0.45, 0.12 + this.tickCount * 0.025);
        } else {
          targetRateOfRise = 0.08 + profile.thermalImpact * 0.12;
        }
      } else {
        targetRateOfRise = Math.max(0.04, prev.thermalRateOfRise * 0.72 - 0.04);
      }
    }

    const thermalRateOfRise =
      Math.round((prev.thermalRateOfRise * 0.65 + targetRateOfRise * 0.35) * 100) / 100;

    let nextTemp = prev.thermalTemp + (thermalRateOfRise * deltaSeconds) / 60;
    if (this.config.strategyActive && nextTemp > 36.8) {
      nextTemp -= 0.04 * (deltaSeconds / 2); // cooling curve
    }
    const thermalTemp = Math.round(nextTemp * 10) / 10;

    // 3. FPS Stability & Frame-Time Variance
    let nextFpsStability = prev.fpsStability;
    let nextVariance = prev.frameTimeVariance;

    if (this.activeScenario === 'PERFORMANCE_DEGRADATION' && !this.config.strategyActive) {
      nextFpsStability = Math.max(88.5, prev.fpsStability - 0.45);
      nextVariance = Math.min(8.8, prev.frameTimeVariance + 0.35);
    } else if (this.activeScenario === 'NORMAL_GAMING') {
      nextFpsStability = Math.min(99.6, Math.max(98.8, prev.fpsStability + (Math.random() * 0.2 - 0.1)));
      nextVariance = Math.max(1.8, Math.min(2.4, prev.frameTimeVariance + (Math.random() * 0.2 - 0.1)));
    } else if (!this.config.strategyActive) {
      if (thermalTemp > 37.2 || this.tickCount > 5) {
        const degradationSlope = 0.22 + Math.max(0, thermalTemp - 36.5) * 0.14;
        nextFpsStability = Math.max(89.0, prev.fpsStability - degradationSlope);
        nextVariance = Math.min(8.2, prev.frameTimeVariance + 0.28);
      }
    } else {
      // Recovery upon intervention
      nextFpsStability = Math.min(98.8, prev.fpsStability + 0.65);
      nextVariance = Math.max(2.6, prev.frameTimeVariance - 0.5);
    }

    const fpsStability = Math.round(nextFpsStability * 10) / 10;
    const frameTimeVariance = Math.round(nextVariance * 10) / 10;
    const fps = Math.round((60.0 * (fpsStability / 100)) * 10) / 10;

    // 4. Battery Level
    let drainPerSec = 0.008 * profile.batteryDrain;
    if (this.config.activeStrategy === 'BATTERY_EFFICIENCY') {
      drainPerSec *= 0.45; // 55% drain rate curb
    } else if (this.config.strategyActive) {
      drainPerSec *= 0.78;
    }
    const batteryLevel = Math.round(Math.max(3.0, prev.batteryLevel - drainPerSec * deltaSeconds) * 10) / 10;

    // 5. Network Stability
    let networkStability = prev.networkStability;
    if (this.activeScenario === 'NETWORK_INSTABILITY') {
      if (this.config.activeStrategy === 'NETWORK_PRIORITY') {
        networkStability = 'HIGH';
      } else {
        networkStability = this.tickCount > 4 ? 'LOW' : 'MEDIUM';
      }
    } else if (this.config.activeStrategy === 'NETWORK_PRIORITY') {
      networkStability = 'HIGH';
    }

    this.currentTelemetry = {
      timestamp: Date.now(),
      fps,
      fpsStability,
      frameTimeVariance,
      thermalTemp,
      thermalRateOfRise,
      batteryLevel,
      networkStability,
      cpuUsage,
      gpuUsage,
      memoryUsage,
    };

    return this.currentTelemetry;
  }
}
