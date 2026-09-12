import {
  Strategy,
  StrategyId,
  WorkloadProfile,
  WorkloadType,
  Telemetry,
} from '../types';

// ── Strategy Library ─────────────────────────────────────
export const STRATEGY_LIBRARY: Record<StrategyId, Strategy> = {
  STABILITY_FIRST: {
    id: 'STABILITY_FIRST',
    label: 'STABILITY FIRST',
    description:
      'Paces GPU frame-dispatch and stabilizes clock variance to eliminate micro-stutters under sustained load.',
    targets: ['fps', 'thermal'],
  },
  THERMAL_BALANCE: {
    id: 'THERMAL_BALANCE',
    label: 'THERMAL BALANCE',
    description:
      'Applies proactive thermal threshold scaling to curb skin temperature before throttling boundaries.',
    targets: ['thermal', 'fps'],
  },
  NETWORK_PRIORITY: {
    id: 'NETWORK_PRIORITY',
    label: 'NETWORK PRIORITY',
    description:
      'Prioritizes real-time socket queues, activates dual-channel Wi-Fi/cellular buffering, and minimizes packet jitter.',
    targets: ['network', 'fps'],
  },
  BATTERY_EFFICIENCY: {
    id: 'BATTERY_EFFICIENCY',
    label: 'BATTERY EFFICIENCY',
    description:
      'Optimizes display refresh cycles and caps background compute workloads to maximize session endurance.',
    targets: ['battery', 'thermal'],
  },
  PEAK_PERFORMANCE: {
    id: 'PEAK_PERFORMANCE',
    label: 'PEAK PERFORMANCE',
    description:
      'Unlocks maximum burst headroom for high-complexity rendering passes and intensive scene transitions.',
    targets: ['fps'],
  },
  BALANCED_PERFORMANCE: {
    id: 'BALANCED_PERFORMANCE',
    label: 'BALANCED PERFORMANCE',
    description:
      'Maintains adaptive equilibrium between rendering throughput, thermal climb rate, and power draw.',
    targets: ['fps', 'thermal', 'battery'],
  },
};

// ── Workload Profiles ────────────────────────────────────
export const WORKLOAD_PROFILES: Record<WorkloadType, WorkloadProfile> = {
  COMPETITIVE: {
    type: 'COMPETITIVE',
    cpuIntensity: 0.72,
    gpuIntensity: 0.88,
    networkDependency: 0.90,
    thermalImpact: 0.85,
    batteryDrain: 0.80,
  },
  CASUAL: {
    type: 'CASUAL',
    cpuIntensity: 0.35,
    gpuIntensity: 0.40,
    networkDependency: 0.30,
    thermalImpact: 0.25,
    batteryDrain: 0.35,
  },
  STREAMING: {
    type: 'STREAMING',
    cpuIntensity: 0.60,
    gpuIntensity: 0.50,
    networkDependency: 0.95,
    thermalImpact: 0.45,
    batteryDrain: 0.60,
  },
  RANKED: {
    type: 'RANKED',
    cpuIntensity: 0.82,
    gpuIntensity: 0.94,
    networkDependency: 0.98,
    thermalImpact: 0.90,
    batteryDrain: 0.88,
  },
  TRAINING: {
    type: 'TRAINING',
    cpuIntensity: 0.55,
    gpuIntensity: 0.65,
    networkDependency: 0.50,
    thermalImpact: 0.50,
    batteryDrain: 0.55,
  },
  EDITING: {
    type: 'EDITING',
    cpuIntensity: 0.85,
    gpuIntensity: 0.80,
    networkDependency: 0.20,
    thermalImpact: 0.75,
    batteryDrain: 0.70,
  },
  MULTITASKING: {
    type: 'MULTITASKING',
    cpuIntensity: 0.65,
    gpuIntensity: 0.45,
    networkDependency: 0.60,
    thermalImpact: 0.40,
    batteryDrain: 0.50,
  },
};

// ── Initial Telemetry Baseline (Judge Demo Scenario) ───────
export const DEMO_INITIAL_TELEMETRY: Telemetry = {
  timestamp: Date.now(),
  fps: 60.0,
  fpsStability: 99.0,         // 99%
  frameTimeVariance: 2.1,     // 2.1ms
  thermalTemp: 35.6,          // 35.6°C
  thermalRateOfRise: 0.12,    // +0.12°C/min
  batteryLevel: 70.0,         // 70%
  networkStability: 'HIGH',
  cpuUsage: 48.0,
  gpuUsage: 62.0,
  memoryUsage: 52.0,
  inputTelemetry: {
    touchStability: 99.2,
    inputJitter: 1.2,
    touchSampleRate: 300,
    gestureLatency: 16.5,
    triggerConsistency: 99.8,
  },
};
