import {
  ControlDomainState,
  IntentConfig,
  PerformanceState,
  Prediction,
  StrategyId,
  Telemetry,
  UserIntent,
} from '../types';

export const INTENT_CONFIGS: Record<UserIntent, IntentConfig> = {
  MAXIMUM_STABILITY: {
    id: 'MAXIMUM_STABILITY',
    label: 'MAXIMUM STABILITY',
    shortDescription: 'Zero micro-stutters and minimal frame-time variance',
    bias: {
      fpsStability: 1.35,
      thermalMargin: 1.1,
      latencyBuffer: 1.0,
      powerCap: 0.9,
    },
  },
  LOWEST_LATENCY: {
    id: 'LOWEST_LATENCY',
    label: 'LOWEST LATENCY',
    shortDescription: 'Touch response and high-frequency network packet queue priority',
    bias: {
      fpsStability: 1.15,
      thermalMargin: 0.95,
      latencyBuffer: 1.45,
      powerCap: 1.1,
    },
  },
  LONGEST_BATTERY: {
    id: 'LONGEST_BATTERY',
    label: 'LONGEST BATTERY',
    shortDescription: 'Intelligent power envelope scaling to prolong session duration',
    bias: {
      fpsStability: 0.85,
      thermalMargin: 1.2,
      latencyBuffer: 0.8,
      powerCap: 0.65,
    },
  },
  COOLER_DEVICE: {
    id: 'COOLER_DEVICE',
    label: 'COOLER DEVICE',
    shortDescription: 'Aggressive skin temperature ceiling and dissipation pacing',
    bias: {
      fpsStability: 0.9,
      thermalMargin: 1.5,
      latencyBuffer: 0.9,
      powerCap: 0.75,
    },
  },
  PEAK_PERFORMANCE: {
    id: 'PEAK_PERFORMANCE',
    label: 'PEAK PERFORMANCE',
    shortDescription: 'Unconstrained GPU/CPU clock headroom for maximum burst throughput',
    bias: {
      fpsStability: 1.1,
      thermalMargin: 0.7,
      latencyBuffer: 1.2,
      powerCap: 1.3,
    },
  },
  BALANCED: {
    id: 'BALANCED',
    label: 'BALANCED',
    shortDescription: 'Harmonized equilibrium between thermal climb, power, and frame rate',
    bias: {
      fpsStability: 1.0,
      thermalMargin: 1.0,
      latencyBuffer: 1.0,
      powerCap: 1.0,
    },
  },
};

// ── Android Integration Contract ──────────────────────────

export interface AndroidIntegrationMapping {
  prototypeSignal: string;
  androidTarget: string;
  subsystem: string;
  interfaceType: string;
  telemetryCadence: string;
}

export const ANDROID_INTEGRATION_CONTRACT: AndroidIntegrationMapping[] = [
  {
    prototypeSignal: 'Thermal Temp & Rate of Rise',
    androidTarget: 'Thermal Framework (IThermalEventListener) / Sysfs thermal_zone',
    subsystem: 'Thermal HAL / Skin Sensor Array',
    interfaceType: 'Native Listener Callback',
    telemetryCadence: '500ms',
  },
  {
    prototypeSignal: 'Battery Level & Drain Velocity',
    androidTarget: 'BatteryManager.BATTERY_PROPERTY_CURRENT_NOW / BatteryStats',
    subsystem: 'Power HAL / Fuel Gauge IC',
    interfaceType: 'BroadcastReceiver / Binder',
    telemetryCadence: '1000ms',
  },
  {
    prototypeSignal: 'Network Stability & Packet Jitter',
    androidTarget: 'ConnectivityManager.NetworkCallback / TrafficStats / Netd',
    subsystem: 'Telephony & Wi-Fi Link Layer',
    interfaceType: 'Socket Telemetry Stream',
    telemetryCadence: '250ms',
  },
  {
    prototypeSignal: 'Display & Frame Pacing',
    androidTarget: 'DisplayManager.Mode / SurfaceFlinger Choreographer / FrameStats',
    subsystem: 'Graphics HAL / Display Engine',
    interfaceType: 'Render Thread Callback',
    telemetryCadence: 'Per-frame (16.6ms)',
  },
  {
    prototypeSignal: 'Workload Profile & Package Context',
    androidTarget: 'UsageStatsManager / ActivityTaskManager (ComponentFocus)',
    subsystem: 'Android Framework / WindowManager',
    interfaceType: 'Context Observer',
    telemetryCadence: 'Event-driven',
  },
  {
    prototypeSignal: 'Performance Strategy Action',
    androidTarget: 'iQOO Performance Control Layer / PowerHAL Ext / CPUFreq Governor',
    subsystem: 'OEM Kernel & SoC Dispatcher',
    interfaceType: 'Privileged HAL IPC (Proposed)',
    telemetryCadence: 'On-demand intervention',
  },
];

