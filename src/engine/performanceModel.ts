import {
  Telemetry,
  WorkloadType,
  UserDNA,
  PerformanceState,
  RiskFactors,
} from '../types';
import { WORKLOAD_PROFILES } from '../data/simulationData';

/**
 * Evaluates the multi-dimensional risk state of the device.
 * All calculations are deterministic, explainable, and weighted by the user's Performance DNA.
 */
export function evaluatePerformanceState(
  telemetry: Telemetry,
  workload: WorkloadType,
  userDNA: UserDNA,
  sessionDuration: number
): PerformanceState {
  const profile = WORKLOAD_PROFILES[workload] || WORKLOAD_PROFILES.COMPETITIVE;

  // 1. Thermal Risk (0-100)
  // Baseline threshold: 36.0°C. Throttling margin starts around 40.5°C.
  // Rate of rise significantly amplifies risk if temperature is climbing fast.
  const tempExcess = Math.max(0, telemetry.thermalTemp - 35.5);
  const tempComponent = Math.min(60, tempExcess * 12); // up to 60 pts from absolute temp
  const rateComponent = Math.min(
    40,
    Math.max(0, telemetry.thermalRateOfRise) * 80
  ); // up to 40 pts from rate
  const rawThermalRisk = Math.min(100, tempComponent + rateComponent);
  // Modulate by user's thermal sensitivity (default ~0.65)
  const thermalRisk = Math.round(
    Math.min(100, rawThermalRisk * (0.5 + userDNA.thermalSensitivity * 0.7))
  );

  // 2. FPS & Pacing Risk (0-100)
  // Stability drop from 100% + frame-time variance (> 3ms is noticeable in competitive play)
  const stabilityDeficit = Math.max(0, 100 - telemetry.fpsStability);
  const stabilityComponent = Math.min(60, stabilityDeficit * 5); // 95% = 25 pts, 90% = 50 pts
  const varianceComponent = Math.min(
    40,
    Math.max(0, telemetry.frameTimeVariance - 2.5) * 6
  );
  const rawFpsRisk = Math.min(100, stabilityComponent + varianceComponent);
  // Competitive priority significantly influences how severely frame drops are penalized
  const fpsRisk = Math.round(
    Math.min(100, rawFpsRisk * (0.6 + userDNA.competitivePriority * 0.6))
  );

  // 3. Network Risk (0-100)
  let rawNetworkRisk = 5;
  if (telemetry.networkStability === 'MEDIUM') rawNetworkRisk = 40;
  if (telemetry.networkStability === 'LOW') rawNetworkRisk = 85;
  const networkRisk = Math.round(
    Math.min(
      100,
      rawNetworkRisk *
        profile.networkDependency *
        (0.4 + userDNA.networkSensitivity * 0.8)
    )
  );

  // 4. Battery Risk (0-100)
  let rawBatteryRisk = 0;
  if (telemetry.batteryLevel < 20) {
    rawBatteryRisk = 80 + (20 - telemetry.batteryLevel) * 1;
  } else if (telemetry.batteryLevel < 40) {
    rawBatteryRisk = (40 - telemetry.batteryLevel) * 2;
  }
  const batteryRisk = Math.round(
    Math.min(100, rawBatteryRisk * (0.5 + userDNA.batteryPriority * 0.7))
  );

  // 5. Input Performance Risk (0-100) (Step 7 Requirement 3)
  const inputTelem = telemetry.inputTelemetry || {
    touchStability: 99.2,
    inputJitter: 1.2,
    touchSampleRate: 300,
    gestureLatency: 16.5,
    triggerConsistency: 99.8,
  };
  const touchDeficit = Math.max(0, 100 - inputTelem.touchStability) * 6;
  const jitterDeficit = Math.max(0, inputTelem.inputJitter - 1.5) * 16;
  const gestureDeficit = Math.max(0, inputTelem.gestureLatency - 18.0) * 4;
  const rawInputRisk = Math.min(100, touchDeficit + jitterDeficit + gestureDeficit);
  const inputRisk = Math.round(
    Math.min(100, rawInputRisk * (0.6 + userDNA.competitivePriority * 0.6))
  );

  // 6. Session Duration Risk (0-100)
  const sessionMinutes = sessionDuration / 60;
  const durationRisk = Math.round(
    Math.min(100, Math.max(0, (sessionMinutes - 10) * 2.5))
  );

  // 7. Compound Risk Interaction
  let compoundMultiplier = 1.0;
  if (thermalRisk > 40 && (fpsRisk > 40 || inputRisk > 40)) {
    compoundMultiplier = 1.25;
  } else if (thermalRisk > 30 || fpsRisk > 30 || inputRisk > 35) {
    compoundMultiplier = 1.1;
  }

  const rawCompoundRisk = Math.min(
    100,
    ((thermalRisk * 0.35 + fpsRisk * 0.35 + inputRisk * 0.15 + networkRisk * 0.10 + batteryRisk * 0.05) *
      compoundMultiplier)
  );
  const compoundRisk = Math.round(rawCompoundRisk);

  // 8. Workload-Specific Dynamic Risk Weighting (Step 7 Requirement 2)
  let totalRiskScore = 0;
  if (workload === 'RANKED' || workload === 'COMPETITIVE') {
    // Ranked & Competitive prioritize: frame stability, input responsiveness, network consistency, thermal sustainability
    totalRiskScore = Math.round(
      fpsRisk * 0.32 +
      inputRisk * 0.22 +
      thermalRisk * 0.24 +
      networkRisk * 0.16 +
      batteryRisk * 0.04 +
      durationRisk * 0.02
    );
  } else if (workload === 'CASUAL') {
    // Casual prioritizes: battery efficiency, thermal comfort, balanced performance
    totalRiskScore = Math.round(
      batteryRisk * 0.38 +
      thermalRisk * 0.32 +
      fpsRisk * 0.18 +
      networkRisk * 0.08 +
      inputRisk * 0.04
    );
  } else if (workload === 'STREAMING') {
    // Streaming prioritizes: network stability, encoder GPU stability, thermal headroom
    totalRiskScore = Math.round(
      networkRisk * 0.38 +
      thermalRisk * 0.28 +
      fpsRisk * 0.20 +
      batteryRisk * 0.10 +
      inputRisk * 0.04
    );
  } else if (workload === 'TRAINING') {
    // Training prioritizes: thermal endurance, frame pacing consistency, balanced power
    totalRiskScore = Math.round(
      thermalRisk * 0.35 +
      fpsRisk * 0.30 +
      inputRisk * 0.15 +
      batteryRisk * 0.12 +
      networkRisk * 0.08
    );
  } else {
    // Default / Multitasking / Editing
    totalRiskScore = Math.round(
      fpsRisk * 0.35 +
      thermalRisk * 0.30 +
      networkRisk * 0.18 +
      batteryRisk * 0.12 +
      durationRisk * 0.05
    );
  }
  totalRiskScore = Math.min(100, Math.max(0, totalRiskScore));

  // 9. Combined Gameplay Stability Index (0-100) (Step 7 Requirement 5)
  const fpsScore = telemetry.fpsStability;
  const varScore = Math.max(0, 100 - Math.max(0, telemetry.frameTimeVariance - 1.5) * 10);
  const thermScore = Math.max(
    0,
    100 - Math.max(0, telemetry.thermalTemp - 35.0) * 12 - Math.max(0, telemetry.thermalRateOfRise) * 30
  );
  const inputStab = inputTelem.touchStability;
  const netScore = telemetry.networkStability === 'HIGH' ? 100 : telemetry.networkStability === 'MEDIUM' ? 70 : 35;
  const durPenalty = Math.min(15, Math.max(0, (sessionDuration / 60 - 15) * 0.5));

  const rawGameplayStability = Math.round(
    0.30 * fpsScore +
    0.20 * varScore +
    0.20 * thermScore +
    0.15 * inputStab +
    0.15 * netScore -
    durPenalty
  );
  const gameplayStabilityIndex = Math.min(100, Math.max(10, rawGameplayStability));

  const riskFactors: RiskFactors = {
    thermalRisk,
    fpsRisk,
    networkRisk,
    batteryRisk,
    sessionDurationRisk: durationRisk,
    compoundRisk,
    inputRisk,
  };

  return {
    telemetry,
    workload,
    riskScore: totalRiskScore,
    riskFactors,
    sessionDuration,
    gameplayStabilityIndex,
  };
}
