import React from 'react';
import { RefreshCw, TrendingUp, Sparkles, Award } from 'lucide-react';

export function LearningDeltaCard() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-4 shadow-xl space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className="text-vyra-gold animate-spin-slow" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            LEARNING DELTA
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Prototype learning simulation
        </span>
      </div>

      <p className="text-xs text-vyra-muted font-body leading-relaxed">
        Demonstrates how the closed-loop engine refines its predictive weights from observed session verifications:
      </p>

      {/* 3 Metric Improvement Rows */}
      <div className="space-y-2 text-xs font-mono">
        <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60 flex items-center justify-between">
          <span className="text-neutral-300">Prediction accuracy</span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 line-through">72%</span>
            <span className="text-vyra-gold font-bold">→ 81%</span>
            <span className="text-[8px] font-mono px-1 rounded bg-vyra-gold/20 text-vyra-gold">+9%</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60 flex items-center justify-between">
          <span className="text-neutral-300">Strategy effectiveness</span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 line-through">68%</span>
            <span className="text-emerald-400 font-bold">→ 79%</span>
            <span className="text-[8px] font-mono px-1 rounded bg-emerald-950 text-emerald-400">+11%</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60 flex items-center justify-between">
          <span className="text-neutral-300">User preference confidence</span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 line-through">74%</span>
            <span className="text-cyan-400 font-bold">→ 86%</span>
            <span className="text-[8px] font-mono px-1 rounded bg-cyan-950 text-cyan-400">+12%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
