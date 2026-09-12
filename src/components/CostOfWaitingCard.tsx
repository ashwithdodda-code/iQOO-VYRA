import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  ArrowRight,
  Flame,
  Activity,
} from 'lucide-react';

export function CostOfWaitingCard() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            COUNTERFACTUAL PROOF
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Prevention Analysis
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight uppercase">
          THE COST OF WAITING
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-1 leading-relaxed">
          The true engineering value of VYRA is not just what it alters — it is the catastrophic throttling and stutter that it prevents.
        </p>
      </div>

      {/* Side-by-Side Timeline Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Without Intervention */}
        <div className="p-4 rounded-lg bg-[#140C0C] border border-rose-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-rose-400">
              WITHOUT INTERVENTION
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
              UNMANAGED
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-black/40 border border-rose-950/50 flex items-center justify-between">
              <span className="text-neutral-400">Thermal Trend:</span>
              <span className="text-rose-400 font-bold">Continues rising (+0.46°/m)</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-rose-950/50 flex items-center justify-between">
              <span className="text-neutral-400">Frame Variance:</span>
              <span className="text-rose-400 font-bold">+31% (8.4ms jitter)</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-rose-950/50 flex items-center justify-between">
              <span className="text-neutral-400">Stability Outcome:</span>
              <span className="text-rose-400 font-bold">84% Throttle Collapse</span>
            </div>
          </div>

          <div className="text-[10px] text-neutral-400 font-body p-2 rounded bg-neutral-950 border border-rose-900/30">
            Player experiences severe frame hitching during match climax; phone chassis overheats to 42.8°C.
          </div>
        </div>

        {/* With VYRA */}
        <div className="p-4 rounded-lg bg-[#161208] border border-vyra-gold/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-[#E5C973]">
              WITH iQOO VYRA
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold border border-vyra-gold/40">
              PREEMPTIVE
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-black/40 border border-[#3E2F13] flex items-center justify-between">
              <span className="text-neutral-400">Risk Recognition:</span>
              <span className="text-vyra-gold font-bold">Detected at 12m (-15s lead)</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#3E2F13] flex items-center justify-between">
              <span className="text-neutral-400">Intervention:</span>
              <span className="text-vyra-gold font-bold">740MHz target & 1000Hz touch</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-[#3E2F13] flex items-center justify-between">
              <span className="text-neutral-400">Stability Outcome:</span>
              <span className="text-emerald-400 font-bold">96.4% Flatline Pacing</span>
            </div>
          </div>

          <div className="text-[10px] text-neutral-300 font-body p-2 rounded bg-neutral-950 border border-vyra-gold/30">
            Thermal curve capped below 38.3°C; user experiences zero stutter and uninterrupted match flow.
          </div>
        </div>
      </div>

      {/* Core Summary Callout */}
      <div className="p-3.5 rounded bg-gradient-to-r from-[#17130A] to-[#0A0A0A] border border-vyra-gold/40 text-center">
        <div className="font-display text-xs font-bold text-white uppercase tracking-wider">
          &ldquo;VYRA&apos;s value is not only what it changes. It is what degradation it prevents.&rdquo;
        </div>
        <div className="text-[10px] text-neutral-400 font-body mt-0.5">
          Proactive micro-interventions ensure the player never experiences the shock of emergency thermal throttling.
        </div>
      </div>
    </div>
  );
}
