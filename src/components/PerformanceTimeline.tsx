import { TimelineStepId } from '../types';
import { Check } from 'lucide-react';

const TIMELINE_STEPS: { id: TimelineStepId; label: string; number: string }[] = [
  { id: 'SESSION_START', label: 'START', number: '01' },
  { id: 'SIGNALS_OBSERVED', label: 'OBSERVE', number: '02' },
  { id: 'PATTERN_RECOGNIZED', label: 'PATTERN', number: '03' },
  { id: 'DEGRADATION_PREDICTED', label: 'PREDICT', number: '04' },
  { id: 'USER_PRIORITY_CHECKED', label: 'PRIORITY', number: '05' },
  { id: 'STRATEGY_SELECTED', label: 'ADAPT', number: '06' },
  { id: 'OUTCOME_VERIFIED', label: 'VERIFY', number: '07' },
  { id: 'PROFILE_UPDATED', label: 'LEARN', number: '08' },
];

interface Props {
  activeStep: TimelineStepId;
  onStepSelect?: (step: TimelineStepId) => void;
}

export function PerformanceTimeline({ activeStep, onStepSelect }: Props) {
  const activeIndex = TIMELINE_STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[9px] tracking-[0.2em] text-vyra-gold font-display font-medium">
          DECISION TIMELINE
        </div>
        <div className="text-[9px] font-mono text-vyra-muted">
          STEP {activeIndex + 1} OF 8
        </div>
      </div>

      {/* Horizontal step indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connecting background line */}
        <div className="absolute left-3 right-3 top-3 h-[1px] bg-vyra-border -z-0" />

        {TIMELINE_STEPS.map((step, idx) => {
          const isCurrent = step.id === activeStep;
          const isPassed = idx < activeIndex;

          return (
            <button
              key={step.id}
              onClick={() => onStepSelect?.(step.id)}
              className="flex flex-col items-center group relative z-10 focus:outline-none"
              title={step.label}
            >
              {/* Node dot */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono transition-all duration-300 ${
                  isCurrent
                    ? 'bg-vyra-gold text-vyra-black font-bold ring-2 ring-vyra-gold/40 scale-110 shadow-[0_0_8px_rgba(200,168,78,0.4)]'
                    : isPassed
                    ? 'bg-[#1C281E] border border-vyra-green/50 text-vyra-green'
                    : 'bg-vyra-dark border border-vyra-border text-vyra-muted'
                }`}
              >
                {isPassed ? <Check size={10} strokeWidth={2.5} /> : step.number}
              </div>

              {/* Label */}
              <span
                className={`text-[8px] tracking-wider mt-1 font-display font-medium transition-colors ${
                  isCurrent
                    ? 'text-vyra-gold font-bold'
                    : isPassed
                    ? 'text-vyra-text'
                    : 'text-vyra-muted'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
