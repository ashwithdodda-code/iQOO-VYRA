import { PRESET_PROFILES } from '../engine/predictiveAdvantage';
import { Users, Check, ArrowRight } from 'lucide-react';

interface Props {
  activePreset: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE';
  onSelectPreset: (preset: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE') => void;
}

export function PersonalizationComparisonCard({
  activePreset,
  onSelectPreset,
}: Props) {
  const profileA = PRESET_PROFILES.PROFILE_A;
  const profileB = PRESET_PROFILES.PROFILE_B;

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            PERSONALIZATION ENGINE
          </span>
        </div>
        <span className="text-[9px] font-mono text-vyra-muted">
          SWITCH TEST PROFILES
        </span>
      </div>

      <h3 className="font-display text-sm font-semibold text-vyra-white mb-1">
        SAME PHONE. DIFFERENT OPTIMAL PERFORMANCE.
      </h3>
      <p className="text-[11px] text-vyra-muted font-body mb-3.5 leading-relaxed">
        Test how identical thermal and GPU conditions yield completely different optimal strategies depending on the user.
      </p>

      {/* Two Profile Selector Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        {/* Profile A */}
        <button
          onClick={() => onSelectPreset('PROFILE_A')}
          className={`p-3 rounded border text-left transition-all ${
            activePreset === 'PROFILE_A'
              ? 'bg-vyra-dark border-vyra-gold ring-1 ring-vyra-gold/50 text-vyra-white'
              : 'bg-vyra-dark border-vyra-border/60 text-vyra-muted hover:border-vyra-border'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-vyra-gold font-bold">
              PROFILE A
            </span>
            {activePreset === 'PROFILE_A' && (
              <Check size={12} className="text-vyra-gold" />
            )}
          </div>
          <div className="font-display text-xs font-bold text-vyra-white leading-tight">
            COMPETITIVE GAMER
          </div>
          <div className="text-[9px] text-vyra-muted font-mono mt-1">
            Comp: 94% · Batt: 28%
          </div>
          <div className="mt-2 pt-1.5 border-t border-vyra-border/40 text-[9px] font-mono text-vyra-green font-semibold">
            → STABILITY FIRST
          </div>
        </button>

        {/* Profile B */}
        <button
          onClick={() => onSelectPreset('PROFILE_B')}
          className={`p-3 rounded border text-left transition-all ${
            activePreset === 'PROFILE_B'
              ? 'bg-vyra-dark border-vyra-gold ring-1 ring-vyra-gold/50 text-vyra-white'
              : 'bg-vyra-dark border-vyra-border/60 text-vyra-muted hover:border-vyra-border'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-vyra-gold font-bold">
              PROFILE B
            </span>
            {activePreset === 'PROFILE_B' && (
              <Check size={12} className="text-vyra-gold" />
            )}
          </div>
          <div className="font-display text-xs font-bold text-vyra-white leading-tight">
            ENDURANCE USER
          </div>
          <div className="text-[9px] text-vyra-muted font-mono mt-1">
            Comp: 35% · Batt: 85%
          </div>
          <div className="mt-2 pt-1.5 border-t border-vyra-border/40 text-[9px] font-mono text-vyra-green font-semibold">
            → THERMAL BALANCE
          </div>
        </button>
      </div>

      {/* Core Principle Banner */}
      <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/50 text-[9px] font-mono text-vyra-muted">
        <div className="flex flex-wrap items-center gap-1 text-vyra-text font-semibold">
          <span className="text-vyra-muted">SAME DEVICE</span>
          <span>+</span>
          <span className="text-vyra-muted">SAME WORKLOAD</span>
          <span>+</span>
          <span className="text-vyra-gold">DIFFERENT PRIORITIES</span>
          <span>=</span>
          <span className="text-vyra-green">DIFFERENT STRATEGY</span>
        </div>
      </div>
    </div>
  );
}
