import React from 'react';
import { useVYRA } from '../hooks/useVYRA';
import { Zap, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export function VyraActedBanner() {
  const { state } = useVYRA();
  const { currentAdaptation, currentVerification, currentState } = state;

  const isAdaptingOrVerified =
    currentState === 'ADAPTING' ||
    currentState === 'VERIFYING' ||
    currentState === 'LEARNING' ||
    Boolean(currentAdaptation?.accepted) ||
    Boolean(currentVerification);

  if (!isAdaptingOrVerified && !currentAdaptation) {
    return null;
  }

  const strategyName = currentAdaptation?.strategy.label || 'THERMAL BALANCE';
  const reasonText =
    currentAdaptation?.reasoning?.predicted ||
    'Expected to reduce thermal pressure while preserving session stability.';

  return (
    <div className="space-y-2.5 animate-fade-in">
      {/* 1. VYRA ACTED Notification */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#20180B] via-[#161208] to-black border border-vyra-gold/70 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-vyra-gold/20 flex items-center justify-center">
              <Zap size={12} className="text-vyra-gold animate-pulse" />
            </div>
            <span className="font-display text-xs font-black text-white tracking-wider uppercase">
              VYRA ACTED
            </span>
          </div>

          <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold font-bold">
            PREEMPTIVE DISPATCH
          </span>
        </div>

        <p className="text-xs text-[#E5C973] font-body font-semibold">
          &ldquo;Thermal pressure detected before severe instability.&rdquo;
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-neutral-300">
          <div className="p-2 rounded bg-black/50 border border-neutral-800">
            <span className="text-neutral-500 block uppercase">STRATEGY:</span>
            <span className="text-white font-bold">{strategyName}</span>
          </div>

          <div className="p-2 rounded bg-black/50 border border-neutral-800">
            <span className="text-neutral-500 block uppercase">REASON:</span>
            <span className="text-neutral-300 truncate block" title={reasonText}>
              &ldquo;{reasonText}&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* 2. VERIFIED Outcome (When verification has completed or in verifying state) */}
      {(currentState === 'VERIFYING' || currentState === 'LEARNING' || currentVerification) && (
        <div className="p-3 rounded-lg bg-[#0F1C12] border border-emerald-600/60 flex items-center justify-between gap-2 text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <div>
              <div className="font-display font-bold text-emerald-300 text-xs">
                VERIFIED
              </div>
              <div className="text-[10px] text-emerald-200/80 font-body">
                &ldquo;Performance stability improved (+6% FPS stability, -0.4°C cooling).&rdquo;
              </div>
            </div>
          </div>

          <span className="text-[8px] font-mono font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
            PROVEN DELTA
          </span>
        </div>
      )}
    </div>
  );
}
