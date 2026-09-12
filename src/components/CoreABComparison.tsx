import React, { useState } from 'react';
import { AdvantageMetric } from '../types';
import {
  GitCompare,
  TrendingDown,
  TrendingUp,
  Cpu,
  Flame,
  Fingerprint,
  Wifi,
  BatteryCharging,
  Clock,
  Activity,
  Layers,
} from 'lucide-react';

const METRICS_DATA: AdvantageMetric[] = [
  {
    id: 'fps_stab',
    metric: 'FPS Stability',
    conventional: '84.2%',
    vyra: '96.4%',
    conventionalDetail: 'Drops from 120 FPS down to 74 FPS under heat saturation',
    vyraDetail: 'Sustained 118-120 FPS throughout 30-min match',
    tradeOffNote: 'Conventional traded late-game stability for an unnecessary early burst.',
    status: 'SUSTAINED',
  },
  {
    id: 'frame_time',
    metric: 'Frame-Time Variance',
    conventional: '+31.4%',
    vyra: '-14.2%',
    conventionalDetail: 'Severe frame-pacing jitter (+8.4ms frame spikes)',
    vyraDetail: 'Locked 16.6ms cadence via SurfaceFlinger fence alignment',
    tradeOffNote: 'Eliminates micro-stutters during high-intensity combat.',
    status: 'SUSTAINED',
  },
  {
    id: 'thermal_rise',
    metric: 'Thermal Ceiling',
    conventional: '42.8°C (+7.2°)',
    vyra: '38.3°C (+2.7°)',
    conventionalDetail: 'Chassis becomes hot to touch; triggers thermal governor trip',
    vyraDetail: 'Preemptive micro-pacing holds curve below saturation boundary',
    tradeOffNote: '4.5°C cooler chassis prevents thermal throttling panic.',
    status: 'PREEMPTIVE',
  },
  {
    id: 'input_consistency',
    metric: 'Input Consistency',
    conventional: '88.4%',
    vyra: '99.2%',
    conventionalDetail: 'Touch polling drops under bus contention (jitter 5.8ms)',
    vyraDetail: '1000Hz burst touch polling active during key moments (jitter 1.2ms)',
    tradeOffNote: 'Touch response stays razor-sharp even when GPU is heavily loaded.',
    status: 'SUSTAINED',
  },
  {
    id: 'network_stability',
    metric: 'Network Latency',
    conventional: '142ms (Spike)',
    vyra: '38ms (Stable)',
    conventionalDetail: 'Wireless bufferbloat and socket queue delays (8.4% loss)',
    vyraDetail: 'Multi-path Wi-Fi + 5G concurrency with DSCP 46 gaming QoS',
    tradeOffNote: 'Zero packet queue buildup during multiplayer matchmaking.',
    status: 'SUSTAINED',
  },
  {
    id: 'battery_impact',
    metric: 'Power & Heat Draw',
    conventional: '7.8W (Drain)',
    vyra: '4.2W (Bypass)',
    conventionalDetail: 'Battery cells heat up rapidly from high current draw',
    vyraDetail: 'Bypass charging engaged; 0W chemical heat into battery cells',
    tradeOffNote: 'Saves 3.6W load and protects battery cycle longevity.',
    status: 'TRADE_OFF',
  },
  {
    id: 'intervention_timing',
    metric: 'Intervention Timing',
    conventional: 'Post-Collapse',
    vyra: '15s Preemptive',
    conventionalDetail: 'User feels stutter, opens Game Space, manually tweaks mode',
    vyraDetail: 'Engine acts before degradation; user feels continuous smooth play',
    tradeOffNote: 'Zero manual intervention needed during gameplay.',
    status: 'PREEMPTIVE',
  },
];

