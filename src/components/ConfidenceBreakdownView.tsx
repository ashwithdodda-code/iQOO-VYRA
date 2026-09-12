import { ConfidenceBreakdown } from '../types';
import { ShieldAlert, BarChart2 } from 'lucide-react';

interface Props {
  breakdown?: ConfidenceBreakdown;
}

const DEFAULT_BREAKDOWN: ConfidenceBreakdown = {
  overall: 91,
  signalConfidence: 94,
  trendConfidence: 89,
  userHistoryConfidence: 91,
  strategyConfidence: 90,
};

export function ConfidenceBreakdownView({ breakdown = DEFAULT_BREAKDOWN }: Props) {
  const items = [
    {
      label: 'Signal Confidence',
      value: breakdown.signalConfidence,
      sub: 'Sensor freshness & telemetry variance',
    },
    {
      label: 'Trend Confidence',
      value: breakdown.trendConfidence,
      sub: 'Multi-interval slope acceleration match',
    },
    {
      label: 'User-History Confidence',
      value: breakdown.userHistoryConfidence,
      sub: 'Historical pattern match across sessions',
    },
    {
      label: 'Strategy Confidence',
      value: breakdown.strategyConfidence,
      sub: 'Verified intervention pass rate in memory',
    },
  ];

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body">
            INFERENCE RELIABILITY
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-vyra-muted">OVERALL:</span>
          <span className="text-vyra-white font-bold">{breakdown.overall}%</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-vyra-text font-body">{item.label}</span>
              <span className="font-mono text-[11px] text-vyra-white font-semibold">
                {item.value}%
              </span>
            </div>
            <div className="h-1 w-full bg-vyra-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-vyra-gold rounded-full transition-all duration-700 ease-out"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <div className="text-[9px] text-vyra-muted font-mono">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
