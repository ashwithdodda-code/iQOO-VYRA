import React, { useState } from 'react';
import { useVYRA } from '../hooks/useVYRA';
import {
  Users,
  CheckCircle,
  Crosshair,
  Battery,
  Flame,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function PersonalizationProofCard() {
  const [selectedPlayer, setSelectedPlayer] = useState<'PLAYER_A' | 'PLAYER_B'>('PLAYER_A');
  const { setProfilePreset } = useVYRA();

  const handleSelectPlayer = (player: 'PLAYER_A' | 'PLAYER_B') => {
    setSelectedPlayer(player);
    setProfilePreset(player === 'PLAYER_A' ? 'PROFILE_A' : 'PROFILE_B');
  };

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            PERSONALIZATION PROOF
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Core Differentiator
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight">
          Same Conditions. Different Player. Different Decision.
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-1 leading-relaxed">
          Generic phones force the same performance mode on everyone. VYRA learns the player&apos;s unique priorities and selects distinct optimal strategies under identical device stress.
        </p>
      </div>

      {/* Identical Baseline Banner */}
      <div className="p-3 rounded bg-vyra-dark border border-vyra-border/60 text-[10px] font-mono flex items-center justify-between">
        <span className="text-neutral-400 uppercase">IDENTICAL MATCH CONDITIONS:</span>
        <span className="text-amber-400 font-bold">38.5°C · 25m RANKED MATCH · 91% GPU</span>
      </div>

      {/* Player Selector Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSelectPlayer('PLAYER_A')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedPlayer === 'PLAYER_A'
              ? 'bg-[#1D170A] border-vyra-gold text-white shadow-md shadow-vyra-gold/15'
              : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-xs font-bold text-vyra-gold">PLAYER A</span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold">
              COMPETITIVE
            </span>
          </div>
          <div className="text-[11px] text-white font-medium">Maximum Stability</div>
          <div className="text-[9px] font-mono text-neutral-400 mt-1">Zero jitter priority</div>
        </button>

        <button
          onClick={() => handleSelectPlayer('PLAYER_B')}
          className={`p-3 rounded-lg border text-left transition-all ${
            selectedPlayer === 'PLAYER_B'
              ? 'bg-[#0E1620] border-blue-500 text-white shadow-md shadow-blue-500/15'
              : 'bg-vyra-dark border-vyra-border/60 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-xs font-bold text-blue-400">PLAYER B</span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              CASUAL
            </span>
          </div>
          <div className="text-[11px] text-white font-medium">Battery Efficiency</div>
          <div className="text-[9px] font-mono text-neutral-400 mt-1">Cool chassis priority</div>
        </button>
      </div>

      {/* Player Profile Details & Strategy Decision */}
      {selectedPlayer === 'PLAYER_A' ? (
        <div className="p-4 rounded-lg bg-[#161208] border border-vyra-gold/60 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-display font-bold text-white">
                PLAYER A PERFORMANCE DNA PROFILE
              </span>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                Priority: Maximum Stability
              </div>
            </div>
            <div className="text-right font-mono text-[10px]">
              <span className="text-neutral-400">DECISION:</span>
              <div className="text-vyra-gold font-bold text-xs">STABILITY FIRST</div>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] font-body text-neutral-300">
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-vyra-gold shrink-0 mt-0.5" />
              <span><strong>DNA Signals:</strong> Highly sensitive to frame-time spikes (0.94 weight), long competitive sessions (35m+ avg).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-vyra-gold shrink-0 mt-0.5" />
              <span><strong>Tolerances:</strong> Prefers consistent performance; accepts higher battery consumption.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Intervention:</strong> Locks 16.6ms frame pacing, overclocks touch polling to 1000Hz burst mode, expands vapor chamber heat dissipation curve.</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-vyra-gold/30 text-[10px] font-mono text-vyra-gold flex items-center justify-between">
            <span>OUTCOME: 98.4% Frame Stability Preserved</span>
            <span className="text-white">Zero Stutter</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-[#0A121A] border border-blue-900/70 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-display font-bold text-white">
                PLAYER B PERFORMANCE DNA PROFILE
              </span>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                Priority: Battery Efficiency
              </div>
            </div>
            <div className="text-right font-mono text-[10px]">
              <span className="text-neutral-400">DECISION:</span>
              <div className="text-blue-400 font-bold text-xs">BATTERY EFFICIENCY / THERMAL</div>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] font-body text-neutral-300">
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <span><strong>DNA Signals:</strong> Shorter sessions (15m avg), low thermal tolerance (wants cool phone &lt; 37.5°C).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Tolerances:</strong> Prioritizes runtime battery life (0.88 weight); comfortably accepts small frame variance.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Intervention:</strong> Shifts non-essential threads to efficiency clusters, caps high-voltage boost, maintains cool surface touch.</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-black/60 border border-blue-900/40 text-[10px] font-mono text-blue-300 flex items-center justify-between">
            <span>OUTCOME: +38m Extra Runtime · Chassis &lt; 37.5°C</span>
            <span className="text-white">Comfort First</span>
          </div>
        </div>
      )}

      {/* Main Differentiator Callout Statement */}
      <div className="p-3.5 rounded bg-gradient-to-r from-[#17130A] to-[#0D0B06] border border-vyra-gold/40 text-center space-y-1">
        <div className="font-display text-xs font-bold text-[#E5C973] uppercase tracking-wider">
          &ldquo;Same device. Same game. Same conditions. Different optimal strategy.&rdquo;
        </div>
        <div className="text-[10px] text-neutral-400 font-body">
          VYRA optimizes for the human player, not just raw benchmark synthetic loops.
        </div>
      </div>
    </div>
  );
}
