import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVYRA } from '../hooks/useVYRA';
import { IntelligenceStatus } from '../components/IntelligenceStatus';
import { TelemetryCard } from '../components/TelemetryCard';
import { PredictionCard } from '../components/PredictionCard';
import { AdaptationCard } from '../components/AdaptationCard';
import { VerificationCard } from '../components/VerificationCard';
import { PerformanceTimeline } from '../components/PerformanceTimeline';
import { IntentSelector } from '../components/IntentSelector';
import { CounterfactualCard } from '../components/CounterfactualCard';
import { DecisionTraceCard } from '../components/DecisionTraceCard';
import { ConfidenceBreakdownView } from '../components/ConfidenceBreakdownView';
import { DemoAutopilotControls } from '../components/DemoAutopilotControls';
import { LiveIntelligenceDemo } from '../components/LiveIntelligenceDemo';
import { PredictiveWindowCard } from '../components/PredictiveWindowCard';
import { RootCausePanel } from '../components/RootCausePanel';
import { CandidateStrategyRanking } from '../components/CandidateStrategyRanking';
import { UserFeelsNothingCard } from '../components/UserFeelsNothingCard';
import { GamingIntelligencePanel } from '../components/GamingIntelligencePanel';
import { JudgeFriendlyStatus } from '../components/JudgeFriendlyStatus';
import { VyraActedBanner } from '../components/VyraActedBanner';
import { PeakVsSustainedCard } from '../components/PeakVsSustainedCard';
import { formatDuration } from '../utils/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Timer, ChevronRight, Play, Square, Layers, Sliders } from 'lucide-react';
import { VerificationResult, WorkloadType } from '../types';

const WORKLOAD_OPTIONS: { type: WorkloadType; label: string }[] = [
  { type: 'COMPETITIVE', label: 'COMPETITIVE' },
  { type: 'CASUAL', label: 'CASUAL' },
  { type: 'STREAMING', label: 'STREAMING' },
  { type: 'EDITING', label: 'EDITING' },
  { type: 'MULTITASKING', label: 'MULTITASK' },
];

