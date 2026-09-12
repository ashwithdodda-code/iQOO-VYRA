import { Telemetry } from '../types';

export function generateTelemetry(base?: Partial<Telemetry>): Telemetry {
  const now = Date.now();
  return {
    timestamp: now,
    fps: 60,
    fpsStability: 98,
    frameTimeVariance: 1.2,
    thermalTemp: 35.6,
    thermalRateOfRise: 0.1,
    batteryLevel: base?.batteryLevel ?? 70,
    networkStability: 'HIGH',
    cpuUsage: 45,
    gpuUsage: 50,
    memoryUsage: 58,
    ...base,
  };
}

export function generateTelemetryStream(count: number, startBattery: number = 85): Telemetry[] {
  const stream: Telemetry[] = [];
  let battery = startBattery;
  for (let i = 0; i < count; i++) {
    battery = Math.max(5, battery - (0.05 + Math.random() * 0.1));
    stream.push(
      generateTelemetry({
        timestamp: Date.now() - (count - i) * 2000,
        batteryLevel: battery,
        thermalTemp: 33 + (i * 0.15) + Math.random() * 1.5,
      })
    );
  }
  return stream;
}

export const initialTelemetry: Telemetry = {
  timestamp: Date.now(),
  fps: 60,
  fpsStability: 97,
  frameTimeVariance: 1.2,
  thermalTemp: 34.8,
  thermalRateOfRise: 0.1,
  batteryLevel: 71,
  networkStability: 'HIGH',
  cpuUsage: 42,
  gpuUsage: 38,
  memoryUsage: 61,
};
