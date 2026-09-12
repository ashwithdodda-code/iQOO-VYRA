import React from 'react';
import { useVYRA } from '../hooks/useVYRA';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export function JudgeFriendlyStatus() {
  const { state } = useVYRA();
  const { currentState, currentSession, currentAdaptation, riskScore, gameplayStabilityIndex } = state;

  const workloadLabel = currentSession?.workload
    ? `${currentSession.workload.charAt(0) + currentSession.workload.slice(1).toLowerCase()} Gaming`
    : 'Competitive Gaming';

  const strategyLabel = currentAdaptation?.strategy.label || 'Stability First';

  const getStateDetails = () => {
    switch (currentState) {
      case 'MONITORING':
        return {
          label: 'MONITORING',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          dotClass: 'bg-emerald-400',
          desc: 'Sampling physical device telemetry & touch polling cadence',
        };
      case 'ANALYZING':
      case 'PREDICTING':
        return {
          label: 'PREDICTING',
          badgeClass: 'bg-[#2A200E] text-vyra-gold border-vyra-gold/50',
          dotClass: 'bg-vyra-gold animate-pulse',
          desc: 'Degradation predicted — calculating preemptive intervention lead time',
        };
      case 'ADAPTING':
        return {
          label: 'ADAPTING',
          badgeClass: 'bg-[#3A2208] text-amber-300 border-amber-600/60',
          dotClass: 'bg-amber-400 animate-ping',
          desc: 'Executing proactive micro-pacing directive on device layer',
        };
      case 'VERIFYING':
        return {
          label: 'VERIFYING',
          badgeClass: 'bg-[#15202B] text-cyan-300 border-cyan-800',
          dotClass: 'bg-cyan-400 animate-pulse',
          desc: 'Quantifying observed recovery delta against pre-state telemetry',
        };
      case 'LEARNING':
        return {
          label: 'LEARNING',
          badgeClass: 'bg-[#22132D] text-purple-300 border-purple-800',
          dotClass: 'bg-purple-400 animate-pulse',
          desc: 'Synthesizing session outcome into persistent Performance DNA',
        };
      default:
        return {
          label: 'MONITORING',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          dotClass: 'bg-emerald-400',
          desc: 'System nominal',
        };
    }
  };

  const stateDetails = getStateDetails();

  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-[#17130A] via-[#100D06] to-[#0A0A0A] border border-[#3E2F13] shadow-xl space-y-2.5 animate-fade-in">
      {/* Top row: VYRA STATUS with Dominant State Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-vyra-gold" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-semibold">
            VYRA STATUS
          </span>
        </div>

        <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${stateDetails.badgeClass} shadow-sm`}>
          <span className={`w-2 h-2 rounded-full ${stateDetails.dotClass}`} />
          <span>● {stateDetails.label}</span>
        </div>
      </div>

      {/* Dominant Workload & Personal Strategy info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-neutral-900">
          <span className="text-neutral-500 text-[10px]">CURRENT WORKLOAD:</span>
          <span className="text-white font-bold">{workloadLabel}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-neutral-900">
          <span className="text-neutral-500 text-[10px]">PERSONAL STRATEGY:</span>
          <span className="text-[#E5C973] font-bold">{strategyLabel}</span>
        </div>
      </div>

      {/* Sub-status description bar */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-[#261E0E]">
        <span className="truncate max-w-[240px] text-neutral-300">
          {stateDetails.desc}
        </span>
        <span className="text-vyra-gold shrink-0">
          Index: {gameplayStabilityIndex}/100
        </span>
      </div>
    </div>
  );
}