// ── Control Center 5 Domains Evaluator ─────────────────────

export function evaluateControlDomains(
  telemetry: Telemetry,
  perfState: PerformanceState | null,
  activeStrategy: StrategyId | null,
  intent: UserIntent
): ControlDomainState[] {
  const isRisingFast = (telemetry.thermalRateOfRise || 0) > 0.25;
  const isHot = telemetry.thermalTemp > 37.5;
  const isJittery = (telemetry.frameTimeVariance || 0) > 4.5;
  const isNetLow = telemetry.networkStability === 'LOW';

  // 1. Thermal Domain
  let thermalRec = 'THERMAL BALANCE';
  let thermalReason = 'Sustained GPU load + rising skin temperature slope';
  let thermalEffect = 'Curtail thermal acceleration without sacrificing 60 FPS pacing';
  let thermalStatus: 'OPTIMAL' | 'MODULATING' | 'CRITICAL' = 'OPTIMAL';

  if (isHot && isRisingFast) {
    thermalRec = 'PROACTIVE THERMAL DAMPENING';
    thermalReason = 'Skin temperature approaching 38°C ceiling with positive rate';
    thermalEffect = 'Curbs thermal climb rate by -0.24°C/min';
    thermalStatus = 'CRITICAL';
  } else if (isRisingFast) {
    thermalRec = 'THERMAL BALANCE';
    thermalReason = 'Positive thermal climb rate detected under sustained workload';
    thermalEffect = 'Reduce thermal acceleration without sacrificing frame stability';
    thermalStatus = 'MODULATING';
  } else {
    thermalRec = 'MAINTAIN CURRENT PROFILE';
    thermalReason = 'Dissipation equilibrium within standard operating margin';
    thermalEffect = 'Sustain baseline passive dissipation';
    thermalStatus = 'OPTIMAL';
  }

  // 2. CPU / GPU Domain
  let cpuGpuRec = 'STABILITY-FIRST ALLOCATION';
  let cpuGpuReason = 'GPU dispatch variance causing micro-stutters under load';
  let cpuGpuEffect = 'Lock shader core clocks and stabilize frame submission cycles';
  let cpuGpuStatus: 'OPTIMAL' | 'MODULATING' | 'CRITICAL' = 'OPTIMAL';

  if (isJittery || intent === 'MAXIMUM_STABILITY') {
    cpuGpuRec = 'STABILITY-FIRST ALLOCATION';
    cpuGpuReason = 'High frame-time variance detected in rendering pipeline';
    cpuGpuEffect = 'Pace GPU compute queue to eliminate micro-stutters';
    cpuGpuStatus = 'MODULATING';
  } else if (telemetry.gpuUsage > 80) {
    cpuGpuRec = 'HEADROOM PRESERVATION';
    cpuGpuReason = 'Sustained GPU saturation (>80%)';
    cpuGpuEffect = 'Prevent burst throttling by smoothing command buffer';
    cpuGpuStatus = 'MODULATING';
  } else {
    cpuGpuRec = 'BALANCED DISPATCH';
    cpuGpuReason = 'Compute allocation matches current rendering complexity';
    cpuGpuEffect = 'Maintain default multi-core task scheduling';
    cpuGpuStatus = 'OPTIMAL';
  }

  // 3. Network Domain
  let netRec = 'NETWORK PRIORITY';
  let netReason = 'Upstream jitter detected in packet buffer';
  let netEffect = 'Activate dual-path Wi-Fi/cellular redundancy buffering';
  let netStatus: 'OPTIMAL' | 'MODULATING' | 'CRITICAL' = 'OPTIMAL';

  if (isNetLow || intent === 'LOWEST_LATENCY') {
    netRec = 'NETWORK PRIORITY (LOW LATENCY LOCK)';
    netReason = 'Competitive session sensitive to packet variance';
    netEffect = 'Prioritize gaming socket traffic ahead of background sync';
    netStatus = isNetLow ? 'CRITICAL' : 'MODULATING';
  } else {
    netRec = 'DEFAULT ROUTING';
    netReason = 'Connection latency variance remains below threshold';
    netEffect = 'Standard socket buffer allocation';
    netStatus = 'OPTIMAL';
  }

  // 4. Memory Domain
  let memRec = 'NO ACTION';
  let memReason = 'Memory pressure remains within learned comfort envelope';
  let memEffect = 'Zero background task termination required';
  let memStatus: 'OPTIMAL' | 'MODULATING' | 'CRITICAL' = 'OPTIMAL';

  if (telemetry.memoryUsage > 75) {
    memRec = 'BACKGROUND BUFFER REALLOCATION';
    memReason = 'RAM pressure > 75% under sustained app switching';
    memEffect = 'Flush non-essential background heap caches';
    memStatus = 'MODULATING';
  }

  // 5. Display / Frame Pacing Domain
  let dispRec = 'MAINTAIN';
  let dispReason = 'Display refresh rate synchronized with render cadence';
  let dispEffect = 'Keep dynamic refresh rate (VRR) engaged';
  let dispStatus: 'OPTIMAL' | 'MODULATING' | 'CRITICAL' = 'OPTIMAL';

  if (isJittery) {
    dispRec = 'VRR CADENCE LOCK';
    dispReason = 'Frame variance causing sync mismatch with display scan';
    dispEffect = 'Pin frame presentation boundary to eliminate tear/judder';
    dispStatus = 'MODULATING';
  }

  return [
    {
      id: 'THERMAL',
      label: 'THERMAL',
      currentState: `${telemetry.thermalTemp.toFixed(1)}°C (${telemetry.thermalRateOfRise > 0 ? '+' : ''}${telemetry.thermalRateOfRise.toFixed(2)}°C/min)`,
      recommendation: thermalRec,
      reason: thermalReason,
      expectedEffect: thermalEffect,
      status: thermalStatus,
      deviceTarget: 'Thermal HAL / Skin Sensor Array',
    },
    {
      id: 'CPU_GPU',
      label: 'CPU / GPU',
      currentState: `CPU ${Math.round(telemetry.cpuUsage)}% · GPU ${Math.round(telemetry.gpuUsage)}%`,
      recommendation: cpuGpuRec,
      reason: cpuGpuReason,
      expectedEffect: cpuGpuEffect,
      status: cpuGpuStatus,
      deviceTarget: 'SoC Scheduler & CPUFreq Governor',
    },
    {
      id: 'NETWORK',
      label: 'NETWORK',
      currentState: `${telemetry.networkStability} STABILITY`,
      recommendation: netRec,
      reason: netReason,
      expectedEffect: netEffect,
      status: netStatus,
      deviceTarget: 'ConnectivityManager / Netd Socket Queue',
    },
    {
      id: 'MEMORY',
      label: 'MEMORY',
      currentState: `${Math.round(telemetry.memoryUsage)}% RAM PRESSURE`,
      recommendation: memRec,
      reason: memReason,
      expectedEffect: memEffect,
      status: memStatus,
      deviceTarget: 'LMK (Low Memory Killer) / Heap Compaction',
    },
    {
      id: 'DISPLAY_PACING',
      label: 'DISPLAY / FRAME PACING',
      currentState: `${Math.round(telemetry.fps)} FPS · ${telemetry.frameTimeVariance.toFixed(1)}ms VAR`,
      recommendation: dispRec,
      reason: dispReason,
      expectedEffect: dispEffect,
      status: dispStatus,
      deviceTarget: 'SurfaceFlinger / VRR Display Engine',
    },
  ];
}
