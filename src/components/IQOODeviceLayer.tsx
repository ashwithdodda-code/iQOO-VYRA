import React from 'react';
import { useVYRA } from '../hooks/useVYRA';
import { IQOODeviceResource } from '../types';
import {
  Cpu,
  Flame,
  Monitor,
  Fingerprint,
  Wifi,
  BatteryCharging,
  HardDrive,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function IQOODeviceLayer() {
  const { state } = useVYRA();
  const { currentTelemetry, currentAdaptation, riskScore, actionQueue } = state;
  const activeStrategy = currentAdaptation?.strategy.id || null;

  // Build the 8 controllable device resources dynamically based on current telemetry & active intervention
  const isHighThermal = currentTelemetry.thermalTemp > 38.0;
  const isAdapted = Boolean(currentAdaptation?.accepted);
  const touchTele = currentTelemetry.inputTelemetry || {
    touchStability: 99.2,
    inputJitter: 1.2,
    touchSampleRate: 300,
    gestureLatency: 16.5,
    triggerConsistency: 99.8,
  };

  const resources: IQOODeviceResource[] = [
    {
      id: 'CPU',
      name: 'CPU Cluster Manager',
      subsystem: 'Kryo Prime / Cortex-X4 Governor',
      currentState: isAdapted
        ? 'Governor: Schedutil-biased (Cap 2.85GHz Prime)'
        : isHighThermal
        ? 'Governor: On-Demand (Throttling imminent at 3.3GHz)'
        : 'Governor: Performance (3.2GHz Prime active)',
      statusLevel: isAdapted ? 'MODULATING' : isHighThermal ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted
        ? 'Prevent core overheating by shifting non-critical threads to efficiency cluster'
        : 'Maintain maximum single-thread responsiveness for physics loop',
      controlTarget: isAdapted
        ? 'sys/devices/system/cpu/cpufreq/policy7/scaling_max_freq = 2850000'
        : 'sys/devices/system/cpu/cpufreq/policy7/scaling_governor = schedutil',
      metricValue: `${currentTelemetry.cpuUsage}% utilization`,
      productionIntegrationTarget: 'iQOO Monster Mode Kernel Governor / EAS Task Placer',
    },
    {
      id: 'GPU',
      name: 'GPU & Graphics Pipeline',
      subsystem: 'Adreno / Immortalis Raster Engine',
      currentState: isAdapted
        ? 'Clamped 740MHz target with VRS Tier-2 enabled'
        : isHighThermal
        ? 'Operating at 890MHz (VC boundary saturated)'
        : 'Nominal 820MHz (120 FPS render target)',
      statusLevel: isAdapted ? 'MODULATING' : isHighThermal ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted
        ? 'Sustain frame pacing cadence and prevent thermal dropouts'
        : 'Maintain peak shader throughput for geometry passes',
      controlTarget: isAdapted
        ? 'kgsl/kgsl-3d0/devfreq/max_freq = 740MHz; vrs_level = 2'
        : 'kgsl/kgsl-3d0/devfreq/governor = msm-adreno-tz',
      metricValue: `${currentTelemetry.gpuUsage}% render load`,
      productionIntegrationTarget: 'Qualcomm Adreno HAL / Vulkan 1.3 Subpass Pipeline',
    },
    {
      id: 'THERMAL',
      name: 'Vapor Chamber & Thermal HAL',
      subsystem: 'iQOO 6K SuperVC Liquid Dissipation',
      currentState: isAdapted
        ? `Sustained cooling curve (-0.22°C/min proactive offset)`
        : `VC Saturation: ${Math.min(98, Math.round(currentTelemetry.thermalTemp * 2.2))}% (Slope: ${currentTelemetry.thermalRateOfRise > 0 ? '+' : ''}${currentTelemetry.thermalRateOfRise.toFixed(2)}°C/min)`,
      statusLevel: currentTelemetry.thermalTemp > 39 ? 'CRITICAL' : isHighThermal ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted
        ? 'Preempt surface heating before heat saturates vapor capillary wick'
        : 'Track temperature gradient across chassis thermistors',
      controlTarget: isAdapted
        ? 'thermal/thermal_zone0/cooling_device0/cur_state = LEVEL_4'
        : 'thermal/thermal_zone0/trip_point_0_temp = 39000',
      metricValue: `${currentTelemetry.thermalTemp.toFixed(1)}°C chassis`,
      productionIntegrationTarget: 'iQOO Thermal Core Engine / SuperVC Sensor Array',
    },
    {
      id: 'DISPLAY',
      name: 'Display & Frame Pacing Engine',
      subsystem: '144Hz LTPO 4.0 AMOLED Driver',
      currentState: isAdapted
        ? 'Hardware Frame-Pacer: Locked 16.66ms cadence (120Hz LTPO)'
        : currentTelemetry.fpsStability < 93
        ? 'Frame presentation jitter detected (+4.2ms variance)'
        : '120Hz Adaptive Sync (Zero queue stalls)',
      statusLevel: isAdapted ? 'MODULATING' : currentTelemetry.fpsStability < 93 ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted
        ? 'Eliminate micro-stutter by aligning SurfaceFlinger VSYNC directly with GPU fence'
        : 'Deliver tear-free high refresh rate with variable refresh timing',
      controlTarget: isAdapted
        ? 'hwcomposer/vsync_phase_offset_ns = 2500000; ltpo_fps = 120'
        : 'hwcomposer/display_mode = 144hz_vrr',
      metricValue: `${currentTelemetry.fps.toFixed(1)} FPS (${currentTelemetry.fpsStability.toFixed(1)}% stab)`,
      productionIntegrationTarget: 'OriginOS Display Compositor / SurfaceFlinger VSYNC HAL',
    },
    {
      id: 'INPUT',
      name: 'Touch Controller & Haptics',
      subsystem: 'Dual-Chip Touch Sampling Engine',
      currentState: isAdapted || activeStrategy === 'STABILITY_FIRST'
        ? `Burst 1000Hz sampling active (Jitter: ${touchTele.inputJitter.toFixed(1)}ms)`
        : `Nominal ${touchTele.touchSampleRate}Hz sampling (Latency: ${touchTele.gestureLatency.toFixed(1)}ms)`,
      statusLevel: touchTele.touchStability < 94 ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted || activeStrategy === 'STABILITY_FIRST'
        ? 'Overclock touch report rate to eliminate gesture lag during high-stress action'
        : 'Filter finger noise while preserving instantaneous response',
      controlTarget: isAdapted || activeStrategy === 'STABILITY_FIRST'
        ? 'input/touchscreen/report_rate = 1000Hz; filter_mode = ULTRA_RESPONSIVE'
        : 'input/touchscreen/report_rate = 300Hz',
      metricValue: `${touchTele.touchStability.toFixed(1)}% response stability`,
      productionIntegrationTarget: 'Synaptics/Goodix Instant-Touch HAL (OriginOS Game Space)',
    },
    {
      id: 'NETWORK',
      name: 'Multi-Path Wireless Stack',
      subsystem: 'Wi-Fi 7 / 5G Dual-Channel Concurrency',
      currentState: activeStrategy === 'NETWORK_PRIORITY'
        ? 'DSCP 46 (EF) Gaming QoS pinned · Dual-path active'
        : currentTelemetry.networkStability === 'LOW'
        ? 'Channel congestion detected (48 buffers queued)'
        : 'Single Wi-Fi 6GHz link (Low jitter)',
      statusLevel: currentTelemetry.networkStability === 'LOW' ? 'HIGH' : 'OPTIMAL',
      vyraIntent: activeStrategy === 'NETWORK_PRIORITY'
        ? 'Bypass Wi-Fi bufferbloat by routing UDP game packets over concurrent 5G link'
        : 'Maintain low RTT packet transmission with minimal battery overhead',
      controlTarget: activeStrategy === 'NETWORK_PRIORITY'
        ? 'net/ipv4/tcp_congestion_control = bbr; qos_tag = 0x2E'
        : 'net/wireless/concurrency_mode = auto',
      metricValue: `${currentTelemetry.networkStability} quality`,
      productionIntegrationTarget: 'Qualcomm FastConnect 7800 / Dual-SIM Smart Gateway HAL',
    },
    {
      id: 'BATTERY',
      name: 'Power & Charging IC',
      subsystem: 'Dual-Cell FlashCharge Controller',
      currentState: isAdapted || activeStrategy === 'BATTERY_EFFICIENCY'
        ? 'Direct-to-board Bypass Charging engaged (0W battery cell heat)'
        : currentTelemetry.batteryLevel < 20
        ? 'Discharge Rate 6.8W (Runtime 22 min)'
        : 'Standard Battery Draw (5.1W average load)',
      statusLevel: currentTelemetry.batteryLevel < 20 ? 'HIGH' : 'OPTIMAL',
      vyraIntent: isAdapted || activeStrategy === 'BATTERY_EFFICIENCY'
        ? 'Negotiate bypass charging from adapter to power SoC directly, eliminating chemical heating'
        : 'Monitor discharge slope and state-of-health curves',
      controlTarget: isAdapted || activeStrategy === 'BATTERY_EFFICIENCY'
        ? 'power_supply/battery/bypass_charging = 1; max_charge_current = 0mA'
        : 'power_supply/battery/charge_control_limit_max = 5000mA',
      metricValue: `${currentTelemetry.batteryLevel}% remaining`,
      productionIntegrationTarget: 'iQOO FlashCharge Power IC / TI BQ25980 Bypass Bus',
    },
    {
      id: 'MEMORY',
      name: 'LPDDR5X & Storage Engine',
      subsystem: 'UFS 4.0 & zRAM Memory Controller',
      currentState: isAdapted
        ? 'Game memory space locked (8GB LPDDR bandwidth pinned)'
        : 'Dynamic memory sharing (Background compaction active)',
      statusLevel: 'OPTIMAL',
      vyraIntent: 'Guarantee instantaneous asset streaming without disk page faults during match play',
      controlTarget: isAdapted
        ? 'vm/swappiness = 10; cgroup/game/memory.min = 8589934592'
        : 'vm/swappiness = 60',
      metricValue: `${Math.round(currentTelemetry.memoryUsage)}% allocation`,
      productionIntegrationTarget: 'Android LowMemoryKillerDaemon (LMKD) & LPDDR5X Bus QoS',
    },
  ];

  const getResourceIcon = (id: string) => {
    switch (id) {
      case 'CPU':
        return <Cpu size={15} className="text-vyra-gold" />;
      case 'GPU':
        return <Activity size={15} className="text-[#E5C973]" />;
      case 'THERMAL':
        return <Flame size={15} className="text-vyra-amber" />;
      case 'DISPLAY':
        return <Monitor size={15} className="text-blue-400" />;
      case 'INPUT':
        return <Fingerprint size={15} className="text-emerald-400" />;
      case 'NETWORK':
        return <Wifi size={15} className="text-cyan-400" />;
      case 'BATTERY':
        return <BatteryCharging size={15} className="text-orange-400" />;
      case 'MEMORY':
        return <HardDrive size={15} className="text-purple-400" />;
      default:
        return <Zap size={15} className="text-vyra-gold" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Device Integration Dual-State Badge (Requirement 1) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold">
              iQOO DEVICE LAYER INTEGRATION
            </span>
          </div>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
            ACTIVE BRIDGE
          </span>
        </div>

        {/* Prototype vs Production Distinction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/70">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-vyra-muted mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-vyra-amber animate-pulse" />
              CURRENT PROTOTYPE
            </div>
            <div className="font-display text-xs font-bold text-vyra-white">
              Simulated Device Integration
            </div>
            <p className="text-[10px] text-vyra-muted font-body mt-1 leading-relaxed">
              Browser-based high-fidelity device simulation modeling thermal dynamics, SoC governors, touch latency, and frame delivery pipelines.
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#131109] border border-[#3E2F13]">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-vyra-gold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-vyra-gold" />
              PRODUCTION TARGET
            </div>
            <div className="font-display text-xs font-bold text-[#E5C973]">
              OriginOS / Game Space HAL
            </div>
            <p className="text-[10px] text-vyra-muted font-body mt-1 leading-relaxed">
              Native on-device kernel drivers (EAS Scheduler, Adreno GPU devfreq, Synaptics Touch IC, TI Bypass Charging) invoked directly via C++ HAL.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. VYRA ACTION QUEUE (Requirement 8) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-semibold">
              VYRA ACTION QUEUE
            </span>
          </div>
          <span className="text-[9px] font-mono text-vyra-muted">
            DEVICE-LAYER REQUESTS
          </span>
        </div>

        <p className="text-[11px] text-vyra-muted font-body mb-3 leading-snug">
          Recommended device actions dispatched by VYRA to maintain sustained performance without user intervention:
        </p>

        <div className="space-y-2">
          {actionQueue.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const isActive = item.status === 'ACTIVE';
            return (
              <div
                key={item.id}
                className={`p-2.5 rounded border transition-all ${
                  isActive
                    ? 'bg-[#1D170A] border-vyra-gold/70 shadow-sm shadow-vyra-gold/10'
                    : isCompleted
                    ? 'bg-vyra-dark/90 border-vyra-border/50 text-neutral-400'
                    : 'bg-vyra-dark/40 border-vyra-border/30 text-neutral-500'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : isActive ? (
                        <ArrowRight size={13} className="text-vyra-gold animate-pulse" />
                      ) : (
                        <Clock size={13} className="text-neutral-600" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-display font-medium ${
                          isActive
                            ? 'text-vyra-white font-semibold'
                            : isCompleted
                            ? 'text-neutral-300 line-through decoration-neutral-600'
                            : 'text-neutral-500'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        <span className="text-vyra-gold/90">{item.deviceSubsystem}</span>
                        {' · '}
                        <span>{item.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase shrink-0 font-semibold ${
                      isActive
                        ? 'bg-vyra-gold/20 text-vyra-gold border border-vyra-gold/40 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
                        : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Eight Controllable Performance Resources (Requirement 1) ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-1.5">
            <Activity size={13} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body font-semibold">
              8 HARDWARE PERFORMANCE CONTROLS
            </span>
          </div>
          <span className="text-[9px] font-mono text-vyra-muted">
            RISK FACTOR: {riskScore}/100
          </span>
        </div>

        <div className="space-y-3">
          {resources.map((res) => {
            const isModulating = res.statusLevel === 'MODULATING' || res.statusLevel === 'HIGH' || res.statusLevel === 'CRITICAL';
            return (
              <div
                key={res.id}
                className={`bg-vyra-surface border ${
                  res.statusLevel === 'CRITICAL'
                    ? 'border-[#552020]'
                    : res.statusLevel === 'HIGH'
                    ? 'border-amber-900/60'
                    : isModulating
                    ? 'border-[#423315]'
                    : 'border-vyra-border'
                } rounded-lg p-3.5 shadow-md`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(res.id)}
                    <div>
                      <span className="text-xs font-display font-bold text-vyra-white">
                        {res.name}
                      </span>
                      <span className="text-[9px] text-vyra-muted font-mono block">
                        {res.subsystem}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[8px] font-mono px-2 py-0.5 rounded font-semibold inline-block ${
                        res.statusLevel === 'CRITICAL'
                          ? 'bg-[#331114] text-vyra-red border border-vyra-red/40'
                          : res.statusLevel === 'HIGH'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : res.statusLevel === 'MODULATING'
                          ? 'bg-[#2A200E] text-vyra-gold border border-vyra-gold/40'
                          : 'bg-vyra-dark text-emerald-400 border border-emerald-900/30'
                      }`}
                    >
                      {res.statusLevel}
                    </span>
                    <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                      {res.metricValue}
                    </div>
                  </div>
                </div>

                {/* 1. CURRENT STATE */}
                <div className="p-2 rounded bg-vyra-dark border border-vyra-border/60 my-2">
                  <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider mb-0.5">
                    CURRENT STATE
                  </div>
                  <div className="font-mono text-[11px] font-medium text-vyra-white">
                    {res.currentState}
                  </div>
                </div>

                {/* 2. VYRA INTENT */}
                <div className="space-y-1 text-[11px] font-body text-vyra-muted mb-2">
                  <div>
                    <span className="text-vyra-gold font-medium font-mono text-[10px] uppercase">
                      VYRA INTENT:
                    </span>{' '}
                    <span className="text-neutral-200">&ldquo;{res.vyraIntent}&rdquo;</span>
                  </div>
                </div>

                {/* 3. CONTROL TARGET & PRODUCTION INTEGRATION TARGET */}
                <div className="pt-2 border-t border-vyra-border/40 space-y-1 text-[9px] font-mono">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-neutral-500">CONTROL TARGET:</span>
                    <span className="text-vyra-gold truncate max-w-[240px]" title={res.controlTarget}>
                      {res.controlTarget}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="text-neutral-500">PROD TARGET:</span>
                    <span className="text-neutral-300 truncate max-w-[240px]">
                      {res.productionIntegrationTarget}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
