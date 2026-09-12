import { AdaptationDecision } from '../types';
import { Zap, Check, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  decision: AdaptationDecision | null;
  onApply: () => void;
  isApplied: boolean;
}

export function AdaptationCard({ decision, onApply, isApplied }: Props) {
  if (!decision) return null;

  const { strategy, reasoning } = decision;

  return (
    <div className="bg-vyra-surface border border-vyra-gold/50 rounded-md p-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            VYRA RECOMMENDS
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-vyra-gold font-mono">
          <Sparkles size={11} strokeWidth={1.5} />
          <span>CONFIDENCE {reasoning.confidence}%</span>
        </div>
      </div>

      {/* Selected Strategy Label */}
      <div className="mb-3">
        <h3 className="font-display text-lg font-bold text-vyra-white tracking-wide">
          {strategy.label}
        </h3>
        <p className="text-xs text-vyra-text font-body mt-1 leading-relaxed">
          {strategy.description}
        </p>
      </div>

      {/* Engineering Decision Matrix / Explanation */}
      <div className="bg-vyra-dark/80 border border-vyra-border rounded p-3 mb-4 space-y-2.5 text-xs font-body">
        {/* Detected */}
        <div>
          <div className="text-[9px] font-mono tracking-wider text-vyra-gold mb-1">
            VYRA DETECTED
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-vyra-muted">
            {reasoning.detected.map((d) => (
              <div key={d.label}>
                <span className="text-vyra-text">{d.label}:</span> {d.value}
              </div>
            ))}
          </div>
        </div>

        {/* Predicted */}
        <div className="pt-2 border-t border-vyra-border/40">
          <div className="text-[9px] font-mono tracking-wider text-vyra-amber mb-0.5">
            VYRA PREDICTED
          </div>
          <div className="text-[11px] text-vyra-text">
            {reasoning.predicted}
          </div>
        </div>

        {/* Prioritized */}
        <div className="pt-2 border-t border-vyra-border/40">
          <div className="text-[9px] font-mono tracking-wider text-vyra-gold mb-0.5">
            VYRA PRIORITIZED
          </div>
          <div className="text-[11px] text-vyra-text">
            {reasoning.prioritized}
          </div>
        </div>

        {/* Selected */}
        <div className="pt-2 border-t border-vyra-border/40 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono tracking-wider text-vyra-green mb-0.5">
              VYRA SELECTED
            </div>
            <div className="font-display text-xs font-semibold text-vyra-white">
              {strategy.label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono text-vyra-muted">ALGORITHM</div>
            <div className="text-[10px] text-vyra-gold font-mono">DETERMINISTIC V3</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isApplied ? (
        <div className="w-full bg-[#142618] border border-vyra-green/40 text-vyra-green font-display text-xs font-semibold tracking-wider py-2.5 px-4 rounded flex items-center justify-center gap-2">
          <Check size={14} strokeWidth={2} />
          INTERVENTION ACTIVE — VERIFYING STABILIZATION
        </div>
      ) : (
        <button
          onClick={onApply}
          className="w-full bg-vyra-white text-vyra-black font-display text-xs font-semibold tracking-[0.15em] py-2.5 px-4 rounded flex items-center justify-center gap-2 hover:bg-vyra-text active:scale-[0.98] transition-all duration-150"
        >
          APPLY STRATEGY RECOMMENDATION
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
