import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Square,
  Flame,
  Wifi,
  BatteryCharging,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowRight,
  Brain,
} from 'lucide-react';
import { DemoScenarioId, LiveDemoStage } from '../types';
import { useVYRA } from '../hooks/useVYRA';
import { useNavigate } from 'react-router-dom';

interface Props {
  onScenarioChange?: (scenarioId: DemoScenarioId) => void;
  compact?: boolean;
}

const STAGES: { id: LiveDemoStage; label: string; loopLabel: string; hint: string }[] = [
  { id: 'MONITOR', label: '1. MONITOR', loopLabel: 'LEARN', hint: 'Tracking 35.6°C baseline telemetry' },
  { id: 'DETECT', label: '2. DETECT', loopLabel: 'DETECT', hint: '72% Thermal pattern detected' },
  { id: 'PREDICT', label: '3. PREDICT', loopLabel: 'PREDICT', hint: '87% Confidence in thermal risk' },
  { id: 'DECIDE', label: '4. DECIDE', loopLabel: 'ADAPT', hint: 'Sustain Frame Stability chosen' },
  { id: 'VERIFY', label: '5. VERIFY', loopLabel: 'VERIFY', hint: '91% → 97% Stability preserved' },
  { id: 'LEARN', label: '6. LEARN', loopLabel: 'LEARN', hint: 'Thermal Sensitivity: MED → HIGH' },
];

