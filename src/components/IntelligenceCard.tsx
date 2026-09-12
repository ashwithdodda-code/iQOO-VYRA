import { Prediction } from '../types';
import { Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';

interface Props {
  prediction: Prediction | null;
  riskScore?: number;
  onStartSession: () => void;
  isSessionActive: boolean;
}

export function IntelligenceCard({
  prediction,
  riskScore = 12,
  onStartSession,
  isSessionActive,
}: Props) {
  const message = prediction?.message ?? 'Stable performance predicted.';
  const cause =
    prediction?.primaryCause ??
    'Current session conditions match your learned performance pattern.';
  const confidence = prediction?.confidence ?? 0.92;
  const isWarning = prediction && prediction.type !== 'STABLE';

  return (
    <div className={`bg-vyra-surface border ${isWarning ? 'border-[#553315]' : 'border-vyra-border'} rounded-md p-4 animate-fade-in-up`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <AlertTriangle size={14} className="text-vyra-amber" strokeWidth={1.5} />
          ) : (
            <Sparkles size={14} className="text-vyra-gold" strokeWidth={1.5} />
          )}
          <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body">
            VYRA INTELLIGENCE
          </span>
        </div>
        {typeof riskScore === 'number' && (
          <span className="text-[9px] font-mono text-vyra-muted">
            RISK {riskScore}/100
          </span>
        )}
      </div>

      <p className="font-display text-sm font-medium text-vyra-white mb-1.5">
        &ldquo;{message}&rdquo;
      </p>
      <p className="text-xs text-vyra-muted font-body mb-4 leading-relaxed">
        {cause}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] tracking-[0.15em] text-vyra-muted mb-0.5 font-body">
            CONFIDENCE
          </div>
          <div className="font-display text-base font-semibold text-vyra-white">
            {Math.round(confidence * 100)}%
          </div>
        </div>
        <div className="h-1 flex-1 mx-4 bg-vyra-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-vyra-gold rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {!isSessionActive && (
        <button
          onClick={onStartSession}
          className="w-full bg-vyra-white text-vyra-black font-display text-xs font-semibold tracking-[0.15em] py-2.5 rounded flex items-center justify-center gap-2 hover:bg-vyra-text active:scale-[0.98] transition-all duration-150"
        >
          START SESSION
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
