import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Shield, ArrowDown } from 'lucide-react';

const ARCH_STAGES = [
  { step: 'DEVICE SIGNALS', desc: 'SoC thermistors, frame-pacing fences, touch bus, battery fuel gauge', tier: 'PROTOTYPE' },
  { step: 'LOCAL TELEMETRY', desc: 'Normalized 100ms telemetry window, second-order derivative slope extraction', tier: 'PROTOTYPE' },
  { step: 'VYRA INTELLIGENCE ENGINE', desc: 'Deterministic local state machine running <0.2ms zero-cloud inference', tier: 'PROTOTYPE' },
  { step: 'PREDICTION', desc: 'Predictive window horizon & multi-factor root cause diagnosis', tier: 'PROTOTYPE' },
  { step: 'STRATEGY SELECTION', desc: 'DNA-weighted utility scorer matching intent with optimal response', tier: 'PROTOTYPE' },
  { step: 'DEVICE ACTIONS', desc: 'sysfs governor clamp, 1000Hz touch burst, SurfaceFlinger pacing, bypass charging', tier: 'HYBRID' },
  { step: 'CLOSED-LOOP VERIFICATION', desc: 'Post-intervention telemetry delta verification against counterfactual', tier: 'PROTOTYPE' },
  { step: 'PERSONAL PERFORMANCE DNA', desc: 'Persistent local weights updated after validated session outcomes', tier: 'PROTOTYPE' },
];

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PrototypeArchitectureModal({ isOpen, onClose }: Props = {}) {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = isOpen !== undefined ? isOpen : internalExpanded;
  const toggleExpanded = () => {
    if (isOpen !== undefined && onClose) {
      onClose();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-4 shadow-xl space-y-3 animate-fade-in">
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            TECHNICAL TRUST
          </span>
        </div>

        <button
          onClick={toggleExpanded}
          className="flex items-center gap-1 text-[9px] font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <span>{isExpanded ? 'COLLAPSE' : 'PROTOTYPE ARCHITECTURE'}</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs font-display font-bold text-white">
        <span>PROTOTYPE ARCHITECTURE &amp; CREDIBILITY</span>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#20180B] text-[#E5C973] border border-[#3E2F13]">
          HONEST DISCLOSURE
        </span>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 animate-fade-in text-[10px] font-mono">
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-black/50 border border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-neutral-300 font-bold">IMPLEMENTED IN PROTOTYPE:</span>
            </div>
            <div className="text-neutral-400 text-[9px]">
              Complete local engine, telemetry model, DNA store, prediction &amp; verification
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-[#E5C973]" />
              <span className="text-neutral-300 font-bold">PRODUCTION TARGET:</span>
            </div>
            <div className="text-neutral-400 text-[9px] pt-1 border-t border-neutral-800">
              Direct OriginOS Game Space C++ HAL &amp; kernel sysfs controller
            </div>
          </div>

          {/* 8-Step Pipeline */}
          <div className="space-y-1.5 pt-1">
            {ARCH_STAGES.map((st, i) => (
              <React.Fragment key={st.step}>
                <div className="p-2 rounded bg-vyra-dark border border-vyra-border/60 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-[10px]">
                      {i + 1}. {st.step}
                    </div>
                    <div className="text-neutral-400 text-[9px] font-body">
                      {st.desc}
                    </div>
                  </div>

                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      st.tier === 'PROTOTYPE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-[#2A200C] text-[#E5C973] border border-[#3E2F13]'
                    }`}
                  >
                    {st.tier === 'PROTOTYPE' ? 'WORKING' : 'SIMULATED HAL'}
                  </span>
                </div>

                {i < ARCH_STAGES.length - 1 && (
                  <div className="flex justify-center text-neutral-600 my-0.2">
                    <ArrowDown size={11} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
