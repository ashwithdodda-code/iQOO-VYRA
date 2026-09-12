import { UserIntent } from '../types';
import { INTENT_CONFIGS } from '../data/intentData';
import { Compass, Sparkles } from 'lucide-react';

interface Props {
  selectedIntent: UserIntent;
  onSelectIntent: (intent: UserIntent) => void;
  compact?: boolean;
}

export function IntentSelector({
  selectedIntent,
  onSelectIntent,
  compact = false,
}: Props) {
  const currentConfig = INTENT_CONFIGS[selectedIntent];

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            INTENT-DRIVEN INTELLIGENCE
          </span>
        </div>
        <span className="text-[9px] font-mono text-vyra-muted">DYNAMIC BIAS</span>
      </div>

      <h3 className="font-display text-sm font-semibold text-vyra-white mb-1">
        WHAT MATTERS MOST RIGHT NOW?
      </h3>
      <p className="text-[11px] text-vyra-muted font-body mb-3 leading-relaxed">
        {currentConfig.shortDescription}
      </p>

      {/* 6 Intent Chips Grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {(Object.keys(INTENT_CONFIGS) as UserIntent[]).map((key) => {
          const cfg = INTENT_CONFIGS[key];
          const isSelected = selectedIntent === key;
          return (
            <button
              key={key}
              onClick={() => onSelectIntent(key)}
              className={`px-2 py-2 rounded text-center transition-all ${
                isSelected
                  ? 'bg-vyra-gold text-vyra-black font-bold shadow-[0_0_10px_rgba(200,168,78,0.25)] border border-vyra-gold'
                  : 'bg-vyra-dark border border-vyra-border/70 text-vyra-muted hover:text-vyra-text hover:border-vyra-border'
              }`}
            >
              <div className="font-display text-[9px] tracking-wider leading-tight">
                {cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Core Intelligence Formula Banner */}
      {!compact && (
        <div className="p-2.5 bg-vyra-dark rounded border border-vyra-border/50 text-[9px] font-mono text-vyra-muted">
          <div className="flex items-center gap-1 text-[8px] text-vyra-gold mb-1 tracking-wider">
            <Sparkles size={10} />
            REAL-TIME SYNTHESIS FORMULA
          </div>
          <div className="flex flex-wrap items-center gap-1 text-vyra-text font-semibold">
            <span className="text-vyra-gold">{selectedIntent.replace('_', ' ')}</span>
            <span className="text-vyra-muted">+</span>
            <span>USER DNA</span>
            <span className="text-vyra-muted">+</span>
            <span>DEVICE STATE</span>
            <span className="text-vyra-muted">+</span>
            <span>WORKLOAD</span>
            <span className="text-vyra-muted">=</span>
            <span className="text-vyra-green">VYRA ADAPTATION</span>
          </div>
        </div>
      )}
    </div>
  );
}
