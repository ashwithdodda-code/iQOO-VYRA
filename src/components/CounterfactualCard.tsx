import { useState } from 'react';
import { CounterfactualComparison } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, AlertOctagon, ShieldCheck } from 'lucide-react';

interface Props {
  counterfactual?: CounterfactualComparison;
}

const DEFAULT_COUNTERFACTUAL: CounterfactualComparison = {
  withoutVyra: {
    temperature: '36.8°C → 39.4°C',
    fpsStability: '95% → 88%',
    frameTimeVariance: '+31%',
    riskOutcome: 'Skin thermal ceiling breached; burst throttling',
  },
  withVyra: {
    temperature: '36.8°C → 37.6°C',
    fpsStability: '95% → 97%',
    frameTimeVariance: '-14%',
    riskOutcome: 'Paced GPU frame queue; locked 60 FPS VRR presentation',
  },
  simulatedDeltaText:
    'Prevents +31% frame jitter spike and limits thermal climb to +0.8°C instead of +2.6°C.',
};

export function CounterfactualCard({ counterfactual = DEFAULT_COUNTERFACTUAL }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      {/* Header with expand toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            COUNTERFACTUAL SIMULATION
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-vyra-muted font-mono">
          <span>WHAT IF VYRA DID NOTHING?</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-vyra-border/50 animate-fade-in">
          {/* Label banner */}
          <div className="flex items-center justify-between mb-3 text-[9px] font-mono">
            <span className="text-vyra-muted">PROJECTED NEXT INTERVAL</span>
            <span className="text-vyra-amber bg-[#22170E] px-1.5 py-0.5 rounded border border-vyra-amber/30">
              SIMULATED OUTCOME
            </span>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* WITHOUT VYRA */}
            <div className="bg-[#1C1214] border border-[#441C20] rounded p-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-vyra-red text-[10px] font-bold tracking-wider mb-2">
                <AlertOctagon size={12} />
                WITHOUT VYRA
              </div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">TEMPERATURE</div>
                  <div className="text-vyra-text font-semibold">
                    {counterfactual.withoutVyra.temperature}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">FPS STABILITY</div>
                  <div className="text-vyra-red font-semibold">
                    {counterfactual.withoutVyra.fpsStability}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">FRAME VARIANCE</div>
                  <div className="text-vyra-red font-semibold">
                    {counterfactual.withoutVyra.frameTimeVariance}
                  </div>
                </div>
                <div className="pt-1 text-[9px] text-vyra-muted font-body leading-tight">
                  {counterfactual.withoutVyra.riskOutcome}
                </div>
              </div>
            </div>

            {/* WITH VYRA */}
            <div className="bg-[#0E1F14] border border-[#1E4E2C] rounded p-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-vyra-green text-[10px] font-bold tracking-wider mb-2">
                <ShieldCheck size={12} />
                WITH VYRA
              </div>
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">TEMPERATURE</div>
                  <div className="text-vyra-text font-semibold">
                    {counterfactual.withVyra.temperature}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">FPS STABILITY</div>
                  <div className="text-vyra-green font-semibold">
                    {counterfactual.withVyra.fpsStability}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] text-vyra-muted font-body">FRAME VARIANCE</div>
                  <div className="text-vyra-green font-semibold">
                    {counterfactual.withVyra.frameTimeVariance}
                  </div>
                </div>
                <div className="pt-1 text-[9px] text-vyra-muted font-body leading-tight">
                  {counterfactual.withVyra.riskOutcome}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-vyra-text font-body leading-relaxed bg-vyra-dark p-2 rounded border border-vyra-border/40">
            <span className="text-vyra-gold font-medium">VYRA Value Delta:</span>{' '}
            {counterfactual.simulatedDeltaText}
          </p>
        </div>
      )}
    </div>
  );
}