export function LiveIntelligenceDemo({ compact = false }: Props) {
  const navigate = useNavigate();
  const {
    state,
    runLiveDemo,
    replayLiveDemo,
    stopLiveDemo,
  } = useVYRA();

  const [selectedScenario, setSelectedScenario] = useState<DemoScenarioId>('THERMAL_RISE');
  const [speed, setSpeed] = useState<number>(1.0);

  const { liveDemo } = state;
  const isRunning = liveDemo.isActive && liveDemo.stage !== 'COMPLETE' && liveDemo.stage !== 'IDLE';
  const isFinished = liveDemo.stage === 'COMPLETE' || (liveDemo.isActive && liveDemo.stage === 'LEARN');

  const handleStart = (scen: DemoScenarioId = selectedScenario) => {
    setSelectedScenario(scen);
    runLiveDemo(scen, speed);
  };

  const handleReplay = () => {
    replayLiveDemo();
  };

  const handleStop = () => {
    stopLiveDemo();
  };

  const details = liveDemo.stepDetails || {};

  return (
    <div className="bg-[#111111] border border-[#2E2412] rounded-lg p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8A84E]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C8A84E] animate-ping" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C8A84E] font-semibold uppercase">
            iQOO VYRA INTELLIGENCE DEMONSTRATION
          </span>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-1.5 bg-[#181818] border border-[#2A2A2A] px-2 py-0.5 rounded text-[10px] font-mono">
          <span className="text-neutral-400">SPEED:</span>
          {[1.0, 1.5, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              disabled={isRunning}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speed === s
                  ? 'bg-[#C8A84E] text-black font-bold'
                  : 'text-neutral-400 hover:text-white disabled:opacity-50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Headline & Description */}
      <div className="mb-4 relative z-10">
        <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
          <span>RUN VYRA INTELLIGENCE SCENARIO</span>
          <span className="text-[9px] font-mono font-normal px-2 py-0.5 rounded bg-[#C8A84E]/10 text-[#C8A84E] border border-[#C8A84E]/20">
            60–90 SECONDS
          </span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Witness the complete autonomous cycle:{' '}
          <span className="font-mono text-[#E5C973] font-medium">
            MONITOR → DETECT → PREDICT → DECIDE → VERIFY → LEARN
          </span>
          . VYRA acts proactively before performance jitter becomes noticeable.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 relative z-10">
        {/* Scenario 1: Thermal Rise (Primary) */}
        <button
          onClick={() => {
            setSelectedScenario('THERMAL_RISE');
            if (isRunning) handleStart('THERMAL_RISE');
          }}
          className={`p-2.5 rounded border text-left transition-all relative overflow-hidden ${
            selectedScenario === 'THERMAL_RISE'
              ? 'bg-[#1F1708] border-[#C8A84E] shadow-sm ring-1 ring-[#C8A84E]/50 text-white'
              : 'bg-[#161616] border-[#262626] text-neutral-400 hover:border-[#383838]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold font-display">
              <Flame size={13} className={selectedScenario === 'THERMAL_RISE' ? 'text-[#C8A84E]' : 'text-neutral-500'} />
              <span>THERMAL RISE</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#C8A84E]/20 text-[#E5C973]">
              JUDGE DEMO
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            35.6°C → 38.7°C → 38.3°C
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Stability preserved: 91% → 97%
          </div>
        </button>

        {/* Scenario 2: Network Instability */}
        <button
          onClick={() => {
            setSelectedScenario('NETWORK_INSTABILITY');
            if (isRunning) handleStart('NETWORK_INSTABILITY');
          }}
          className={`p-2.5 rounded border text-left transition-all relative ${
            selectedScenario === 'NETWORK_INSTABILITY'
              ? 'bg-[#1F1708] border-[#C8A84E] shadow-sm ring-1 ring-[#C8A84E]/50 text-white'
              : 'bg-[#161616] border-[#262626] text-neutral-400 hover:border-[#383838]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold font-display">
              <Wifi size={13} className={selectedScenario === 'NETWORK_INSTABILITY' ? 'text-[#C8A84E]' : 'text-neutral-500'} />
              <span>NETWORK JITTER</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400">
              SOCKET LAG
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            142ms / 8.4% → 38ms loss
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Network-aware socket pacing
          </div>
        </button>

        {/* Scenario 3: Low Battery */}
        <button
          onClick={() => {
            setSelectedScenario('LOW_BATTERY');
            if (isRunning) handleStart('LOW_BATTERY');
          }}
          className={`p-2.5 rounded border text-left transition-all relative ${
            selectedScenario === 'LOW_BATTERY'
              ? 'bg-[#1F1708] border-[#C8A84E] shadow-sm ring-1 ring-[#C8A84E]/50 text-white'
              : 'bg-[#161616] border-[#262626] text-neutral-400 hover:border-[#383838]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold font-display">
              <BatteryCharging size={13} className={selectedScenario === 'LOW_BATTERY' ? 'text-[#C8A84E]' : 'text-neutral-500'} />
              <span>LOW BATTERY</span>
            </div>
            <span className="text-[9px] font-mono text-neutral-400">
              16% RESERVE
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            7.2W drain → 4.1W (+34m)
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            Efficiency-aware balancing
          </div>
        </button>
      </div>

      {/* Action Control: RUN VYRA DEMO Button (Requirement 1) */}
      <div className="flex flex-wrap items-center gap-3 mb-5 relative z-10">
        {!isRunning ? (
          <button
            onClick={() => handleStart(selectedScenario)}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C8A84E] via-[#E2C36D] to-[#C8A84E] text-black font-display font-bold text-sm tracking-wider px-5 py-3 rounded-md shadow-lg shadow-[#C8A84E]/20 hover:shadow-[#C8A84E]/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Play size={16} className="fill-black" />
            <span>RUN VYRA DEMO ({selectedScenario.replace('_', ' ')})</span>
          </button>
        ) : (
          <>
            <div className="flex-1 flex items-center gap-2 bg-[#181818] border border-[#3A2E14] px-4 py-2.5 rounded-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C8A84E] animate-ping" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-[#C8A84E] font-bold">
                    DEMO STAGE: {liveDemo.stage}
                  </span>
                  <span className="text-neutral-400">{liveDemo.stageProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8A84E] to-[#FFDD80] transition-all duration-500"
                    style={{ width: `${liveDemo.stageProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleStop}
              className="px-4 py-2.5 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Square size={13} />
              <span>CANCEL</span>
            </button>
          </>
        )}

        {/* Replay Demo Button (Requirement 10) */}
        <button
          onClick={handleReplay}
          title="Rerun the demonstration without erasing user DNA history"
          className="px-4 py-3 rounded-md border border-[#3E3116] bg-[#16130C] text-[#C8A84E] hover:bg-[#201A0F] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={14} />
          <span>REPLAY DEMO</span>
        </button>
      </div>

      {/* Visual Intelligence Loop (Requirement 8): MONITOR → DETECT → PREDICT → DECIDE → VERIFY → LEARN */}
      <div className="mb-5 p-3.5 bg-[#141414] border border-[#252525] rounded-md relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            AUTONOMOUS INTELLIGENCE LOOP
          </div>
          <div className="text-[9px] font-mono text-[#C8A84E]">
            {isRunning ? `ACTIVE STAGE: ${liveDemo.stage}` : isFinished ? 'CYCLE COMPLETED' : 'STANDBY'}
          </div>
        </div>

        {/* Sequential Stages */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {STAGES.map((s, idx) => {
            const isStageActive = liveDemo.stage === s.id;
            const isCompleted = liveDemo.completedStages.includes(s.id) || liveDemo.stage === 'COMPLETE';

            return (
              <div
                key={s.id}
                className={`p-2 rounded border transition-all ${
                  isStageActive
                    ? 'bg-[#291E0B] border-[#C8A84E] shadow-sm ring-1 ring-[#C8A84E]/60 text-white animate-pulse'
                    : isCompleted
                    ? 'bg-[#151D14] border-[#2B4B27] text-emerald-400'
                    : 'bg-[#181818] border-[#242424] text-neutral-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-0.5">
                  <span>{s.label}</span>
                  {isCompleted && <CheckCircle2 size={11} className="text-emerald-400" />}
                </div>
                <div className="text-[9px] font-mono text-neutral-400 truncate">
                  {s.loopLabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Stage Inspection Display (Requirements 3, 4, 5, 6, 7) */}
      {(isRunning || isFinished) && (
        <div className="space-y-3 mb-5 animate-fade-in relative z-10">
          {/* Stage 2 DETECT & Stage 3 PREDICT info */}
          {(liveDemo.stage === 'DETECT' ||
            liveDemo.stage === 'PREDICT' ||
            liveDemo.completedStages.includes('DETECT')) && (
            <div className="bg-[#18150F] border border-[#453414] rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Flame size={14} className="text-[#C8A84E]" />
                  <span className="font-display font-semibold text-white">
                    PREEMPTIVE DEGRADATION DETECTION
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/70 border border-red-800 text-red-300 font-bold">
                  DEGRADATION RISK: {details.degradationRisk || 72}%
                </span>
              </div>

              <div className="text-neutral-300 font-body mb-2 leading-relaxed">
                Status:{' '}
                <span className="text-white font-mono font-semibold">
                  "{details.detectionMessage || 'Thermal pattern detected.'}"
                </span>
              </div>

              {/* Prediction details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#12100A] p-2.5 rounded border border-[#2D2311]">
                <div>
                  <div className="text-[10px] font-mono text-neutral-400">PREDICTED CAUSE</div>
                  <div className="text-xs font-mono text-[#E5C973] font-semibold mt-0.5">
                    {details.predictedCause || 'Thermal accumulation'}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Confidence:{' '}
                    <span className="text-emerald-400 font-bold font-mono">
                      {details.predictionConfidence || 87}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-neutral-400">REASONING</div>
                  <div className="text-[11px] text-neutral-300 font-body mt-0.5 leading-snug">
                    "{details.predictionReason || "Current thermal rise matches the user's learned long-session pattern."}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 4 DECIDE info */}
          {(liveDemo.stage === 'DECIDE' || liveDemo.completedStages.includes('DECIDE')) && (
            <div className="bg-[#14181E] border border-[#20344D] rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Brain size={14} className="text-sky-400" />
                  <span className="font-display font-semibold text-white">
                    STRATEGY DECISION & HARDWARE INTERVENTION
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-bold">
                  STATE: OPTIMIZING
                </span>
              </div>

              <div className="mb-2">
                <span className="text-neutral-400 text-[11px]">Recommended Strategy: </span>
                <span className="font-mono font-bold text-sky-300">
                  {details.recommendedStrategy || 'SUSTAIN FRAME STABILITY'}
                </span>
                <p className="text-[11px] text-neutral-300 mt-1 italic">
                  "{details.strategyReasoning || "Your Performance DNA prioritizes frame consistency during extended competitive sessions."}"
                </p>
              </div>

              {/* Decision factors */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono mb-2">
                {details.decisionFactors?.map((f, i) => (
                  <div key={i} className="bg-[#0C1118] p-2 rounded border border-[#1A2636]">
                    <div className="text-neutral-400">{f.label}</div>
                    <div className="font-bold text-white mt-0.5 truncate">{f.value}</div>
                  </div>
                )) || (
                  <>
                    <div className="bg-[#0C1118] p-2 rounded border border-[#1A2636]">
                      <div className="text-neutral-400">THERMAL RISK</div>
                      <div className="font-bold text-amber-400 mt-0.5">HIGH (72%)</div>
                    </div>
                    <div className="bg-[#0C1118] p-2 rounded border border-[#1A2636]">
                      <div className="text-neutral-400">SESSION DURATION</div>
                      <div className="font-bold text-sky-400 mt-0.5">EXTENDED</div>
                    </div>
                    <div className="bg-[#0C1118] p-2 rounded border border-[#1A2636]">
                      <div className="text-neutral-400">FRAME STABILITY</div>
                      <div className="font-bold text-emerald-400 mt-0.5">PRIORITY: HIGH</div>
                    </div>
                  </>
                )}
              </div>

              {/* Hardware Layer Disclosure (Requirement 5) */}
              <div className="text-[10px] text-neutral-400 border-t border-[#1C2C40] pt-1.5 flex items-center gap-1.5">
                <Cpu size={12} className="text-sky-400 shrink-0" />
                <span>
                  VYRA acts as the intelligence layer between user intent and device APIs. In production, this intervention dispatches hardware throttling limits to iQOO Monster Mode & Game Space schedulers.
                </span>
              </div>
            </div>
          )}

          {/* Stage 5 VERIFY info */}
          {(liveDemo.stage === 'VERIFY' || liveDemo.completedStages.includes('VERIFY')) && (
            <div className="bg-[#121B14] border border-[#21432A] rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="font-display font-semibold text-white">
                    VERIFICATION & OUTCOME MEASUREMENT
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                  {details.strategyResult || 'STABILITY PRESERVED'}
                </span>
              </div>

              {/* Quantitative Before vs After (Requirement 6) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                <div className="bg-[#0C140E] p-2 rounded border border-[#192E20]">
                  <div className="text-[10px] font-mono text-neutral-400">BEFORE INTERVENTION</div>
                  <div className="text-sm font-mono font-bold text-red-400 mt-0.5">
                    {details.beforeStability || '91% FPS Stability'}
                  </div>
                </div>

                <div className="bg-[#0C140E] p-2 rounded border border-[#192E20]">
                  <div className="text-[10px] font-mono text-neutral-400">AFTER INTERVENTION</div>
                  <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                    {details.afterStability || '97% FPS Stability'}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-[#0C140E] p-2 rounded border border-[#192E20]">
                  <div className="text-[10px] font-mono text-neutral-400">THERMAL DELTA</div>
                  <div className="text-sm font-mono font-bold text-[#E5C973] mt-0.5">
                    {details.thermalDelta || '-0.4°C cooling'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-300 font-body italic">
                "{details.verificationMessage || 'Observed performance matched the predicted outcome.'}"
              </div>
            </div>
          )}

          {/* Stage 6 LEARN info */}
          {(liveDemo.stage === 'LEARN' || liveDemo.stage === 'COMPLETE') && (
            <div className="bg-[#1C160F] border border-[#523A14] rounded p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-[#C8A84E]" />
                  <span className="font-display font-semibold text-white">
                    PERFORMANCE DNA UPDATED
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#E5C973]">
                  STATE: LEARNING
                </span>
              </div>

              <div className="text-neutral-300 text-xs mb-2">
                Session pattern added to Performance DNA:{' '}
                <span className="font-bold text-[#E5C973]">
                  {details.sessionPattern || 'Long competitive sessions'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#120F0A] p-2.5 rounded border border-[#2D210F]">
                <div>
                  <div className="text-[10px] font-mono text-neutral-400">ATTRIBUTE UPDATED</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    {details.updatedDnaAttribute || 'THERMAL SENSITIVITY'}:{' '}
                    <span className="text-[#C8A84E]">{details.updatedDnaChange || 'MEDIUM → HIGH'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-neutral-400">NEW SYSTEM KNOWLEDGE</div>
                  <div className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                    "{details.newLearningText || 'Extended competitive sessions consistently show thermal-driven stability risk.'}"
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo Result Summary Card (Requirement 9) */}
      {isFinished && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-[#1E1609] to-[#0E0C07] border-2 border-[#C8A84E] shadow-2xl relative z-10 animate-fade-in mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3F3117] mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-[#C8A84E]/20 text-[#C8A84E]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white tracking-wide">
                  VYRA LEARNING COMPLETE
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Autonomous Cycle Verified & Synthesized
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] font-mono text-neutral-400">CONFIDENCE</div>
              <div className="text-sm font-mono font-bold text-[#E5C973]">
                {details.summaryConfidence || 87}%
              </div>
            </div>
          </div>

          {/* Summary Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-xs">
            <div className="bg-[#120F08] p-2.5 rounded border border-[#2D210F]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">PREDICTED</div>
              <div className="text-xs font-mono font-semibold text-white mt-1">
                {details.summaryPredicted || 'Thermal accumulation causing frame drops'}
              </div>
            </div>

            <div className="bg-[#120F08] p-2.5 rounded border border-[#2D210F]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">STRATEGY</div>
              <div className="text-xs font-mono font-semibold text-sky-400 mt-1">
                {details.summaryStrategy || 'SUSTAIN FRAME STABILITY'}
              </div>
            </div>

            <div className="bg-[#120F08] p-2.5 rounded border border-[#2D210F]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">OBSERVED</div>
              <div className="text-xs font-mono font-semibold text-emerald-400 mt-1">
                {details.summaryObserved || 'Stability preserved at 97% (+6% recovery, 38.3°C)'}
              </div>
            </div>
          </div>

          {/* Summary Learning */}
          <div className="bg-[#151109] p-2.5 rounded border border-[#3A2B14] mb-4 text-xs">
            <div className="text-[10px] font-mono text-[#C8A84E] uppercase font-semibold mb-1">
              UPDATED PERFORMANCE DNA INSIGHT
            </div>
            <p className="text-neutral-200 leading-relaxed font-body">
              "{details.summaryLearning || 'Extended competitive sessions consistently show thermal-driven stability risk.'}"
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#312510]">
            <div className="text-[11px] text-neutral-400 italic">
              "VYRA learned how you need it to perform."
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReplay}
                className="px-3 py-1.5 rounded border border-[#C8A84E]/40 bg-[#C8A84E]/10 hover:bg-[#C8A84E]/20 text-[#E5C973] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={12} />
                <span>REPLAY DEMO</span>
              </button>

              <button
                onClick={() => navigate('/dna')}
                className="px-3 py-1.5 rounded bg-[#C8A84E] text-black hover:bg-[#D8B85E] text-xs font-display font-bold flex items-center gap-1 transition-colors"
              >
                <span>VIEW DNA</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