export function SessionPage() {
  const navigate = useNavigate();
  const {
    state,
    startSession,
    setIntent,
    applyAdaptation,
    endSession,
    resetToDemo,
    runDemoScenario,
    runJudgeDemo,
    runScenario,
    skipToDecision,
    isSessionActive,
  } = useVYRA();

  const [selectedWorkload, setSelectedWorkload] =
    useState<WorkloadType>('COMPETITIVE');
  const [chartData, setChartData] = useState<
    { t: number; fps: number; thermal: number; risk: number }[]
  >([]);
  const [lastEndedVerification, setLastEndedVerification] =
    useState<VerificationResult | null>(null);

  const chartTickRef = useRef(0);

  useEffect(() => {
    if (isSessionActive && state.currentTelemetry) {
      chartTickRef.current += 1;
      setChartData((prev) => {
        const next = [
          ...prev,
          {
            t: chartTickRef.current,
            fps: Math.round(state.currentTelemetry.fpsStability * 10) / 10,
            thermal: Math.round(state.currentTelemetry.thermalTemp * 10) / 10,
            risk: state.riskScore,
          },
        ];
        return next.length > 25 ? next.slice(-25) : next;
      });
    }
  }, [state.currentTelemetry, isSessionActive, state.riskScore]);

  const handleStartSession = (workloadToStart: WorkloadType = selectedWorkload) => {
    setLastEndedVerification(null);
    setChartData([]);
    chartTickRef.current = 0;
    startSession(workloadToStart, state.currentIntent);
  };

  const handleEndSession = () => {
    const result = endSession();
    setLastEndedVerification(result);
  };

  // ── 1. No Active Session & No Verification ────────────────
  if (!isSessionActive && !lastEndedVerification) {
    return (
      <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
        <div className="animate-fade-in max-w-md mx-auto space-y-5">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-vyra-gold font-display font-medium mb-3">
              PERFORMANCE SESSION
            </div>
            <h2 className="font-display text-2xl font-bold text-vyra-white mb-1.5">
              START WORKLOAD
            </h2>
            <p className="text-xs text-vyra-muted font-body leading-relaxed">
              Select your workload and intent to activate the closed-loop intelligence engine.
            </p>
          </div>

          {/* Step 6: Live Intelligence Demonstration Console (Judge Demo) */}
          <LiveIntelligenceDemo />

          {/* Autopilot Demo Launch Card with 60-Second Judge Demo & Scenarios */}
          <DemoAutopilotControls
            onRunDemo={runDemoScenario}
            onRunJudgeDemo={runJudgeDemo}
            onRunScenario={runScenario}
            activeScenario={state.activeScenario}
            onSkipToDecision={skipToDecision}
            onReset={resetToDemo}
            isSessionActive={false}
          />

          {/* User Feels Nothing Value Proposition Card */}
          <UserFeelsNothingCard />

          {/* Gaming Intelligence Panel (Step 7 Req 2, 3, 4, 5) */}
          <GamingIntelligencePanel />

          {/* The Peak Performance Trap & Personalized Gaming Decisions (Step 7 Req 6 & 7) */}
          <PeakVsSustainedCard />

          {/* Intent Selector */}
          <IntentSelector
            selectedIntent={state.currentIntent}
            onSelectIntent={setIntent}
            compact
          />

          {/* Workload Selectors */}
          <div className="bg-vyra-surface border border-vyra-border rounded-md p-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Layers size={12} className="text-vyra-muted" />
              <span className="text-[10px] tracking-[0.15em] text-vyra-muted font-body">
                WORKLOAD TYPE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {WORKLOAD_OPTIONS.map((opt) => {
                const isSelected = selectedWorkload === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedWorkload(opt.type)}
                    className={`p-3 rounded border text-left transition-all ${
                      isSelected
                        ? 'bg-vyra-dark border-vyra-gold text-vyra-white'
                        : 'bg-vyra-dark border-vyra-border/60 text-vyra-muted hover:text-vyra-text'
                    }`}
                  >
                    <div className="font-display text-xs font-semibold">
                      {opt.label}
                    </div>
                    <div className="text-[9px] text-vyra-muted mt-0.5 font-body">
                      {opt.type === 'COMPETITIVE'
                        ? 'Max GPU dispatch, frame pacing'
                        : opt.type === 'CASUAL'
                        ? 'Efficient power scaling'
                        : opt.type === 'STREAMING'
                        ? 'Network socket priority'
                        : opt.type === 'EDITING'
                        ? 'Heavy compute throughput'
                        : 'Dynamic resource sharing'}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleStartSession(selectedWorkload)}
              className="w-full bg-vyra-white text-vyra-black font-display text-xs font-bold tracking-[0.15em] py-3 rounded flex items-center justify-center gap-2 hover:bg-vyra-text active:scale-[0.98] transition-all"
            >
              <Play size={13} fill="currentColor" />
              INITIALIZE LIVE SESSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. Verification Screen After Ending Session ───────────
  if (!isSessionActive && lastEndedVerification) {
    return (
      <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
        <div className="animate-slide-up max-w-md mx-auto space-y-4">
          <div className="text-[10px] tracking-[0.3em] text-vyra-gold font-display font-medium mb-2">
            SESSION COMPLETE
          </div>

          <VerificationCard
            verification={lastEndedVerification}
            onViewInsights={() => navigate('/insights')}
          />

          <button
            onClick={() => handleStartSession('COMPETITIVE')}
            className="w-full bg-vyra-white text-vyra-black font-display text-xs font-semibold tracking-[0.15em] py-2.5 rounded flex items-center justify-center gap-2 hover:bg-vyra-text active:scale-[0.98] transition-all"
          >
            START NEW SESSION
            <ChevronRight size={14} strokeWidth={2} />
          </button>

          <button
            onClick={() => navigate('/insights')}
            className="w-full bg-vyra-surface border border-vyra-border text-vyra-text font-display text-xs font-medium tracking-wider py-2.5 rounded hover:bg-vyra-dark transition-all"
          >
            VIEW INSIGHTS & LEARNING LOG
          </button>
        </div>
      </div>
    );
  }

  // ── 3. Active Session Screen ──────────────────────────────
  const session = state.currentSession!;
  const isApplied = Boolean(state.currentAdaptation?.accepted);

  return (
    <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
      <div className="animate-fade-in max-w-md mx-auto space-y-4">
        {/* Top Session Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Timer size={16} className="text-vyra-gold animate-pulse-subtle" strokeWidth={1.5} />
            <div>
              <div className="font-mono text-base font-bold text-vyra-white">
                {formatDuration(session.duration)}
              </div>
              <div className="text-[9px] tracking-wider text-vyra-muted font-body">
                {session.workload} · {state.currentIntent.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/controls')}
              className="bg-vyra-surface border border-vyra-border text-vyra-gold text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1 hover:border-vyra-gold transition-colors"
            >
              <Sliders size={10} />
              CONTROLS
            </button>

            <button
              onClick={handleEndSession}
              className="bg-vyra-surface border border-vyra-border hover:border-vyra-red/50 text-vyra-text hover:text-vyra-red text-[10px] font-mono px-2.5 py-1 rounded flex items-center gap-1 transition-all"
            >
              <Square size={10} fill="currentColor" />
              END
            </button>
          </div>
        </div>

        {/* Step 9 Req 2: Dominant System Status for Judges */}
        <JudgeFriendlyStatus />

        {/* Step 9 Req 5: VYRA ACTED Preemptive Notification & Verified Outcome Banner */}
        <VyraActedBanner />

        {/* Step 6: Live Intelligence Demonstration Console (Active Progression & Summary) */}
        <LiveIntelligenceDemo />

        {/* 1. Decision Timeline (Requirement 5) */}
        <PerformanceTimeline
          activeStep={state.activeTimelineStep}
        />

        {/* 2. Step 4 Req 1: Predictive Window Card (Continuously Updating MM:SS) */}
        <PredictiveWindowCard
          predictiveWindow={state.predictiveWindow}
          earlyWarningLevel={state.earlyWarningLevel}
          riskScore={state.riskScore}
        />

        {/* 3. Step 4 Req 3 & 4: Multi-Factor Root Cause Model Panel */}
        <RootCausePanel analysis={state.rootCauseAnalysis} />

        {/* 4. Autopilot Controls with 60-Second Judge Demo & 6 Scenarios */}
        <DemoAutopilotControls
          onRunDemo={runDemoScenario}
          onRunJudgeDemo={runJudgeDemo}
          onRunScenario={runScenario}
          activeScenario={state.activeScenario}
          onSkipToDecision={skipToDecision}
          onReset={resetToDemo}
          isSessionActive={true}
        />

        {/* 5. Live Intelligence State */}
        <IntelligenceStatus
          state={state.currentState}
          riskScore={state.riskScore}
        />

        {/* 6. Intent Quick Switcher */}
        <IntentSelector
          selectedIntent={state.currentIntent}
          onSelectIntent={setIntent}
          compact
        />

        {/* 7. Live Telemetry Signals */}
        <TelemetryCard telemetry={state.currentTelemetry} />

        {/* Gaming Intelligence & Input Telemetry (Step 7 Req 2, 3, 4, 5) */}
        <GamingIntelligencePanel />

        {/* 8. Real-time Stability & Thermal Trend Chart */}
        {chartData.length > 1 && (
          <div className="bg-vyra-surface border border-vyra-border rounded-md p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] tracking-[0.15em] text-vyra-muted font-body">
                PERFORMANCE STABILITY & THERMAL
              </div>
              <div className="flex items-center gap-3 text-[9px] font-mono">
                <span className="flex items-center gap-1 text-vyra-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-vyra-gold" />
                  FPS STAB.
                </span>
                <span className="flex items-center gap-1 text-vyra-amber">
                  <span className="w-1.5 h-1.5 rounded-full bg-vyra-amber" />
                  THERMAL
                </span>
              </div>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[80, 100]} yAxisId="fps" hide />
                  <YAxis domain={[30, 44]} yAxisId="thermal" hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #2A2A2A',
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: 'Inter',
                    }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fps"
                    yAxisId="fps"
                    stroke="#C8A84E"
                    strokeWidth={1.5}
                    dot={false}
                    name="FPS Stab. %"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="thermal"
                    yAxisId="thermal"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Thermal °C"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 9. Step 4 Req 12: Candidate Strategy Selection Scoring */}
        {state.candidateStrategies && state.candidateStrategies.length > 0 && (
          <CandidateStrategyRanking
            candidates={state.candidateStrategies}
            selectedStrategyId={state.currentAdaptation?.strategy.id}
            onSelectCandidate={(strategyId) => applyAdaptation(strategyId)}
          />
        )}

        {/* 10. Prediction Card & Confidence Breakdown */}
        <PredictionCard
          prediction={state.currentPrediction}
          riskScore={state.riskScore}
        />
        <ConfidenceBreakdownView
          breakdown={state.currentPrediction?.confidenceBreakdown}
        />

        {/* 11. Adaptation Recommendation (VYRA RECOMMENDS) */}
        {state.currentAdaptation && (
          <AdaptationCard
            decision={state.currentAdaptation}
            onApply={() => applyAdaptation()}
            isApplied={isApplied}
          />
        )}

        {/* 12. Counterfactual Simulation */}
        <CounterfactualCard
          counterfactual={state.currentAdaptation?.counterfactual}
        />

        {/* 13. Step 4 Req 6 & 15: User Feels Nothing Visual Flow Comparison */}
        <UserFeelsNothingCard />

        {/* 14. The Peak Performance Trap & Personalized Gaming Decisions (Step 7 Req 6 & 7) */}
        <PeakVsSustainedCard />

        {/* 14. Engineering Decision Trace */}
        <DecisionTraceCard
          trace={state.currentAdaptation?.decisionTrace}
          strategyLabel={state.currentAdaptation?.strategy.label}
        />

        {/* 15. Verification Card (if verified during session) */}
        {state.currentVerification && (
          <VerificationCard
            verification={state.currentVerification}
            onViewInsights={() => navigate('/insights')}
          />
        )}

        {/* Bottom End Button */}
        <button
          onClick={handleEndSession}
          className="w-full bg-vyra-surface border border-vyra-border text-vyra-text font-display text-xs font-semibold tracking-[0.15em] py-2.5 rounded hover:bg-vyra-dark active:scale-[0.98] transition-all"
        >
          END SESSION & VERIFY
        </button>
      </div>
    </div>
  );
}
