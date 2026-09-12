import React from 'react';
import { Trophy, Gamepad2, Zap, Sparkles } from 'lucide-react';

export function GamerFirstSummary() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            PLAYER IMPACT
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Gamer Experience
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight uppercase">
          WHAT THIS MEANS FOR THE PLAYER
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-1 leading-relaxed">
          Translating technical device intelligence into tangible real-world gameplay benefits.
        </p>
      </div>

      {/* Three Concise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-lg bg-vyra-dark border border-vyra-border/60 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-vyra-gold" />
            <span className="font-display text-xs font-bold text-white uppercase">
              COMPETITIVE
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-body leading-relaxed">
            &ldquo;Fewer unexpected performance drops during long sessions.&rdquo;
          </p>
          <div className="text-[9px] font-mono text-neutral-500 pt-1">
            Tournament-ready consistency
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-vyra-dark border border-vyra-border/60 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 size={14} className="text-emerald-400" />
            <span className="font-display text-xs font-bold text-white uppercase">
              EVERYDAY GAMING
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-body leading-relaxed">
            &ldquo;Less manual tuning before and during gameplay.&rdquo;
          </p>
          <div className="text-[9px] font-mono text-neutral-500 pt-1">
            Zero mode toggle fatigue
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-vyra-dark border border-vyra-border/60 space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue-400" />
            <span className="font-display text-xs font-bold text-white uppercase">
              POWER USERS
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-body leading-relaxed">
            &ldquo;Performance behaviour adapts to demanding workloads beyond gaming.&rdquo;
          </p>
          <div className="text-[9px] font-mono text-neutral-500 pt-1">
            Streaming & 4K editing
          </div>
        </div>
      </div>

      {/* Final Product Statement (Step 9 Requirement 15) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#1C160B] via-[#2A200E] to-[#1C160B] border border-[#C8A84E] text-center shadow-lg shadow-[#C8A84E]/15 space-y-2 animate-fade-in">
        <div className="text-[9px] font-mono tracking-[0.25em] text-[#C8A84E] uppercase font-bold">
          iQOO VYRA
        </div>
        <div className="text-xs sm:text-sm text-neutral-200 font-display font-semibold italic">
          &ldquo;From performance modes to personal performance intelligence.&rdquo;
        </div>
        <p className="text-[11px] text-neutral-300 font-body leading-relaxed max-w-xs mx-auto">
          &ldquo;Your device should not only know what it can do. It should learn how you need it to perform.&rdquo;
        </p>
        <div className="pt-1 border-t border-[#3E2F13]">
          <div className="text-xs sm:text-sm font-display font-extrabold text-white tracking-widest uppercase">
            YOUR iQOO LEARNS HOW YOU PLAY.
          </div>
        </div>
      </div>
    </div>
  );
}
