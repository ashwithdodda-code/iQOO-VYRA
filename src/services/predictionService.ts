import { Prediction, Telemetry, UserProfile } from '../types';

/**
 * Prediction Service
 * 
 * Currently uses deterministic mock logic.
 * Architecture supports replacement with a local AI model
 * without rewriting the UI layer.
 */

export const predictionService = {
  predict(telemetry: Telemetry, _profile: UserProfile): Prediction {
    const id = `pred_${Date.now()}`;
    const timestamp = Date.now();

    if (telemetry.thermalTemp > 38) {
      return {
        id,
        timestamp,
        type: 'THERMAL_RISE',
        message: 'Thermal rise detected. Performance throttling possible.',
        confidence: 0.85 + Math.random() * 0.1,
        severity: 'HIGH',
      };
    }

    if (telemetry.batteryLevel < 20) {
      return {
        id,
        timestamp,
        type: 'BATTERY_DRAIN',
        message: 'Battery level critical. Efficiency mode recommended.',
        confidence: 0.9,
        severity: 'HIGH',
      };
    }

    if (telemetry.networkVariance === 'HIGH') {
      return {
        id,
        timestamp,
        type: 'NETWORK_DEGRADATION',
        message: 'Network instability detected. Latency compensation active.',
        confidence: 0.78 + Math.random() * 0.1,
        severity: 'MEDIUM',
      };
    }

    if (telemetry.fpsStability < 90) {
      return {
        id,
        timestamp,
        type: 'PERFORMANCE_DRIFT',
        message: 'Performance drift predicted. Stability adjustment available.',
        confidence: 0.82 + Math.random() * 0.1,
        severity: 'MEDIUM',
      };
    }

    return {
      id,
      timestamp,
      type: 'STABILITY',
      message: 'Stable performance predicted.',
      confidence: 0.88 + Math.random() * 0.08,
      severity: 'LOW',
    };
  },
};
