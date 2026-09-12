import { useState } from 'react';
import { DecisionTraceStep } from '../types';
import { GitBranch, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  trace?: DecisionTraceStep[];
  strategyLabel?: string;
}

const DEFAULT_TRACE: DecisionTraceStep[] = [
  {
    step: '01',
    label: 'Your workload',
    value: 'COMPETITIVE GAMING',
    detail: 'Continuous GPU frame submission with minimal tolerance for frame drops',
  },
  {
    step: '02',
    label: 'Your learned preference',
    value: 'FPS CONSISTENCY > BATTERY',
    detail: 'Personal DNA competitive priority 92% · Battery optimization secondary',
  },
  {
    step: '03',
    label: 'Current device state',
    value: 'THERMAL RISE DETECTED (+0.38°C/min, 37.8°C)',
    detail: 'Skin temperature slope indicates approaching throttling margin',
  },
  {
    step: '04',
    label: 'Predicted outcome',
    value: 'FPS INSTABILITY LIKELY IN ~4 MIN',
    detail: 'Frame variance estimated to escalate from 2.1ms to 8.5ms',
  },
  {
    step: '05',
    label: 'Selected strategy',
    value: 'STABILITY FIRST',
    detail: 'GPU dispatch pacing activated; clock variance curtailed',
  },
  {
    step: '06',
    label: 'Expected result',
    value: 'LOWER PERFORMANCE VARIANCE & SUSTAINED 60 FPS',
    detail: 'Maintains learned stability envelope without sudden clock collapse',
  },
];

export function DecisionTraceCard({
  trace = DEFAULT_TRACE,
  strategyLabel = 'STABILITY FIRST',
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            ENGINEERING DECISION TRACE
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-vyra-muted font-mono">
          <span>WHY THIS DECISION?</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-vyra-border/50 space-y-2.5 animate-fade-in">
          {trace.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-3 p-2 rounded bg-vyra-dark/60 border border-vyra-border/40 font-mono text-xs"
            >
              <span className="text-vyra-gold font-bold text-[10px] pt-0.5 shrink-0">
                {step.step}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] text-vyra-muted font-body uppercase tracking-wider">
                  {step.label}
                </div>
                <div className="text-vyra-white font-semibold text-xs mt-0.5 truncate">
                  {step.value}
                </div>
                {step.detail && (
                  <div className="text-[10px] text-vyra-muted font-body mt-0.5 leading-snug">
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
