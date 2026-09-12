import React from 'react';
import { ArrowDown, Check, Sparkles } from 'lucide-react';

const STAGES = [
  { label: 'FIXED MODE', subtext: 'Static OEM toggles (Normal / Monster / Eco)', isVyra: false },
  { label: 'MANUAL TUNING', subtext: 'User manually tweaks sliders during match', isVyra: false },
  { label: 'ADAPTIVE OPTIMIZATION', subtext: 'Reactive system response after heat spikes', isVyra: false },
  { label: 'PREDICTIVE PERSONAL PERFORMANCE', subtext: 'Closed-loop adaptation before degradation occurs', isVyra: false },
  { label: 'iQOO VYRA', subtext: 'Personal Performance Intelligence learning you', isVyra: true },
];

export function ModeToIntelligenceGraphic() {
  return (
    <div className="bg-gradient-to-b from-[#181308] via-[#0F0D07] to-[#0A0A0A] border border-[#3E2F13] rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Headlines */}
      <div className="text-center max-w-sm mx-auto space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#E5C973]">
          <Sparkles size={12} className="text-[#C8A84E]" />
          <span>PARADIGM EVOLUTION</span>
        </div>

        <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          From performance modes to personal performance intelligence.
        </h3>

        <p className="text-xs text-neutral-300 font-body leading-relaxed pt-1">
          Traditional systems optimize the device. VYRA learns how the individual wants the device to perform.
        </p>
      </div>

      {/* Evolution Ladder Graphic */}
      <div className="max-w-xs mx-auto space-y-1.5 pt-2">
        {STAGES.map((stage, idx) => (
          <React.Fragment key={stage.label}>
            <div
              className={`p-2.5 rounded-lg border text-center transition-all ${
                stage.isVyra
                  ? 'bg-gradient-to-r from-[#2A200C] via-[#3D2E12] to-[#2A200C] border-[#C8A84E] shadow-lg shadow-[#C8A84E]/15'
                  : 'bg-vyra-dark/70 border-vyra-border/50 text-neutral-400'
              }`}
            >
              <div
                className={`font-display text-xs font-bold tracking-wider ${
                  stage.isVyra ? 'text-white text-sm' : 'text-neutral-300'
                }`}
              >
                {stage.label}
              </div>
              <div
                className={`text-[9px] font-mono mt-0.5 ${
                  stage.isVyra ? 'text-[#E5C973] font-semibold' : 'text-neutral-500'
                }`}
              >
                {stage.subtext}
              </div>
            </div>

            {idx < STAGES.length - 1 && (
              <div className="flex justify-center text-neutral-600 my-0.5">
                <ArrowDown size={13} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
