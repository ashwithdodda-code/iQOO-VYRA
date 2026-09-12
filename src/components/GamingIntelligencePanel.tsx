import React from 'react';
import { useVYRA } from '../hooks/useVYRA';
import { WorkloadType } from '../types';
import {
  Gamepad2,
  Crosshair,
  Fingerprint,
  Gauge,
  AlertTriangle,
  Flame,
  Wifi,
  Battery,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const GAMING_WORKLOADS: {
  type: WorkloadType;
  label: string;
  tagline: string;
  focus: string;
  bias: string;
}[] = [
  {
    type: 'COMPETITIVE',
    label: 'COMPETITIVE',
    tagline: 'High-cadence tournament play',
    focus: 'Frame Pacing & Touch Latency',
    bias: 'Weights responsiveness 95%, stability 94%',
  },
  {
    type: 'RANKED',
    label: 'RANKED',
    tagline: 'Zero-tolerance match rating',
    focus: 'Max Precision & Packet Priority',
    bias: 'Weights jitter suppression 98%, QoS 96%',
  },
  {
    type: 'CASUAL',
    label: 'CASUAL',
    tagline: 'Relaxed sessions & lower heat',
    focus: 'Surface Comfort & Battery',
    bias: 'Weights thermal 88%, battery 85%',
  },
  {
    type: 'STREAMING',
    label: 'STREAMING',
    tagline: 'Multiplayer + broadcast encode',
    focus: 'Hardware Video Encoder & Network',
    bias: 'Weights network QoS 92%, GPU balance 85%',
  },
  {
    type: 'TRAINING',
    label: 'TRAINING',
    tagline: 'Extended aim & muscle-memory drill',
    focus: 'Consistent Tactile Response',
    bias: 'Weights input consistency 96%, steady pacing',
  },
];

export function GamingIntelligencePanel() {
  const { state, setWorkload, setProfilePreset } = useVYRA();
  const { currentTelemetry, gameplayStabilityIndex, activeProfilePreset, currentSession } = state;
  const currentWorkload = currentSession?.workload || 'COMPETITIVE';

  const touchTele = currentTelemetry.inputTelemetry || {
    touchStability: 99.2,
    inputJitter: 1.2,
    touchSampleRate: 300,
    gestureLatency: 16.5,
    triggerConsistency: 99.8,
  };

  // Determine if input is degrading ahead of FPS (Requirement 3)
  const isInputDegrading = touchTele.inputJitter > 2.5 || touchTele.touchStability < 95;
  const isFpsStable = currentTelemetry.fpsStability >= 94;
  const showInputLeadWarning = isInputDegrading && isFpsStable;

  // Stability Index color coding (Requirement 5)
  const isStabilityRisk = gameplayStabilityIndex < 82;
  const isStabilityCritical = gameplayStabilityIndex < 72;

  return (
    <div className="space-y-5">
      {/* ── 1. GAMEPLAY STABILITY INDEX (0–100) (Requirement 5) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge size={16} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold">
              GAMEPLAY STABILITY INDEX
            </span>
          </div>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
              isStabilityCritical
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                : isStabilityRisk
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
            }`}
          >
            {isStabilityCritical ? 'CRITICAL RISK' : isStabilityRisk ? 'DEGRADING' : 'OPTIMAL'}
          </span>
        </div>

        {/* Index Value & Trajectory Display */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <div
              className={`font-display text-4xl font-bold tracking-tight ${
                isStabilityCritical
                  ? 'text-rose-400'
                  : isStabilityRisk
                  ? 'text-amber-400'
                  : 'text-vyra-white'
              }`}
            >
              {gameplayStabilityIndex}
            </div>
            <div className="text-xs font-mono text-neutral-400">/ 100 COMPOSITE</div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono text-neutral-400">DETERIORATION SLOPE</div>
            <div className="text-xs font-mono font-semibold text-vyra-gold">
              {currentTelemetry.thermalRateOfRise > 0.3
                ? '94 → 91 → 87 → 79 (Steep)'
                : isStabilityRisk
                ? 'Downward (-1.8 pt/min)'
                : 'Stable (±0.2 pt/min)'}
            </div>
          </div>
        </div>

        {/* Predictive Warning Banner if < 82 */}
        {isStabilityRisk && (
          <div className="mb-3.5 p-2.5 rounded bg-amber-950/40 border border-amber-800/50 flex items-start gap-2 animate-fade-in">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-display font-semibold text-amber-300">
                Competitive stability risk approaching.
              </div>
              <div className="text-[10px] text-amber-200/80 font-body mt-0.5 leading-snug">
                Index fell below 82 due to thermal buildup and input jitter. VYRA initiates proactive micro-pacing before frame collapse occurs.
              </div>
            </div>
          </div>
        )}

        {/* 5-Factor Vector Breakdown */}
        <div className="space-y-2 pt-1 border-t border-vyra-border/60">
          <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
            STABILITY VECTOR BREAKDOWN
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
              <div className="text-neutral-400 flex items-center justify-between">
                <span>FPS CONSISTENCY</span>
                <span className="text-vyra-white font-semibold">
                  {currentTelemetry.fpsStability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-vyra-gold rounded-full"
                  style={{ width: `${Math.min(100, currentTelemetry.fpsStability)}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
              <div className="text-neutral-400 flex items-center justify-between">
                <span>TOUCH STABILITY</span>
                <span className="text-emerald-400 font-semibold">
                  {touchTele.touchStability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, touchTele.touchStability)}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
              <div className="text-neutral-400 flex items-center justify-between">
                <span>FRAME-TIME JITTER</span>
                <span className="text-vyra-white font-semibold">
                  {currentTelemetry.frameTimeVariance.toFixed(1)}ms
                </span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.max(10, 100 - currentTelemetry.frameTimeVariance * 12)}%` }}
                />
              </div>
            </div>

            <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
              <div className="text-neutral-400 flex items-center justify-between">
                <span>THERMAL TRAJECTORY</span>
                <span className="text-amber-400 font-semibold">
                  {currentTelemetry.thermalTemp.toFixed(1)}°C
                </span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.max(10, 100 - (currentTelemetry.thermalTemp - 34) * 10)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. INPUT-AWARE PERFORMANCE TELEMETRY (Requirement 3) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fingerprint size={16} className="text-emerald-400" />
            <span className="text-[10px] tracking-[0.2em] text-emerald-400 font-display font-semibold">
              INPUT-AWARE TELEMETRY & JITTER SENSING
            </span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">
            {touchTele.touchSampleRate}Hz POLLING
          </span>
        </div>

        {/* Input degradation warning ahead of FPS */}
        {showInputLeadWarning && (
          <div className="mb-3 p-2.5 rounded bg-amber-950/60 border border-amber-700/60 flex items-start gap-2">
            <ShieldAlert size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-display font-semibold text-amber-200">
                Gameplay responsiveness risk detected!
              </div>
              <div className="text-[10px] text-amber-300/80 font-body mt-0.5">
                Display frames remain at 60 FPS, but touch jitter increased to {touchTele.inputJitter.toFixed(1)}ms. VYRA flags responsiveness degradation before visible stutter occurs.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
            <div className="text-[8px] font-mono text-neutral-400 uppercase">TOUCH STABILITY</div>
            <div className="text-sm font-display font-bold text-emerald-400 mt-0.5">
              {touchTele.touchStability.toFixed(1)}%
            </div>
            <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Report Consistency</div>
          </div>

          <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
            <div className="text-[8px] font-mono text-neutral-400 uppercase">INPUT JITTER</div>
            <div className={`text-sm font-display font-bold mt-0.5 ${touchTele.inputJitter > 2.0 ? 'text-amber-400' : 'text-vyra-white'}`}>
              {touchTele.inputJitter.toFixed(1)} ms
            </div>
            <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Sample Variance</div>
          </div>

          <div className="p-2 rounded bg-vyra-dark border border-vyra-border/40">
            <div className="text-[8px] font-mono text-neutral-400 uppercase">GESTURE LATENCY</div>
            <div className="text-sm font-display font-bold text-vyra-gold mt-0.5">
              {touchTele.gestureLatency.toFixed(1)} ms
            </div>
            <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Touch-to-Photon</div>
          </div>
        </div>
      </div>

      {/* ── 3. iQOO GAMING PRIORITY PROFILE (Requirement 4) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crosshair size={16} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-semibold">
              iQOO GAMING PRIORITY PROFILES
            </span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">
            STRATEGY DRIVER
          </span>
        </div>

        {/* Profile Selector Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => setProfilePreset('PROFILE_COMPETITIVE')}
            className={`p-2.5 rounded border text-left transition-all ${
              activeProfilePreset === 'PROFILE_COMPETITIVE'
                ? 'bg-[#1D170A] border-vyra-gold text-white shadow-md shadow-vyra-gold/15'
                : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Sparkles size={11} className="text-vyra-gold" />
              <div className="font-display text-[11px] font-bold text-vyra-gold">
                COMPETITIVE
              </div>
            </div>
            <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
              5-Tier Priority
            </div>
          </button>

          <button
            onClick={() => setProfilePreset('PROFILE_A')}
            className={`p-2.5 rounded border text-left transition-all ${
              activeProfilePreset === 'PROFILE_A'
                ? 'bg-[#1D170A] border-vyra-gold text-white shadow-md shadow-vyra-gold/15'
                : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="font-display text-[11px] font-bold text-neutral-200">
              USER A (PRO)
            </div>
            <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
              Frame Pacing Focus
            </div>
          </button>

          <button
            onClick={() => setProfilePreset('PROFILE_B')}
            className={`p-2.5 rounded border text-left transition-all ${
              activeProfilePreset === 'PROFILE_B'
                ? 'bg-[#1D170A] border-vyra-gold text-white shadow-md shadow-vyra-gold/15'
                : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="font-display text-[11px] font-bold text-neutral-200">
              USER B (CASUAL)
            </div>
            <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
              Cool & Battery
            </div>
          </button>
        </div>

        {/* Detailed 5-Tier Priorities for COMPETITIVE PERFORMANCE (Requirement 4) */}
        {activeProfilePreset === 'PROFILE_COMPETITIVE' && (
          <div className="p-3 rounded bg-vyra-dark border border-vyra-gold/40 animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-bold text-vyra-white">
                COMPETITIVE PERFORMANCE HIERARCHY
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold">
                HARDWARE BIASED
              </span>
            </div>

            <div className="space-y-1 text-[10px] font-mono text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="text-vyra-gold font-bold">1.</span>
                <span className="text-white font-semibold">Responsiveness</span>
                <span className="text-neutral-500 text-[9px]">— 1000Hz touch burst, zero input delay</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vyra-gold font-bold">2.</span>
                <span className="text-white font-semibold">Frame consistency</span>
                <span className="text-neutral-500 text-[9px]">— 16.6ms locked cadence, zero jitter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-vyra-gold font-bold">3.</span>
                <span className="text-white font-semibold">Network consistency</span>
                <span className="text-neutral-500 text-[9px]">— QoS UDP socket priority</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">4.</span>
                <span className="text-neutral-300">Thermal sustainability</span>
                <span className="text-neutral-500 text-[9px]">— Preemptive dissipation curve</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-bold">5.</span>
                <span className="text-neutral-300">Battery preservation</span>
                <span className="text-neutral-500 text-[9px]">— Bypass charging, 0W cell heat</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. GAMING WORKLOAD SELECTOR (Requirement 2) ── */}
      <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 size={16} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-semibold">
              VYRA GAMING WORKLOAD ENGINE
            </span>
          </div>
          <span className="text-[9px] font-mono text-neutral-400">
            5 WORKLOAD TYPES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GAMING_WORKLOADS.map((wk) => {
            const isSelected = currentWorkload === wk.type;
            return (
              <button
                key={wk.type}
                onClick={() => setWorkload(wk.type)}
                className={`p-3 rounded border text-left transition-all ${
                  isSelected
                    ? 'bg-[#18140B] border-vyra-gold text-vyra-white shadow-sm'
                    : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-xs font-bold text-vyra-white">
                    {wk.label}
                  </span>
                  {isSelected && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold font-semibold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-400 font-body">
                  {wk.tagline}
                </div>
                <div className="text-[9px] font-mono text-vyra-gold/90 mt-1">
                  {wk.focus}
                </div>
                <div className="text-[9px] font-mono text-neutral-500 mt-0.5">
                  {wk.bias}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
