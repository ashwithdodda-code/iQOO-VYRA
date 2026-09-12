import React from 'react';
import { Cpu, Gamepad2, UserCheck, Sparkles } from 'lucide-react';

export function WhyItMattersToIQOO() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            PRODUCT VALUE PROPOSITION
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          iQOO Integration
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight uppercase">
          WHY iQOO VYRA?
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-0.5 leading-relaxed">
          How personal intelligence unlocks the full potential of iQOO flagship hardware.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="space-y-2.5">
        <div className="p-3 rounded-lg bg-vyra-dark border border-vyra-border/60 flex items-start gap-3">
          <div className="w-7 h-7 rounded bg-[#1D170A] border border-vyra-gold/50 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu size={14} className="text-vyra-gold" />
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white uppercase">
              PERFORMANCE HARDWARE
            </div>
            <p className="text-[11px] text-neutral-300 font-body mt-0.5 leading-relaxed">
              VYRA can use device telemetry and performance signals to reason about sustained workloads.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-vyra-dark border border-vyra-border/60 flex items-start gap-3">
          <div className="w-7 h-7 rounded bg-[#1D170A] border border-vyra-gold/50 flex items-center justify-center shrink-0 mt-0.5">
            <Gamepad2 size={14} className="text-vyra-gold" />
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white uppercase">
              GAMING-FIRST EXPERIENCE
            </div>
            <p className="text-[11px] text-neutral-300 font-body mt-0.5 leading-relaxed">
              The intelligence loop is designed around stability, latency, thermal behaviour and long-session gaming.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-vyra-dark border border-vyra-border/60 flex items-start gap-3">
          <div className="w-7 h-7 rounded bg-[#1D170A] border border-vyra-gold/50 flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck size={14} className="text-vyra-gold" />
          </div>
          <div>
            <div className="font-display text-xs font-bold text-white uppercase">
              PERSONALIZATION
            </div>
            <p className="text-[11px] text-neutral-300 font-body mt-0.5 leading-relaxed">
              The optimal performance strategy changes with the individual user.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Summary Callout */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-[#1E170A] via-[#141006] to-black border border-vyra-gold/50 text-center">
        <div className="font-display text-xs font-bold text-white leading-snug">
          &ldquo;VYRA turns iQOO&apos;s performance capabilities into a personalized, learning system.&rdquo;
        </div>
      </div>
    </div>
  );
}
