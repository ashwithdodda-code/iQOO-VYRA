import React from 'react';
import { Sparkles, Trophy, Cpu, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export function LearnsHowYouPlayHero() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#1C160B] via-[#120F08] to-[#0A0A0A] border border-[#483716] p-5 shadow-2xl space-y-4 animate-fade-in">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#C8A84E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#E5C973]">
          <Sparkles size={13} className="text-[#C8A84E]" />
          <span>iQOO PERFORMANCE INTELLIGENCE</span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#C8A84E]/20 text-[#E5C973] border border-[#C8A84E]/40 font-bold">
          HYDERABAD BATTLE 2026
        </span>
      </div>

      {/* Core Anthem & Product Thesis */}
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
          YOUR iQOO LEARNS HOW YOU PLAY.
        </h2>
        <div className="font-display text-sm sm:text-base font-bold text-[#E5C973] mt-1">
          Not just: <span className="text-neutral-400 line-through decoration-neutral-600 font-normal">PEAK PERFORMANCE</span>.
          <br />
          But: <span className="text-white">PERSONAL PREDICTIVE SUSTAINED PERFORMANCE</span>.
        </div>
      </div>

      {/* Philosophy Callout */}
      <blockquote className="p-3 rounded bg-black/60 border-l-2 border-[#C8A84E] text-xs text-neutral-300 font-body italic leading-relaxed">
        &ldquo;Every phone knows how to run fast. VYRA learns how you need it to perform.&rdquo;
      </blockquote>

      {/* The 5-Step Continuous Closed-Loop Pill */}
      <div className="p-2.5 rounded bg-[#161208] border border-[#3E2F13] flex items-center justify-between text-[9px] font-mono font-bold text-[#E5C973]">
        <span>LEARN</span>
        <ArrowRight size={11} className="text-neutral-500" />
        <span>PREDICT</span>
        <ArrowRight size={11} className="text-neutral-500" />
        <span>ADAPT</span>
        <ArrowRight size={11} className="text-neutral-500" />
        <span>VERIFY</span>
        <ArrowRight size={11} className="text-neutral-500" />
        <span className="text-white">LEARN</span>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="p-2 rounded bg-black/40 border border-neutral-800">
          <div className="text-[8px] font-mono text-neutral-400 uppercase">PREDICTIVE</div>
          <div className="text-xs font-display font-bold text-white mt-0.5">Acts Ahead</div>
          <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Before heat spikes</div>
        </div>

        <div className="p-2 rounded bg-black/40 border border-neutral-800">
          <div className="text-[8px] font-mono text-neutral-400 uppercase">PERSONAL</div>
          <div className="text-xs font-display font-bold text-white mt-0.5">DNA-Driven</div>
          <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Custom to your playstyle</div>
        </div>

        <div className="p-2 rounded bg-black/40 border border-neutral-800">
          <div className="text-[8px] font-mono text-neutral-400 uppercase">SUSTAINED</div>
          <div className="text-xs font-display font-bold text-emerald-400 mt-0.5">Zero Drops</div>
          <div className="text-[8px] font-mono text-neutral-500 mt-0.5">Flatline 16.6ms pacing</div>
        </div>
      </div>
    </div>
  );
}
