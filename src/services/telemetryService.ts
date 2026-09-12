import { Telemetry } from '../types';
import { generateTelemetry } from '../data/mockTelemetry';

/**
 * Telemetry Service
 * Source: SIMULATED TELEMETRY
 * 
 * In production, this service would interface with actual device sensors
 * through the Performance Control Layer. Currently uses deterministic
 * mock data with controlled randomness.
 */

let currentTelemetry: Telemetry = generateTelemetry();
let listeners: ((t: Telemetry) => void)[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;
let sessionBattery = 85;
let sessionElapsed = 0;

export const telemetryService = {
  getCurrent(): Telemetry {
    return currentTelemetry;
  },

  subscribe(listener: (t: Telemetry) => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  startStreaming(intervalMs: number = 2000): void {
    if (intervalId) return;
    sessionBattery = currentTelemetry.batteryLevel;
    sessionElapsed = 0;
    intervalId = setInterval(() => {
      sessionElapsed++;
      sessionBattery = Math.max(5, sessionBattery - (0.08 + Math.random() * 0.12));
      currentTelemetry = generateTelemetry({
        batteryLevel: sessionBattery,
        thermalTemp: 33 + (sessionElapsed * 0.12) + Math.random() * 1.5,
      });
      listeners.forEach(l => l(currentTelemetry));
    }, intervalMs);
  },

  stopStreaming(): Telemetry {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return currentTelemetry;
  },

  isStreaming(): boolean {
    return intervalId !== null;
  },

  reset(): void {
    this.stopStreaming();
    sessionBattery = 85;
    sessionElapsed = 0;
    currentTelemetry = generateTelemetry();
  },
};
