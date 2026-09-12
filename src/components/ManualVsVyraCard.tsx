import React from 'react';

export const ManualVsVyraCard: React.FC = () => {
  const comparisonPoints = [
    {
      dimension: 'Trigger Mechanism',
      manual: 'Manual toggle (e.g., Monster Mode) or reactive thermal throttle after frame rate collapses.',
      manualStatus: 'REACTIVE',
      vyra: 'Preemptive autonomous intervention triggered ~2-3 minutes ahead based on signal velocity.',
      vyraStatus: 'PROACTIVE',
    },
    {
      dimension: 'Thermal Management',
      manual: 'Uncapped climb until thermal trip point (~43°C), followed by sudden 20-30% GPU throttle and jarring stutter.',
      manualStatus: 'ABRUPT THROTTLE',
      vyra: 'Gradual micro-cadence tuning and scheduler governor adjustment maintaining skin temp below trigger boundary.',
      vyraStatus: 'PREDICTIVE SHAPING',
    },
    {
      dimension: 'Personal Context',
      manual: 'One-size-fits-all factory preset. Ignores individual touch patterns, sensitivity, and session duration.',
      manualStatus: 'STATIC PRESET',
      vyra: 'Personal Performance DNA balances strategy according to user priority (e.g., 94% Stability vs 88% Battery Comfort).',
      vyraStatus: 'PERSONALIZED DNA',
    },
    {
      dimension: 'Outcome Verification',
      manual: 'Open-loop. The system has no awareness of whether the experience improved or degraded.',
      manualStatus: 'OPEN-LOOP',
      vyra: 'Closed-loop verification: measures post-adaptation frame jitter, records delta, and updates strategy memory.',
      vyraStatus: 'CLOSED-LOOP LEARN',
    },
  ];

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 mb-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-[#C8A84E]/5 rounded-bl-full pointer-events-none blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 border-b border-neutral-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8A84E]" />
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display">
              Traditional Performance Modes vs iQOO VYRA
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Why static hardware toggles fail competitive gaming workloads
          </p>
        </div>

        <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded border border-neutral-800">
          ARCHITECTURAL ADVANTAGE
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Conventional Phone Mode Card */}
        <div className="bg-neutral-950/90 border border-red-950/40 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-neutral-850 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-display">
                Traditional Performance Modes
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-900/40">
              STATIC / REACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {comparisonPoints.map((pt, idx) => (
              <div key={idx} className="bg-neutral-900/50 p-2.5 rounded border border-neutral-850">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span className="font-semibold text-neutral-300">{pt.dimension}</span>
                  <span className="text-red-400 text-[10px] font-mono">{pt.manualStatus}</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">{pt.manual} </p>
              </div>
            ))}
          </div>
        </div>

        {/* iQOO VYRA Card */}
        <div className="bg-neutral-950/90 border border-[#C8A84E]/40 rounded-lg p-4 relative overflow-hidden ring-1 ring-[#C8A84E]/20">
          <div className="flex items-center justify-between mb-3 border-b border-neutral-850 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8A84E] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                iQOO VYRA Intelligence Layer
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A84E]/20 text-[#C8A84E] border border-[#C8A84E]/30 font-semibold">
              PREEMPTIVE / AUTONOMOUS
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {comparisonPoints.map((pt, idx) => (
              <div key={idx} className="bg-[#161616] p-2.5 rounded border border-[#C8A84E]/20">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-semibold text-white">{pt.dimension}</span>
                  <span className="text-[#C8A84E] text-[10px] font-mono font-bold">
                    {pt.vyraStatus}
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed">{pt.vyra}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Positioning Banner */}
      <div className="p-3.5 bg-neutral-900/80 rounded-lg border border-[#C8A84E]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <div>
            <div className="text-xs font-bold text-white font-display uppercase tracking-wide">
              "VYRA DOESN'T WAIT FOR PERFORMANCE TO DROP. IT LEARNS THE PATTERN BEFORE THE DROP."
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Zero disruptive frame drops, zero sudden throttling dips, zero manual mode switching.
            </p>
          </div>
        </div>
        <div className="text-[10px] font-mono px-2 py-1 rounded bg-[#C8A84E]/10 text-[#C8A84E] border border-[#C8A84E]/30 whitespace-nowrap">
          SIMULATED ARCHITECTURE BENCHMARK
        </div>
      </div>
    </div>
  );
};