export function CoreABComparison() {
  const [selectedMetricId, setSelectedMetricId] = useState<string>('fps_stab');
  const activeMetric = METRICS_DATA.find((m) => m.id === selectedMetricId) || METRICS_DATA[0];

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCompare size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            A/B PERFORMANCE SIMULATION
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Prototype Simulation
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight">
          Same Device. Same Game. Same Conditions.
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-1 leading-relaxed">
          Comparing a conventional fixed/manual performance mode against iQOO VYRA&apos;s predictive intelligence under identical tournament stress.
        </p>
      </div>

      {/* Identical Baseline Scenario Card */}
      <div className="p-3 rounded bg-vyra-dark border border-vyra-border/70 text-[10px] font-mono space-y-1.5">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="font-bold text-white uppercase">TEST SCENARIO CONTEXT</span>
          <span className="text-vyra-gold">CONTROLLED BENCHMARK</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-300 pt-1">
          <div>Workload: <span className="text-white font-semibold">Competitive Gaming</span></div>
          <div>Duration: <span className="text-white font-semibold">30 Minutes</span></div>
          <div>Thermal Load: <span className="text-amber-400 font-semibold">+0.42°C/min rise</span></div>
          <div>GPU Workload: <span className="text-white font-semibold">91% (High)</span></div>
        </div>
      </div>

      {/* Parallel Lanes Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Lane A: Conventional */}
        <div className="p-4 rounded-lg bg-[#140C0C] border border-rose-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold text-rose-300">
              <TrendingDown size={14} className="text-rose-400" />
              <span>A. CONVENTIONAL SYSTEM</span>
            </div>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900">
              FIXED / REACTIVE
            </span>
          </div>

          <div className="text-[11px] text-neutral-300 font-body space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>1. Peak performance uncapped initially (120 FPS).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>2. Rapid thermal buildup saturates vapor chamber.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>3. Sudden throttling drop (84% stability, -15 FPS).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />
              <span>4. Player notices lag $\to$ manually switches mode.</span>
            </div>
          </div>
        </div>

        {/* Lane B: iQOO VYRA */}
        <div className="p-4 rounded-lg bg-[#17130A] border border-vyra-gold/60 space-y-3 shadow-md shadow-vyra-gold/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#E5C973]">
              <TrendingUp size={14} className="text-vyra-gold" />
              <span>B. iQOO VYRA</span>
            </div>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold border border-vyra-gold/40">
              PREDICTIVE / PERSONAL
            </span>
          </div>

          <div className="text-[11px] text-neutral-300 font-body space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vyra-gold shrink-0" />
              <span>1. Detects thermal slope & input jitter trend at 12m.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vyra-gold shrink-0" />
              <span>2. Predicts degradation 15s before stutter occurs.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>3. Proactive micro-pacing locks 96.4% stability.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>4. Verifies outcome & continuously updates DNA.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Metrics Table */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>MEASURABLE SIMULATED METRICS</span>
          <span>CLICK METRIC TO INSPECT TRADE-OFF</span>
        </div>

        <div className="space-y-1.5">
          {METRICS_DATA.map((row) => {
            const isSelected = row.id === selectedMetricId;
            return (
              <button
                key={row.id}
                onClick={() => setSelectedMetricId(row.id)}
                className={`w-full p-2.5 rounded border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1F190B] border-vyra-gold/80 shadow'
                    : 'bg-vyra-dark/70 border-vyra-border/50 hover:border-vyra-border'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-display font-medium text-white">
                    {row.metric}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="text-rose-400 text-right min-w-[70px]">
                      {row.conventional}
                    </div>
                    <span className="text-neutral-600 text-[10px]">vs</span>
                    <div className="text-emerald-400 font-bold text-right min-w-[70px]">
                      {row.vyra}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Engineering Trade-Off Deep Dive */}
      <div className="p-3.5 rounded bg-black/60 border border-[#3A2D12] text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs font-bold text-[#E5C973]">
            ENGINEERING TRADE-OFF: {activeMetric.metric.toUpperCase()}
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#C8A84E]/20 text-[#E5C973]">
            ANALYSIS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-body text-neutral-300">
          <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30">
            <span className="text-rose-400 font-mono text-[10px] block font-semibold mb-0.5">
              CONVENTIONAL: {activeMetric.conventional}
            </span>
            {activeMetric.conventionalDetail}
          </div>
          <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
            <span className="text-emerald-400 font-mono text-[10px] block font-semibold mb-0.5">
              VYRA: {activeMetric.vyra}
            </span>
            {activeMetric.vyraDetail}
          </div>
        </div>

        <p className="text-[11px] text-[#E5C973]/90 font-body italic pt-1">
          &ldquo;{activeMetric.tradeOffNote}&rdquo;
        </p>
      </div>
    </div>
  );
}
