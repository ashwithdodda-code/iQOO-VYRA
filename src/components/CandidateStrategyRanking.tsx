import React from 'react';
import { CandidateStrategyScore } from '../types';

interface CandidateStrategyRankingProps {
  candidates: CandidateStrategyScore[];
  selectedStrategyId?: string;
  onSelectCandidate?: (strategyId: any) => void;
}

export const CandidateStrategyRanking: React.FC<CandidateStrategyRankingProps> = ({
  candidates,
  selectedStrategyId,
  onSelectCandidate,
}) => {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 mb-6 relative overflow-hidden">
      {/* Background Accent subtle glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-[#C8A84E]/5 rounded-bl-full pointer-events-none blur-2xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-neutral-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8A84E] animate-pulse" />
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display">
              Candidate Strategy Selection Scoring
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Multi-factor weighted evaluation rank (Step 4 · Preemptive Selection Engine)
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
          <span className="text-[#C8A84E] font-bold">TOP PICK:</span>
          <span>{candidates[0]?.label || 'EVALUATING'}</span>
        </div>
      </div>

      <div className="space-y-3">
        {candidates.map((cand, idx) => {
          const isSelected = selectedStrategyId
            ? cand.strategyId === selectedStrategyId
            : cand.selected || idx === 0;

          return (
            <div
              key={cand.strategyId}
              onClick={() => onSelectCandidate && onSelectCandidate(cand.strategyId)}
              className={`p-3.5 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-900/90 border-[#C8A84E]/60 shadow-lg shadow-[#C8A84E]/5 ring-1 ring-[#C8A84E]/30'
                  : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
              } ${onSelectCandidate ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded text-[11px] font-mono font-bold ${
                      isSelected
                        ? 'bg-[#C8A84E] text-black'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white font-display">
                      {cand.label}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8A84E]/20 text-[#C8A84E] border border-[#C8A84E]/30 uppercase tracking-wider">
                        Active Strategy
                      </span>
                    )}
                  </div>
                </div>

                {/* Composite Score */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-neutral-400 font-mono">Score</span>
                  <span
                    className={`text-xl font-bold font-mono ${
                      isSelected ? 'text-[#C8A84E]' : 'text-neutral-200'
                    }`}
                  >
                    {cand.score}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">/100</span>
                </div>
              </div>

              {/* Multi-Dimensional Factor Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800/60">
                {/* User Fit */}
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/60">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-neutral-400">User DNA Fit</span>
                    <span className="text-neutral-200 font-semibold">{cand.userFit}%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400/80 rounded-full"
                      style={{ width: `${cand.userFit}%` }}
                    />
                  </div>
                </div>

                {/* Device Fit */}
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/60">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-neutral-400">Device Signal Fit</span>
                    <span className="text-neutral-200 font-semibold">{cand.deviceFit}%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400/80 rounded-full"
                      style={{ width: `${cand.deviceFit}%` }}
                    />
                  </div>
                </div>

                {/* Predicted Benefit */}
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/60">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-neutral-400">Benefit Score</span>
                    <span className="text-neutral-200 font-semibold">{cand.predictedBenefit}%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400/80 rounded-full"
                      style={{ width: `${cand.predictedBenefit}%` }}
                    />
                  </div>
                </div>

                {/* Historical Effectiveness */}
                <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/60">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-neutral-400">Historical Pass</span>
                    <span className="text-neutral-200 font-semibold">{cand.historicalEffectiveness}%</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400/80 rounded-full"
                      style={{ width: `${cand.historicalEffectiveness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#C8A84E] font-semibold">Selection Logic:</span>
          <span>Formula = 35% User DNA + 35% Device Fit + 15% Benefit + 15% Historical Pass</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">SIMULATED ARBITRATION</span>
      </div>
    </div>
  );
};
