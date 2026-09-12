import React from 'react';
import { useVYRA } from '../hooks/useVYRA';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function UpgradedPredictionCard() {
  const { state } = useVYRA();
  const {
    earlyWarningLevel,
    predictiveWindow,
    rootCauseAnalysis,
    currentPrediction,
    currentAdaptation,
    riskScore,
    currentTelemetry,
  } = state;

  const currentLevel = earlyWarningLevel; // 'STABLE' | 'WATCH' | 'INTERVENE'

  const estimatedCause =
    rootCauseAnalysis?.predictedRootCause ||
    currentPrediction?.primaryCause ||
    'Thermal trend + frame-time variance';

  const actionText = currentAdaptation
    ? `EXECUTE ${currentAdaptation.strategy.label.toUpperCase()}`
    : currentLevel === 'INTERVENE'
    ? 'ENGAGE PREEMPTIVE STABILITY PACING'
    : currentLevel === 'WATCH'
    ? 'PREPARE THERMAL BALANCE'
    : 'STANDBY (PREDICTIVE MONITORING ACTIVE)';

  const windowText = predictiveWindow.formattedTime
    ? `${predictiveWindow.formattedTime} remaining`
    : 'Stable horizon (>5 min)';

  return (
    <div className="bg-gradient-to-br from-[#1C170B] via-[#120F08] to-[#0A0A0A] border border-[#483716] rounded-xl p-5 shadow-2xl space-y-4 animate-fade-in relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#C8A84E]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-[#E5C973] font-semibold">
          <TrendingUp size={13} className="text-[#C8A84E]" />
          <span>PERFORMANCE PREDICTION</span>
        </div>

        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Acts Ahead of Throttling
        </span>
      </div>

      {/* 3-Stage Progression Bar: STABLE → WATCH → INTERVENE */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-center">
          <div
            className={`p-2 rounded border transition-all ${
              currentLevel === 'STABLE'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950'
                : 'bg-black/30 border-neutral-800 text-neutral-500'
            }`}
          >
            STABLE
          </div>

          <div
            className={`p-2 rounded border transition-all ${
              currentLevel === 'WATCH'
                ? 'bg-[#3A2A0B] border-vyra-gold text-[#E5C973] font-bold shadow-md shadow-vyra-gold/20 animate-pulse'
                : 'bg-black/30 border-neutral-800 text-neutral-500'
            }`}
          >
            WATCH
          </div>

          <div
            className={`p-2 rounded border transition-all ${
              currentLevel === 'INTERVENE'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-950 animate-pulse'
                : 'bg-black/30 border-neutral-800 text-neutral-500'
            }`}
          >
            INTERVENE
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 px-0.5">
          <span>RISK SCORE: {riskScore}/100</span>
          <span>PREDICTIVE WINDOW: {windowText}</span>
        </div>
      </div>

      {/* Current State & Predicted Next State Banner */}
      <div className="p-3.5 rounded-lg bg-black/60 border border-[#3E2F13] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold text-white tracking-tight">
            {currentLevel === 'STABLE'
              ? 'Performance Nominal & Stable'
              : currentLevel === 'WATCH'
              ? 'Potential Stability Degradation Predicted'
              : 'Critical Degradation Imminent — Intervening'}
          </span>
          <span
            className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold ${
              currentLevel === 'INTERVENE'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : currentLevel === 'WATCH'
                ? 'bg-[#2A200E] text-vyra-gold border border-vyra-gold/50'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}
          >
            {currentLevel}
          </span>
        </div>

        {/* Estimated Cause & Predicted Window */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-neutral-300">
          <div className="p-2 rounded bg-neutral-950/60 border border-neutral-900">
            <span className="text-neutral-500 text-[9px] block uppercase">ESTIMATED CAUSE:</span>
            <span className="text-white font-semibold">{estimatedCause}</span>
          </div>

          <div className="p-2 rounded bg-neutral-950/60 border border-neutral-900">
            <span className="text-neutral-500 text-[9px] block uppercase">TIME TO IMPACT:</span>
            <span className="text-vyra-gold font-bold">
              {predictiveWindow.formattedTime || '18 seconds'} lead time
            </span>
          </div>
        </div>
      </div>

      {/* Action Directive */}
      <div className="p-3 rounded-lg bg-[#181308] border border-vyra-gold/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-vyra-gold shrink-0" />
          <div>
            <div className="text-[8px] font-mono text-neutral-400 uppercase">
              RECOMMENDED PREEMPTIVE ACTION
            </div>
            <div className="font-display text-xs font-bold text-white mt-0.5">
              {actionText}
            </div>
          </div>
        </div>

        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold font-bold shrink-0">
          PRE-DROP
        </span>
      </div>
    </div>
  );
}
