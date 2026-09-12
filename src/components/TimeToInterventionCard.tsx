import React, { useState } from 'react';
import { Clock, Info, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export function TimeToInterventionCard() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#1B160A] via-[#120F07] to-[#0A0A0A] border border-[#483716] rounded-xl p-5 shadow-2xl relative overflow-hidden animate-fade-in">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#C8A84E]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#E5C973]">
          <Zap size={13} className="text-[#C8A84E]" />
          <span>HERO PREDICTIVE METRIC</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
            Simulation result
          </span>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Metric Information"
          >
            <Info size={13} />
          </button>
        </div>
      </div>

      {/* Tooltip notice */}
      {showTooltip && (
        <div className="mb-3 p-2.5 rounded bg-black/80 border border-neutral-800 text-[10px] text-neutral-300 font-body leading-relaxed animate-fade-in">
          <div className="flex items-start gap-1.5 text-neutral-200 font-semibold mb-0.5">
            <AlertCircle size={12} className="text-[#C8A84E] shrink-0 mt-0.5" />
            <span>Methodology Disclosure</span>
          </div>
          This metric demonstrates the prototype&apos;s predictive loop and is not a measured hardware benchmark. Calculated from simulated thermal slope, frame-time variance, and task queue saturation under competitive load.
        </div>
      )}

      {/* Hero Metric Value */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
            TIME-TO-INTERVENTION
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
              15s
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold text-[#E5C973]">
              EARLY
            </span>
          </div>
        </div>

        <div className="sm:text-right font-mono text-[10px]">
          <div className="text-neutral-400">LEAD TIME MARGIN</div>
          <div className="text-emerald-400 font-bold mt-0.5">
            Acted 15s before severe stutter
          </div>
        </div>
      </div>

      {/* Definition description */}
      <p className="text-xs text-neutral-300 font-body leading-relaxed mb-4">
        <strong>Definition:</strong> How early VYRA identifies a likely performance degradation before severe instability becomes perceptible to the player.
      </p>

      {/* Calculation breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#2F2410] text-[10px] font-mono">
        <div className="p-2 rounded bg-black/40 border border-neutral-900">
          <div className="text-neutral-500 text-[8px] uppercase">PREDICTED DEGRADATION</div>
          <div className="text-amber-400 font-bold mt-0.5">-18s to drop</div>
          <div className="text-neutral-500 text-[8px] mt-0.5">Thermal slope detected</div>
        </div>

        <div className="p-2 rounded bg-black/40 border border-neutral-900">
          <div className="text-neutral-500 text-[8px] uppercase">VYRA INTERVENTION</div>
          <div className="text-[#E5C973] font-bold mt-0.5">-15s to drop</div>
          <div className="text-neutral-500 text-[8px] mt-0.5">Micro-pacing engaged</div>
        </div>

        <div className="p-2 rounded bg-black/40 border border-neutral-900">
          <div className="text-neutral-500 text-[8px] uppercase">PLAYER EXPERIENCE</div>
          <div className="text-emerald-400 font-bold mt-0.5">ZERO DROP</div>
          <div className="text-neutral-500 text-[8px] mt-0.5">Stutter prevented</div>
        </div>
      </div>
    </div>
  );
}
