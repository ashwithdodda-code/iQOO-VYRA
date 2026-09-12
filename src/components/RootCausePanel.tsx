import { RootCauseAnalysis } from '../types';
import { Target, Search, CheckCircle2 } from 'lucide-react';

interface Props {
  analysis: RootCauseAnalysis | null;
}

export function RootCausePanel({ analysis }: Props) {
  if (!analysis) return null;

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Target size={14} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            ROOT CAUSE ANALYSIS
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-vyra-green">
          <CheckCircle2 size={11} />
          <span>PATTERN MATCH {analysis.patternMatchPercentage}%</span>
        </div>
      </div>

      {/* Primary Root Cause Insight */}
      <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60 mb-3.5">
        <div className="text-[8px] font-mono text-vyra-amber uppercase tracking-wider mb-0.5">
          PREDICTED ROOT MECHANISM
        </div>
        <div className="text-xs text-vyra-white font-medium leading-relaxed font-body">
          &ldquo;{analysis.predictedRootCause}&rdquo;
        </div>
        <div className="text-[9px] text-vyra-muted font-mono mt-1">
          {analysis.primaryInsight}
        </div>
      </div>

      {/* Normalized Contributors Breakdown (Sum = 100%) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono text-vyra-muted tracking-wider">
          <span>CONTRIBUTING FACTOR</span>
          <span>WEIGHT / NORMALIZED IMPACT</span>
        </div>

        {analysis.contributors.map((c) => (
          <div key={c.factor} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-vyra-text font-body">{c.factor}</span>
                <span className="text-[9px] text-vyra-muted">({c.metricValue})</span>
              </div>
              <span className="text-[11px] text-vyra-gold font-semibold">
                {c.percentage}%
              </span>
            </div>
            <div className="h-1 w-full bg-vyra-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-vyra-gold/80 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${c.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
