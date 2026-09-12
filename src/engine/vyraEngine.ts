import {
  AdaptationDecision,
  DemoScenarioId,
  DeviceActionQueueItem,
  EarlyWarningLevel,
  LiveDemoStage,
  LiveDemoState,
  PerformanceState,
  Prediction,
  PredictiveWindow,
  RootCauseAnalysis,
  Session,
  StrategyEffectiveness,
  StrategyId,
  Telemetry,
  TimelineStepId,
  UserDNA,
  UserIntent,
  VerificationResult,
  VYRAState,
  VYRAStateType,
  WorkloadType,
} from '../types';
import { DEMO_INITIAL_TELEMETRY } from '../data/simulationData';
import { DEMO_SCENARIOS } from '../data/scenarioData';
import {
  computePerformanceDNA,
  loadLearningUpdates,
  loadSessionHistory,
  loadStrategyEffectiveness,
  loadUserDNA,
  saveLearningUpdates,
  saveSessionHistory,
  saveStrategyEffectiveness,
  saveUserDNA,
} from '../data/userProfile';
import { evaluatePerformanceState } from './performanceModel';
import { predictPerformance } from './predictor';
import { selectAdaptationStrategy } from './adaptationEngine';
import { learnFromVerification, verifyIntervention } from './learningEngine';
import { SessionSimulator } from './sessionEngine';
import { liveDeviceSensor, LiveDeviceStatus } from './liveDeviceSensor';
import {
  calculateCandidateStrategyScores,
  calculatePredictiveWindow,
  calculateRootCauseAnalysis,
  getEarlyWarningLevel,
  PRESET_PROFILES,
} from './predictiveAdvantage';

const INITIAL_LIVE_DEMO: LiveDemoState = {
  isActive: false,
  scenarioId: 'THERMAL_RISE',
  stage: 'IDLE',
  stageProgress: 0,
  completedStages: [],
  stepDetails: {},
};

export function generateActionQueue(
  state: VYRAStateType,
  strategyId: StrategyId | null,
  riskScore: number
): DeviceActionQueueItem[] {
  const isMonitoringDone = state !== 'MONITORING' || riskScore > 25;
  const isPredictingDone = state === 'ADAPTING' || state === 'VERIFYING' || state === 'LEARNING';
  const isAdaptingDone = state === 'VERIFYING' || state === 'LEARNING';
  const isVerifyingDone = state === 'LEARNING';

  const strategyAction =
    strategyId === 'STABILITY_FIRST'
      ? 'Lock GPU frame pacing cadence at 16.6ms & sync 300Hz touch polling'
      : strategyId === 'NETWORK_PRIORITY'
      ? 'Prioritize real-time multiplayer socket queue ahead of background buffers'
      : strategyId === 'THERMAL_BALANCE'
      ? 'Scale vapor chamber cooling curve (-0.25°C/min proactive offset)'
      : strategyId === 'BATTERY_EFFICIENCY'
      ? 'Cap big-core voltage scale & modulate VRR display refresh cycles'
      : 'Harmonize GPU dispatch with thermal envelope';

  return [
    {
      id: 'act_1',
      label: 'Monitor thermal trajectory & touch latency',
      status: isMonitoringDone ? 'COMPLETED' : 'ACTIVE',
      type: 'OBSERVE',
      deviceSubsystem: 'Thermal & Touch HAL',
      recommendedAction: 'Continuous 100ms telemetry sampling',
    },
    {
      id: 'act_2',
      label: 'Predict stability risk across Gameplay Index',
      status: isPredictingDone ? 'COMPLETED' : state === 'PREDICTING' ? 'ACTIVE' : 'QUEUED',
      type: 'PREDICT',
      deviceSubsystem: 'VYRA Prediction Layer',
      recommendedAction: 'Lead-time calculation against throttling curve',
    },
    {
      id: 'act_3',
      label: strategyId
        ? `Request device layer: ${strategyAction}`
        : 'Prioritize frame consistency & touch responsiveness',
      status: isAdaptingDone ? 'COMPLETED' : state === 'ADAPTING' ? 'ACTIVE' : 'QUEUED',
      type: 'REQUEST',
      deviceSubsystem: 'iQOO Monster Mode & Game Space Scheduler',
      recommendedAction: 'Recommended device action sent to hardware abstraction',
    },
    {
      id: 'act_4',
      label: 'Preserve real-time network responsiveness',
      status: isAdaptingDone ? 'COMPLETED' : state === 'ADAPTING' ? 'ACTIVE' : 'QUEUED',
      type: 'REQUEST',
      deviceSubsystem: 'Multi-Path Network Stack',
      recommendedAction: 'Device-layer request: Wi-Fi/5G link stabilization',
    },
    {
      id: 'act_5',
      label: 'Verify intervention outcome against pre-state',
      status: isVerifyingDone ? 'COMPLETED' : state === 'VERIFYING' ? 'ACTIVE' : 'QUEUED',
      type: 'VERIFY',
      deviceSubsystem: 'Outcome Verification Engine',
      recommendedAction: 'Measure delta: FPS recovery, thermal slope, jitter',
    },
    {
      id: 'act_6',
      label: 'Update user Performance DNA model',
      status: state === 'LEARNING' ? 'COMPLETED' : 'QUEUED',
      type: 'UPDATE',
      deviceSubsystem: 'Local DNA Store',
      recommendedAction: 'Synthesize observed preference into persistent weights',
    },
  ];
}

type StateListener = (state: VYRAState) => void;

class VYRAEngine {
  private state: VYRAState;
  private listeners: StateListener[] = [];
  private simulator: SessionSimulator | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private beforeInterventionSnapshot: PerformanceState | null = null;
  private postInterventionTickCounter: number = 0;
  private currentSessionTelemetry: Telemetry[] = [];

  // Demo autopilot state
  private demoTimerId: ReturnType<typeof setTimeout> | null = null;
  private demoTimeouts: ReturnType<typeof setTimeout>[] = [];
  private demoProgressSeconds: number = 0;
  private demoIsPaused: boolean = false;
  private demoSpeed: number = 1.0;

  constructor() {
    const userDNA = loadUserDNA();
    const sessionHistory = loadSessionHistory();
    const strategyEffectiveness = loadStrategyEffectiveness();
    const learningUpdates = loadLearningUpdates();
    const performanceDNA = computePerformanceDNA(userDNA, sessionHistory);

    const initialPerformance = evaluatePerformanceState(
      DEMO_INITIAL_TELEMETRY,
      'COMPETITIVE',
      userDNA,
      0
    );

    const initialPrediction = predictPerformance(
      initialPerformance,
      [DEMO_INITIAL_TELEMETRY],
      userDNA
    );

    const predictiveWindow = calculatePredictiveWindow(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA
    );

    const rootCauseAnalysis = calculateRootCauseAnalysis(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA
    );

    const earlyWarningLevel = getEarlyWarningLevel(initialPerformance.riskScore);

    const candidateStrategies = calculateCandidateStrategyScores(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA,
      'MAXIMUM_STABILITY',
      strategyEffectiveness
    );

    this.state = {
      currentState: 'MONITORING',
      currentSession: null,
      currentTelemetry: DEMO_INITIAL_TELEMETRY,
      currentPerformanceState: initialPerformance,
      currentPrediction: initialPrediction,
      currentAdaptation: null,
      currentVerification: null,
      currentIntent: 'MAXIMUM_STABILITY',
      activeTimelineStep: 'SESSION_START',
      earlyWarningLevel,
      predictiveWindow,
      rootCauseAnalysis,
      candidateStrategies,
      activeProfilePreset: 'PROFILE_A',
      activeScenario: null,
      liveDemo: { ...INITIAL_LIVE_DEMO },
      userDNA,
      performanceDNA,
      sessionHistory,
      strategyEffectiveness,
      learningUpdates,
      riskScore: initialPerformance.riskScore,
      gameplayStabilityIndex: initialPerformance.gameplayStabilityIndex,
      actionQueue: generateActionQueue('MONITORING', null, initialPerformance.riskScore),
    };
  }

  public getState(): VYRAState {
    return { ...this.state };
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const copy = { ...this.state };
    this.listeners.forEach((listener) => listener(copy));
  }

  private setState(partial: Partial<VYRAState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public transitionState(newState: VYRAStateType): void {
    this.setState({ currentState: newState });
  }

  public setTimelineStep(step: TimelineStepId): void {
    this.setState({ activeTimelineStep: step });
  }

  // ── Profile Preset Switching (Requirement 8 & 9) ─────────

  public setProfilePreset(presetId: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE'): void {
    const preset = PRESET_PROFILES[presetId];
    const newDNA: UserDNA = { ...preset.dna };
    const newPerfDNA = computePerformanceDNA(newDNA, this.state.sessionHistory);

    const perfState = this.state.currentPerformanceState
      ? evaluatePerformanceState(
          this.state.currentTelemetry,
          this.state.currentSession?.workload || 'COMPETITIVE',
          newDNA,
          this.state.currentSession?.duration || 0
        )
      : null;

    const prediction = perfState
      ? predictPerformance(
          perfState,
          this.currentSessionTelemetry.length > 0
            ? this.currentSessionTelemetry
            : [this.state.currentTelemetry],
          newDNA
        )
      : this.state.currentPrediction;

    const candidateStrategies = perfState
      ? calculateCandidateStrategyScores(
          perfState,
          this.state.currentTelemetry,
          newDNA,
          this.state.currentIntent,
          this.state.strategyEffectiveness
        )
      : this.state.candidateStrategies;

    let adaptation = this.state.currentAdaptation;
    if (prediction && perfState) {
      adaptation = selectAdaptationStrategy(
        prediction,
        perfState,
        newDNA,
        this.state.strategyEffectiveness,
        this.state.currentIntent
      );
    }

    saveUserDNA(newDNA);

    this.setState({
      activeProfilePreset: presetId,
      userDNA: newDNA,
      performanceDNA: newPerfDNA,
      currentPerformanceState: perfState,
      currentPrediction: prediction,
      candidateStrategies,
      currentAdaptation: adaptation,
      gameplayStabilityIndex: perfState ? perfState.gameplayStabilityIndex : this.state.gameplayStabilityIndex,
      actionQueue: generateActionQueue(
        this.state.currentState,
        adaptation?.strategy.id || null,
        perfState ? perfState.riskScore : this.state.riskScore
      ),
    });
  }

  // ── Intent-Driven Performance ─────────────────────────────

  public setIntent(intent: UserIntent): void {
    this.setState({ currentIntent: intent });

    if (this.state.currentPerformanceState && this.state.currentPrediction) {
      const decision = selectAdaptationStrategy(
        this.state.currentPrediction,
        this.state.currentPerformanceState,
        this.state.userDNA,
        this.state.strategyEffectiveness,
        intent
      );

      const candidateStrategies = calculateCandidateStrategyScores(
        this.state.currentPerformanceState,
        this.state.currentTelemetry,
        this.state.userDNA,
        intent,
        this.state.strategyEffectiveness
      );

      if (decision) {
        this.setState({
          currentAdaptation: decision,
          candidateStrategies,
        });
      }
    }
  }

  // ── Session Flow ──────────────────────────────────────────

  public startSession(
    workload: WorkloadType = 'COMPETITIVE',
    intent: UserIntent = this.state.currentIntent,
    scenarioId?: DemoScenarioId
  ): void {
    this.stopStreaming();
    this.clearDemo();

    const scenario = scenarioId ? DEMO_SCENARIOS[scenarioId] : null;
    const initialTele = scenario
      ? { ...DEMO_INITIAL_TELEMETRY, ...scenario.initialTelemetry }
      : DEMO_INITIAL_TELEMETRY;
    const initialWorkload = scenario ? scenario.workload : workload;
    const initialDuration = scenarioId === 'LONG_COMPETITIVE' ? 1680 : 0;

    this.simulator = new SessionSimulator(initialWorkload, initialTele, scenarioId);
    this.currentSessionTelemetry = [initialTele];
    this.beforeInterventionSnapshot = null;
    this.postInterventionTickCounter = 0;

    const newSession: Session = {
      id: `ses_${Date.now()}`,
      startTime: Date.now() - initialDuration * 1000,
      endTime: null,
      duration: initialDuration,
      workload: initialWorkload,
      userIntent: intent,
      telemetryHistory: [initialTele],
      predictions: [],
      adaptations: [],
      verifications: [],
      learningOutcomes: [],
      averageFps: initialTele.fps || 60.0,
      averageThermal: initialTele.thermalTemp || 35.6,
      batteryDrain: 0,
      peakRiskScore: 12,
      finalVerification: null,
    };

    const initialPerformance = evaluatePerformanceState(
      initialTele,
      initialWorkload,
      this.state.userDNA,
      initialDuration
    );

    const initialPrediction = predictPerformance(
      initialPerformance,
      [initialTele],
      this.state.userDNA
    );

    const predictiveWindow = calculatePredictiveWindow(
      initialPerformance,
      initialTele,
      this.state.userDNA
    );

    const rootCauseAnalysis = calculateRootCauseAnalysis(
      initialPerformance,
      initialTele,
      this.state.userDNA
    );

    const earlyWarningLevel = getEarlyWarningLevel(initialPerformance.riskScore);

    const candidateStrategies = calculateCandidateStrategyScores(
      initialPerformance,
      initialTele,
      this.state.userDNA,
      intent,
      this.state.strategyEffectiveness
    );

    this.setState({
      currentState: 'MONITORING',
      activeTimelineStep: 'SESSION_START',
      currentSession: newSession,
      currentTelemetry: initialTele,
      currentPerformanceState: initialPerformance,
      currentPrediction: initialPrediction,
      currentAdaptation: null,
      currentVerification: null,
      currentIntent: intent,
      earlyWarningLevel,
      predictiveWindow,
      rootCauseAnalysis,
      candidateStrategies,
      activeScenario: scenarioId || null,
      riskScore: initialPerformance.riskScore,
      gameplayStabilityIndex: initialPerformance.gameplayStabilityIndex,
      actionQueue: generateActionQueue('MONITORING', null, initialPerformance.riskScore),
    });

    this.timerId = setInterval(() => {
      this.step();
    }, 1800);
  }

  public setWorkload(workload: WorkloadType): void {
    if (this.simulator) {
      this.simulator.setWorkload(workload);
    }
    if (this.state.currentSession) {
      this.state.currentSession.workload = workload;
      this.setState({
        currentSession: { ...this.state.currentSession, workload },
      });
    }
  }

  private step(): void {
    if (!this.simulator || !this.state.currentSession) return;

    let telemetry = this.simulator.tick(2);
    if (liveDeviceSensor.isLiveDevice()) {
      const live = liveDeviceSensor.sampleLiveTelemetry();
      telemetry = {
        ...telemetry,
        fps: live.fps,
        fpsStability: live.fpsStability,
        frameTimeVariance: live.frameTimeVariance,
        batteryLevel: live.batteryLevel,
        networkStability: live.networkStability,
        inputTelemetry: live.inputTelemetry,
      };
    }
    this.currentSessionTelemetry.push(telemetry);
    const duration = this.simulator.getDuration();

    // 1. Evaluate Performance Risk State
    const perfState = evaluatePerformanceState(
      telemetry,
      this.state.currentSession.workload,
      this.state.userDNA,
      duration
    );

    const peakRisk = Math.max(
      this.state.currentSession.peakRiskScore,
      perfState.riskScore
    );

    // 2. Predict Performance
    const prediction = predictPerformance(
      perfState,
      this.currentSessionTelemetry,
      this.state.userDNA
    );

    // 3. Predictive Advantage Calculations
    const predictiveWindow = calculatePredictiveWindow(
      perfState,
      telemetry,
      this.state.userDNA
    );

    const rootCauseAnalysis = calculateRootCauseAnalysis(
      perfState,
      telemetry,
      this.state.userDNA
    );

    const earlyWarningLevel = getEarlyWarningLevel(perfState.riskScore);

    const candidateStrategies = calculateCandidateStrategyScores(
      perfState,
      telemetry,
      this.state.userDNA,
      this.state.currentIntent,
      this.state.strategyEffectiveness
    );

    // Update active session record
    const updatedSession: Session = {
      ...this.state.currentSession,
      duration,
      telemetryHistory: [...this.currentSessionTelemetry],
      peakRiskScore: peakRisk,
      averageFps:
        Math.round(
          (this.currentSessionTelemetry.reduce((s, t) => s + t.fps, 0) /
            this.currentSessionTelemetry.length) *
            10
        ) / 10,
      averageThermal:
        Math.round(
          (this.currentSessionTelemetry.reduce((s, t) => s + t.thermalTemp, 0) /
            this.currentSessionTelemetry.length) *
            10
        ) / 10,
      batteryDrain:
        Math.round(
          Math.max(
            0,
            this.currentSessionTelemetry[0].batteryLevel - telemetry.batteryLevel
          ) * 10
        ) / 10,
    };

    // Update Decision Timeline Step
    let timelineStep = this.state.activeTimelineStep;
    if (duration > 2 && timelineStep === 'SESSION_START') {
      timelineStep = 'SIGNALS_OBSERVED';
    }
    if (telemetry.thermalRateOfRise > 0.2 && timelineStep === 'SIGNALS_OBSERVED') {
      timelineStep = 'PATTERN_RECOGNIZED';
    }

    // Post-intervention verification ticks
    if (this.beforeInterventionSnapshot && this.state.currentAdaptation?.accepted) {
      this.postInterventionTickCounter++;
      if (this.postInterventionTickCounter >= 3) {
        this.runVerification(perfState);
        return;
      }
    }

    // 4. Preemptive State Transitions (Act before collapse!)
    let nextState = this.state.currentState;
    let adaptationDecision = this.state.currentAdaptation;

    if (
      (earlyWarningLevel === 'WATCH' || earlyWarningLevel === 'INTERVENE') &&
      !this.state.currentAdaptation?.accepted &&
      this.state.currentState !== 'VERIFYING' &&
      this.state.currentState !== 'LEARNING'
    ) {
      if (this.state.currentState === 'MONITORING') {
        nextState = 'ANALYZING';
        timelineStep = 'DEGRADATION_PREDICTED';
        setTimeout(() => {
          if (this.state.currentState === 'ANALYZING') {
            this.transitionState('PREDICTING');
          }
        }, 700);
      } else if (this.state.currentState === 'PREDICTING') {
        timelineStep = 'USER_PRIORITY_CHECKED';
        const decision = selectAdaptationStrategy(
          prediction,
          perfState,
          this.state.userDNA,
          this.state.strategyEffectiveness,
          this.state.currentIntent
        );

        if (decision) {
          adaptationDecision = decision;
          nextState = 'ADAPTING';
          timelineStep = 'STRATEGY_SELECTED';
        }
      }
    }

    this.setState({
      currentState: nextState,
      activeTimelineStep: timelineStep,
      earlyWarningLevel,
      predictiveWindow,
      rootCauseAnalysis,
      candidateStrategies,
      currentSession: updatedSession,
      currentTelemetry: telemetry,
      currentPerformanceState: perfState,
      currentPrediction: prediction,
      currentAdaptation: adaptationDecision,
      riskScore: perfState.riskScore,
      gameplayStabilityIndex: perfState.gameplayStabilityIndex,
      actionQueue: generateActionQueue(
        nextState,
        adaptationDecision?.strategy.id || null,
        perfState.riskScore
      ),
    });
  }

  // ── Apply Strategy Intervention ───────────────────────────

  public applyAdaptation(strategyId?: StrategyId): void {
    if (!this.simulator || !this.state.currentPerformanceState) return;

    const chosenStrategy =
      strategyId ||
      this.state.currentAdaptation?.strategy.id ||
      'STABILITY_FIRST';

    this.simulator.applyStrategy(chosenStrategy);

    this.beforeInterventionSnapshot = { ...this.state.currentPerformanceState };
    this.postInterventionTickCounter = 0;

    const acceptedAdaptation: AdaptationDecision = this.state.currentAdaptation
      ? { ...this.state.currentAdaptation, accepted: true }
      : selectAdaptationStrategy(
          this.state.currentPrediction!,
          this.state.currentPerformanceState,
          this.state.userDNA,
          this.state.strategyEffectiveness,
          this.state.currentIntent
        ) || {
          id: `adapt_${Date.now()}`,
          timestamp: Date.now(),
          strategy: {
            id: chosenStrategy,
            label: chosenStrategy.replace('_', ' '),
            description: 'Adaptive pacing activated.',
            targets: ['fps', 'thermal'],
          },
          prediction: this.state.currentPrediction!,
          reasoning: {
            detected: [],
            predicted: 'Mitigating performance degradation',
            prioritized: 'Stability prioritized',
            confidence: 91,
          },
          decisionTrace: [],
          counterfactual: {
            withoutVyra: {
              temperature: '39.4°C',
              fpsStability: '88%',
              frameTimeVariance: '+31%',
              riskOutcome: 'Thermal throttling',
            },
            withVyra: {
              temperature: '37.6°C',
              fpsStability: '97%',
              frameTimeVariance: '-14%',
              riskOutcome: 'Zero throttling',
            },
            simulatedDeltaText: 'Stabilizes frame consistency.',
          },
          candidateScores: this.state.candidateStrategies,
          accepted: true,
        };

    if (this.state.currentSession) {
      this.state.currentSession.adaptations.push(acceptedAdaptation);
    }

    this.setState({
      currentAdaptation: acceptedAdaptation,
      activeTimelineStep: 'STRATEGY_SELECTED',
      currentState: 'ADAPTING',
      actionQueue: generateActionQueue('ADAPTING', chosenStrategy, this.state.riskScore),
    });
  }

  // ── Verification & Learning ───────────────────────────────

  private runVerification(afterState: PerformanceState): void {
    if (!this.beforeInterventionSnapshot || !this.state.currentAdaptation) return;

    this.transitionState('VERIFYING');
    this.setTimelineStep('OUTCOME_VERIFIED');

    const verification = verifyIntervention(
      this.state.currentAdaptation,
      this.beforeInterventionSnapshot,
      afterState,
      this.state.currentSession?.id || 'ses_current'
    );

    setTimeout(() => {
      this.transitionState('LEARNING');
      this.setTimelineStep('PROFILE_UPDATED');

      const { updatedDNA, updatedEffectiveness, learningOutcome } =
        learnFromVerification(
          verification,
          this.state.currentAdaptation!,
          this.state.currentSession?.workload || 'COMPETITIVE',
          this.state.userDNA,
          this.state.strategyEffectiveness
        );

      const updatedPerformanceDNA = computePerformanceDNA(
        updatedDNA,
        this.state.sessionHistory
      );

      const newLearningUpdates = [
        learningOutcome.insight,
        ...this.state.learningUpdates,
      ].slice(0, 15);

      saveUserDNA(updatedDNA);
      saveStrategyEffectiveness(updatedEffectiveness);
      saveLearningUpdates(newLearningUpdates);

      if (this.state.currentSession) {
        this.state.currentSession.verifications.push(verification);
        this.state.currentSession.learningOutcomes.push(learningOutcome);
      }

      this.setState({
        currentVerification: verification,
        userDNA: updatedDNA,
        performanceDNA: updatedPerformanceDNA,
        strategyEffectiveness: updatedEffectiveness,
        learningUpdates: newLearningUpdates,
      });

      this.beforeInterventionSnapshot = null;
      this.postInterventionTickCounter = 0;

      setTimeout(() => {
        this.transitionState('MONITORING');
      }, 2400);
    }, 1800);
  }

  // ── End Session Flow ──────────────────────────────────────

  public endSession(): VerificationResult | null {
    this.stopStreaming();
    this.clearDemo();

    if (!this.state.currentSession) return null;

    const completed: Session = {
      ...this.state.currentSession,
      endTime: Date.now(),
    };

    const updatedDNA: UserDNA = {
      ...this.state.userDNA,
      totalSessions: (this.state.userDNA.totalSessions || 0) + 1,
    };
    saveUserDNA(updatedDNA);

    const updatedHistory = [...this.state.sessionHistory, completed];
    saveSessionHistory(updatedHistory);

    const updatedPerformanceDNA = computePerformanceDNA(
      updatedDNA,
      updatedHistory
    );

    const latestVerification =
      completed.verifications[completed.verifications.length - 1] ||
      this.state.currentVerification;

    this.setState({
      currentSession: null,
      sessionHistory: updatedHistory,
      userDNA: updatedDNA,
      performanceDNA: updatedPerformanceDNA,
      currentState: 'MONITORING',
      activeTimelineStep: 'SESSION_START',
    });

    return latestVerification;
  }

  // ── Dedicated 60-Second Judge Demo (Requirement 14) ────────

  public runScenario(scenarioId: DemoScenarioId, speed: number = 2.0): void {
    this.clearDemo();
    this.demoSpeed = speed;
    this.demoIsPaused = false;

    const scenario = DEMO_SCENARIOS[scenarioId];
    if (!scenario) return;

    let targetIntent: UserIntent = this.state.currentIntent;
    if (scenarioId === 'THERMAL_RISE') targetIntent = 'COOLER_DEVICE';
    else if (scenarioId === 'LOW_BATTERY') targetIntent = 'LONGEST_BATTERY';
    else if (scenarioId === 'NETWORK_INSTABILITY') targetIntent = 'LOWEST_LATENCY';
    else if (scenarioId === 'NORMAL_GAMING') targetIntent = 'BALANCED';
    else targetIntent = 'MAXIMUM_STABILITY';

    this.startSession(scenario.workload, targetIntent, scenarioId);

    const schedule = [
      {
        t: 1800 / speed,
        fn: () => {
          this.setTimelineStep('SIGNALS_OBSERVED');
        },
      },
      {
        t: 4500 / speed,
        fn: () => {
          this.setTimelineStep('PATTERN_RECOGNIZED');
        },
      },
      {
        t: 8000 / speed,
        fn: () => {
          this.transitionState('PREDICTING');
          this.setTimelineStep('DEGRADATION_PREDICTED');
        },
      },
      {
        t: 11500 / speed,
        fn: () => {
          this.setTimelineStep('USER_PRIORITY_CHECKED');
          if (this.state.currentPrediction && this.state.currentPerformanceState) {
            const decision = selectAdaptationStrategy(
              this.state.currentPrediction,
              this.state.currentPerformanceState,
              this.state.userDNA,
              this.state.strategyEffectiveness,
              this.state.currentIntent
            );
            if (decision) {
              this.setState({ currentAdaptation: decision, currentState: 'ADAPTING' });
              this.setTimelineStep('STRATEGY_SELECTED');
            }
          }
        },
      },
      {
        t: 15500 / speed,
        fn: () => {
          this.applyAdaptation(scenario.targetStrategy);
        },
      },
    ];

    schedule.forEach(({ t, fn }) => {
      setTimeout(() => {
        if (!this.demoIsPaused) fn();
      }, t);
    });
  }

  public runJudgeDemo(speed: number = 2.0): void {
    this.runScenario('LONG_COMPETITIVE', speed);
  }

  public skipToDecision(): void {
    if (!this.state.currentSession) {
      this.startSession('COMPETITIVE', 'MAXIMUM_STABILITY');
    }
    setTimeout(() => {
      this.transitionState('PREDICTING');
      this.setTimelineStep('DEGRADATION_PREDICTED');
      if (this.state.currentPrediction && this.state.currentPerformanceState) {
        const decision = selectAdaptationStrategy(
          this.state.currentPrediction,
          this.state.currentPerformanceState,
          this.state.userDNA,
          this.state.strategyEffectiveness,
          this.state.currentIntent
        );
        if (decision) {
          this.setState({ currentAdaptation: decision, currentState: 'ADAPTING' });
          this.setTimelineStep('STRATEGY_SELECTED');
        }
      }
    }, 300);
  }

  public updateTelemetryManual(telemetry: Telemetry): void {
    const duration = this.simulator ? this.simulator.getDuration() : 0;
    const workload = this.state.currentSession ? this.state.currentSession.workload : 'COMPETITIVE';
    const perfState = evaluatePerformanceState(
      telemetry,
      workload,
      this.state.userDNA,
      duration
    );
    const prediction = predictPerformance(
      perfState,
      [...this.currentSessionTelemetry, telemetry],
      this.state.userDNA
    );
    const predictiveWindow = calculatePredictiveWindow(
      perfState,
      telemetry,
      this.state.userDNA
    );
    const rootCauseAnalysis = calculateRootCauseAnalysis(
      perfState,
      telemetry,
      this.state.userDNA
    );
    const earlyWarningLevel = getEarlyWarningLevel(perfState.riskScore);
    const candidateStrategies = calculateCandidateStrategyScores(
      perfState,
      telemetry,
      this.state.userDNA,
      this.state.currentIntent,
      this.state.strategyEffectiveness
    );

    this.currentSessionTelemetry.push(telemetry);

    this.setState({
      currentTelemetry: telemetry,
      currentPerformanceState: perfState,
      currentPrediction: prediction,
      predictiveWindow,
      rootCauseAnalysis,
      earlyWarningLevel,
      candidateStrategies,
      riskScore: perfState.riskScore,
      gameplayStabilityIndex: perfState.gameplayStabilityIndex,
      actionQueue: generateActionQueue(
        this.state.currentState,
        this.state.currentAdaptation?.strategy.id || null,
        perfState.riskScore
      ),
    });
  }

  public clearDemo(): void {
    if (this.demoTimerId) {
      clearTimeout(this.demoTimerId);
      this.demoTimerId = null;
    }
    this.demoTimeouts.forEach((t) => clearTimeout(t));
    this.demoTimeouts = [];
    this.demoIsPaused = false;
  }

  public stopLiveDemo(): void {
    this.clearDemo();
    this.stopStreaming();
    this.setState({
      liveDemo: {
        ...this.state.liveDemo,
        isActive: false,
        stage: 'IDLE',
        stageProgress: 0,
      },
    });
  }

  public replayLiveDemo(): void {
    const currentScenario = this.state.liveDemo.scenarioId || 'THERMAL_RISE';
    this.runLiveDemo(currentScenario, this.demoSpeed);
  }

  public runLiveDemo(scenarioId: DemoScenarioId = 'THERMAL_RISE', speed: number = 1.0): void {
    this.clearDemo();
    this.stopStreaming();
    this.demoSpeed = speed;
    this.demoIsPaused = false;

    const s = (ms: number) => Math.max(100, Math.round(ms / speed));

    const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS.THERMAL_RISE;
    const initialTelem: Telemetry = { timestamp: Date.now(), ...scenario.initialTelemetry } as Telemetry;

    let targetIntent: UserIntent = 'MAXIMUM_STABILITY';
    if (scenarioId === 'THERMAL_RISE') targetIntent = 'MAXIMUM_STABILITY';
    else if (scenarioId === 'NETWORK_INSTABILITY') targetIntent = 'LOWEST_LATENCY';
    else if (scenarioId === 'LOW_BATTERY') targetIntent = 'LONGEST_BATTERY';

    this.startSession(scenario.workload, targetIntent, scenarioId);

    // Initial MONITOR stage setup
    this.setState({
      currentState: 'MONITORING',
      activeTimelineStep: 'SESSION_START',
      currentTelemetry: initialTelem,
      liveDemo: {
        isActive: true,
        scenarioId,
        stage: 'MONITOR',
        stageProgress: 12,
        completedStages: [],
        stepDetails: {
          detectionMessage: '',
          degradationRisk: 0,
        },
      },
    });

    const schedule = (fn: () => void, delayMs: number) => {
      const timer = setTimeout(() => {
        if (!this.demoIsPaused) fn();
      }, s(delayMs));
      this.demoTimeouts.push(timer);
    };

    if (scenarioId === 'THERMAL_RISE') {
      // 1. MONITOR STAGE: 35.6°C -> 36.2°C -> 37.0°C
      schedule(() => {
        const t1: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 36.2,
          thermalRateOfRise: 0.26,
          fpsStability: 98.4,
          frameTimeVariance: 1.8,
          fps: 59.6,
          cpuUsage: 72,
          gpuUsage: 79,
        };
        this.updateTelemetryManual(t1);
        this.setTimelineStep('SIGNALS_OBSERVED');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'MONITOR',
            stageProgress: 24,
          },
        });
      }, 3000);

      schedule(() => {
        const t2: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 37.0,
          thermalRateOfRise: 0.34,
          fpsStability: 96.5,
          frameTimeVariance: 2.6,
          fps: 58.8,
          cpuUsage: 76,
          gpuUsage: 84,
        };
        this.updateTelemetryManual(t2);
        this.setTimelineStep('PATTERN_RECOGNIZED');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'MONITOR',
            stageProgress: 36,
          },
        });
      }, 7000);

      // 2. DETECT STAGE: 38.0°C -> 38.7°C, FPS dropping smoothly down to 91%
      schedule(() => {
        const t3: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 38.0,
          thermalRateOfRise: 0.42,
          fpsStability: 93.2,
          frameTimeVariance: 4.1,
          fps: 57.0,
          cpuUsage: 83,
          gpuUsage: 90,
        };
        this.updateTelemetryManual(t3);
        this.transitionState('PREDICTING');
        this.setTimelineStep('DEGRADATION_PREDICTED');
        this.setState({
          riskScore: 72,
          predictiveWindow: {
            status: 'RISK_IMMINENT',
            secondsRemaining: 78,
            formattedTime: '01:18',
            label: 'PERFORMANCE RISK IN',
            trajectorySlope: '+0.42°C/min',
          },
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DETECT',
            stageProgress: 45,
            completedStages: ['MONITOR'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              detectionMessage: 'Thermal pattern detected.',
              degradationRisk: 72,
            },
          },
        });
      }, 12000);

      schedule(() => {
        const t4: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 38.7,
          thermalRateOfRise: 0.46,
          fpsStability: 91.0,
          frameTimeVariance: 5.8,
          fps: 55.4,
          cpuUsage: 88,
          gpuUsage: 94,
        };
        this.updateTelemetryManual(t4);
      }, 16000);

      // 3. PREDICT STAGE: Degradation predicted, 87% confidence, thermal accumulation
      schedule(() => {
        const rootCause: RootCauseAnalysis = {
          riskScore: 72,
          level: 'WATCH',
          predictedRootCause: 'Thermal accumulation',
          patternMatchPercentage: 88,
          primaryInsight: 'Current thermal rise matches the user\'s learned long-session pattern.',
          contributors: [
            { factor: 'Thermal Accumulation', percentage: 58, metricValue: '38.7°C (+0.46°/m)', detail: 'High thermal slope' },
            { factor: 'Extended Session Duration', percentage: 27, metricValue: '28m+ typical pattern', detail: 'Matches learned DNA profile' },
            { factor: 'Workload Density', percentage: 15, metricValue: 'Competitive VRR load', detail: 'High frame consistency demand' },
          ],
        };
        this.setState({
          rootCauseAnalysis: rootCause,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'PREDICT',
            stageProgress: 60,
            completedStages: ['MONITOR', 'DETECT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              predictedCause: 'Thermal accumulation',
              predictionConfidence: 87,
              predictionReason: "Current thermal rise matches the user's learned long-session pattern.",
            },
          },
        });
      }, 20000);

      // 4. DECIDE STAGE: SUSTAIN FRAME STABILITY, DNA priority evaluation
      schedule(() => {
        this.transitionState('ADAPTING');
        this.setTimelineStep('STRATEGY_SELECTED');
        this.applyAdaptation('STABILITY_FIRST');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DECIDE',
            stageProgress: 75,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              recommendedStrategy: 'SUSTAIN FRAME STABILITY',
              strategyReasoning: "Your Performance DNA prioritizes frame consistency during extended competitive sessions.",
              decisionFactors: [
                { label: 'THERMAL RISK', value: 'HIGH (72%)', level: 'HIGH' },
                { label: 'SESSION DURATION', value: 'EXTENDED (28m+ pattern)', level: 'HIGH' },
                { label: 'FRAME STABILITY PRIORITY', value: 'HIGH (92/100 DNA)', level: 'HIGH' },
              ],
            },
          },
        });
      }, 28000);

      // 5. VERIFY STAGE: Intervention active, cooling & recovering (38.7°C -> 38.3°C, 91% -> 97%)
      schedule(() => {
        this.transitionState('VERIFYING');
        const tRecover1: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 38.5,
          thermalRateOfRise: -0.08,
          fpsStability: 94.6,
          frameTimeVariance: 3.1,
          fps: 58.4,
          cpuUsage: 80,
          gpuUsage: 84,
        };
        this.updateTelemetryManual(tRecover1);
      }, 38000);

      schedule(() => {
        const tRecover2: Telemetry = {
          ...this.state.currentTelemetry,
          thermalTemp: 38.3,
          thermalRateOfRise: -0.16,
          fpsStability: 97.0,
          frameTimeVariance: 1.9,
          fps: 59.8,
          cpuUsage: 74,
          gpuUsage: 81,
        };
        this.updateTelemetryManual(tRecover2);
        this.setState({
          riskScore: 22,
          predictiveWindow: {
            status: 'PREDICTED_STABLE',
            secondsRemaining: 342,
            formattedTime: '05:42',
            label: 'PREDICTED STABLE FOR',
            trajectorySlope: '-0.16°C/min',
          },
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'VERIFY',
            stageProgress: 88,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              beforeStability: '91%',
              afterStability: '97%',
              thermalDelta: '-0.4°C (38.7°C → 38.3°C)',
              strategyResult: 'STABILITY PRESERVED',
              verificationMessage: 'Observed performance matched the predicted outcome.',
            },
          },
        });
      }, 44000);

      // 6. LEARN STAGE: Pattern added to DNA, summary card ready
      schedule(() => {
        this.transitionState('LEARNING');
        const updatedDNA: UserDNA = {
          ...this.state.userDNA,
          thermalSensitivity: 0.88,
          totalAdaptations: this.state.userDNA.totalAdaptations + 1,
          typicalSessionDuration: 2100,
        };
        const newLearning = 'Extended competitive sessions consistently show thermal-driven stability risk.';
        const updatedLearnings = [newLearning, ...this.state.learningUpdates.filter((l) => l !== newLearning)];
        const updatedPerfDNA = computePerformanceDNA(updatedDNA, this.state.sessionHistory);

        this.setState({
          userDNA: updatedDNA,
          learningUpdates: updatedLearnings,
          performanceDNA: updatedPerfDNA,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'LEARN',
            stageProgress: 96,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              updatedDnaAttribute: 'THERMAL SENSITIVITY',
              updatedDnaChange: 'MEDIUM → HIGH',
              sessionPattern: 'Long competitive sessions',
              newLearningText: newLearning,
              summaryPredicted: 'Thermal accumulation causing frame drops',
              summaryStrategy: 'SUSTAIN FRAME STABILITY',
              summaryObserved: 'Stability preserved at 97% (+6% recovery, 38.3°C)',
              summaryConfidence: 87,
              summaryLearning: newLearning,
            },
          },
        });
      }, 50000);

      // 7. COMPLETE STAGE
      schedule(() => {
        this.transitionState('MONITORING');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'COMPLETE',
            stageProgress: 100,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY', 'LEARN', 'COMPLETE'],
          },
        });
      }, 56000);
    } else if (scenarioId === 'NETWORK_INSTABILITY') {
      schedule(() => {
        const t1: Telemetry = { ...this.state.currentTelemetry, networkStability: 'LOW', fpsStability: 96.0, frameTimeVariance: 3.8 };
        this.updateTelemetryManual(t1);
        this.setTimelineStep('SIGNALS_OBSERVED');
        this.setState({ liveDemo: { ...this.state.liveDemo, stage: 'MONITOR', stageProgress: 25 } });
      }, 3000);

      schedule(() => {
        const t2: Telemetry = { ...this.state.currentTelemetry, fpsStability: 93.4, frameTimeVariance: 5.2 };
        this.updateTelemetryManual(t2);
        this.setTimelineStep('PATTERN_RECOGNIZED');
        this.setState({ liveDemo: { ...this.state.liveDemo, stage: 'MONITOR', stageProgress: 35 } });
      }, 7000);

      schedule(() => {
        const t3: Telemetry = { ...this.state.currentTelemetry, fpsStability: 90.5, frameTimeVariance: 6.4, fps: 54.8 };
        this.updateTelemetryManual(t3);
        this.transitionState('PREDICTING');
        this.setTimelineStep('DEGRADATION_PREDICTED');
        this.setState({
          riskScore: 76,
          predictiveWindow: {
            status: 'RISK_IMMINENT',
            secondsRemaining: 48,
            formattedTime: '00:48',
            label: 'PACKET HAZARD IN',
            trajectorySlope: '+48ms jitter/s',
          },
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DETECT',
            stageProgress: 45,
            completedStages: ['MONITOR'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              detectionMessage: 'Network jitter and packet loss pattern detected.',
              degradationRisk: 76,
            },
          },
        });
      }, 12000);

      schedule(() => {
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'PREDICT',
            stageProgress: 60,
            completedStages: ['MONITOR', 'DETECT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              predictedCause: 'Packet congestion & upstream bufferbloat',
              predictionConfidence: 84,
              predictionReason: 'Upstream packet jitter matches wireless channel congestion pattern.',
            },
          },
        });
      }, 20000);

      schedule(() => {
        this.transitionState('ADAPTING');
        this.setTimelineStep('STRATEGY_SELECTED');
        this.applyAdaptation('NETWORK_PRIORITY');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DECIDE',
            stageProgress: 75,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              recommendedStrategy: 'Network-aware optimization',
              strategyReasoning: 'Your Performance DNA prioritizes low latency during competitive multiplayer sessions.',
              decisionFactors: [
                { label: 'NETWORK JITTER', value: 'HIGH (142ms / 8.4% loss)', level: 'HIGH' },
                { label: 'SOCKET QUEUE', value: 'OVERLOAD (48 buffers queued)', level: 'HIGH' },
                { label: 'NETWORK SENSITIVITY', value: 'HIGH (86/100 DNA)', level: 'HIGH' },
              ],
            },
          },
        });
      }, 28000);

      schedule(() => {
        this.transitionState('VERIFYING');
        const tRec: Telemetry = { ...this.state.currentTelemetry, networkStability: 'HIGH', fpsStability: 98.5, frameTimeVariance: 1.5, fps: 59.9 };
        this.updateTelemetryManual(tRec);
        this.setState({
          riskScore: 18,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'VERIFY',
            stageProgress: 88,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              beforeStability: '142ms (8.4% loss)',
              afterStability: '38ms (0.4% loss)',
              thermalDelta: 'Latencies normalized',
              strategyResult: 'LATENCY NORMALIZED',
              verificationMessage: 'Observed performance matched the predicted outcome.',
            },
          },
        });
      }, 38000);

      schedule(() => {
        this.transitionState('LEARNING');
        const updatedDNA: UserDNA = { ...this.state.userDNA, networkSensitivity: 0.92 };
        const newLearning = 'Network-sensitive workload pattern added to Performance DNA.';
        const updatedLearnings = [newLearning, ...this.state.learningUpdates.filter((l) => l !== newLearning)];
        this.setState({
          userDNA: updatedDNA,
          learningUpdates: updatedLearnings,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'LEARN',
            stageProgress: 96,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              updatedDnaAttribute: 'NETWORK SENSITIVITY',
              updatedDnaChange: 'MEDIUM → HIGH',
              sessionPattern: 'Peak-Hour Wireless Matchmaking',
              newLearningText: newLearning,
              summaryPredicted: 'Bufferbloat and packet jitter dropouts',
              summaryStrategy: 'Network-aware optimization',
              summaryObserved: 'Packet loss suppressed to 0.4% (38ms latency)',
              summaryConfidence: 84,
              summaryLearning: newLearning,
            },
          },
        });
      }, 48000);

      schedule(() => {
        this.transitionState('MONITORING');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'COMPLETE',
            stageProgress: 100,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY', 'LEARN', 'COMPLETE'],
          },
        });
      }, 54000);
    } else if (scenarioId === 'LOW_BATTERY') {
      schedule(() => {
        const t1: Telemetry = { ...this.state.currentTelemetry, batteryLevel: 17, cpuUsage: 82, gpuUsage: 88 };
        this.updateTelemetryManual(t1);
        this.setTimelineStep('SIGNALS_OBSERVED');
        this.setState({ liveDemo: { ...this.state.liveDemo, stage: 'MONITOR', stageProgress: 25 } });
      }, 3000);

      schedule(() => {
        const t2: Telemetry = { ...this.state.currentTelemetry, batteryLevel: 16, thermalTemp: 38.2, fpsStability: 93.0 };
        this.updateTelemetryManual(t2);
        this.setTimelineStep('PATTERN_RECOGNIZED');
        this.setState({ liveDemo: { ...this.state.liveDemo, stage: 'MONITOR', stageProgress: 35 } });
      }, 7000);

      schedule(() => {
        this.transitionState('PREDICTING');
        this.setTimelineStep('DEGRADATION_PREDICTED');
        this.setState({
          riskScore: 79,
          predictiveWindow: {
            status: 'RISK_IMMINENT',
            secondsRemaining: 65,
            formattedTime: '01:05',
            label: 'SHUTDOWN RISK IN',
            trajectorySlope: '-0.45% battery/m',
          },
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DETECT',
            stageProgress: 45,
            completedStages: ['MONITOR'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              detectionMessage: 'High drain on low battery reserve detected.',
              degradationRisk: 79,
            },
          },
        });
      }, 12000);

      schedule(() => {
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'PREDICT',
            stageProgress: 60,
            completedStages: ['MONITOR', 'DETECT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              predictedCause: 'Excessive core voltage at 16% battery',
              predictionConfidence: 89,
              predictionReason: 'Discharge velocity predicts abrupt shutdown within 14 minutes.',
            },
          },
        });
      }, 20000);

      schedule(() => {
        this.transitionState('ADAPTING');
        this.setTimelineStep('STRATEGY_SELECTED');
        this.applyAdaptation('BATTERY_EFFICIENCY');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'DECIDE',
            stageProgress: 75,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              recommendedStrategy: 'Efficiency-aware performance balancing',
              strategyReasoning: 'Your Performance DNA balances frame consistency with runtime preservation when battery < 20%.',
              decisionFactors: [
                { label: 'BATTERY RESERVE', value: 'CRITICAL (16%)', level: 'HIGH' },
                { label: 'DISCHARGE RATE', value: '7.2W (Velocity > 0.4%/min)', level: 'HIGH' },
                { label: 'BATTERY PRIORITY', value: 'HIGH (88/100 DNA)', level: 'HIGH' },
              ],
            },
          },
        });
      }, 28000);

      schedule(() => {
        this.transitionState('VERIFYING');
        const tRec: Telemetry = { ...this.state.currentTelemetry, thermalTemp: 36.8, fpsStability: 94.2, fps: 58.2 };
        this.updateTelemetryManual(tRec);
        this.setState({
          riskScore: 24,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'VERIFY',
            stageProgress: 88,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              beforeStability: '7.2W draw (14m est)',
              afterStability: '4.1W draw (+34m est)',
              thermalDelta: '-1.4°C cooling',
              strategyResult: 'EFFICIENCY RESTORED',
              verificationMessage: 'Observed performance matched the predicted outcome.',
            },
          },
        });
      }, 38000);

      schedule(() => {
        this.transitionState('LEARNING');
        const updatedDNA: UserDNA = { ...this.state.userDNA, batteryPriority: 0.90 };
        const newLearning = 'Low battery efficiency throttling threshold calibrated.';
        const updatedLearnings = [newLearning, ...this.state.learningUpdates.filter((l) => l !== newLearning)];
        this.setState({
          userDNA: updatedDNA,
          learningUpdates: updatedLearnings,
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'LEARN',
            stageProgress: 96,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY'],
            stepDetails: {
              ...this.state.liveDemo.stepDetails,
              updatedDnaAttribute: 'BATTERY PRIORITY',
              updatedDnaChange: 'MEDIUM → HIGH',
              sessionPattern: 'Low Battery Endurance Load',
              newLearningText: newLearning,
              summaryPredicted: 'Abrupt shutdown risk from 7.2W discharge',
              summaryStrategy: 'Efficiency-aware performance balancing',
              summaryObserved: 'Power draw throttled to 4.1W (+34m runtime)',
              summaryConfidence: 89,
              summaryLearning: newLearning,
            },
          },
        });
      }, 48000);

      schedule(() => {
        this.transitionState('MONITORING');
        this.setState({
          liveDemo: {
            ...this.state.liveDemo,
            stage: 'COMPLETE',
            stageProgress: 100,
            completedStages: ['MONITOR', 'DETECT', 'PREDICT', 'DECIDE', 'VERIFY', 'LEARN', 'COMPLETE'],
          },
        });
      }, 54000);
    }
  }

  public resetToDemo(): void {
    this.stopStreaming();
    this.clearDemo();

    const userDNA = loadUserDNA();
    const sessionHistory = loadSessionHistory();
    const performanceDNA = computePerformanceDNA(userDNA, sessionHistory);
    const initialPerformance = evaluatePerformanceState(
      DEMO_INITIAL_TELEMETRY,
      'COMPETITIVE',
      userDNA,
      0
    );
    const initialPrediction = predictPerformance(
      initialPerformance,
      [DEMO_INITIAL_TELEMETRY],
      userDNA
    );
    const predictiveWindow = calculatePredictiveWindow(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA
    );
    const rootCauseAnalysis = calculateRootCauseAnalysis(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA
    );
    const earlyWarningLevel = getEarlyWarningLevel(initialPerformance.riskScore);
    const candidateStrategies = calculateCandidateStrategyScores(
      initialPerformance,
      DEMO_INITIAL_TELEMETRY,
      userDNA,
      'MAXIMUM_STABILITY',
      this.state.strategyEffectiveness
    );

    this.setState({
      currentState: 'MONITORING',
      activeTimelineStep: 'SESSION_START',
      currentSession: null,
      currentTelemetry: DEMO_INITIAL_TELEMETRY,
      currentPerformanceState: initialPerformance,
      currentPrediction: initialPrediction,
      currentAdaptation: null,
      currentVerification: null,
      currentIntent: 'MAXIMUM_STABILITY',
      earlyWarningLevel,
      predictiveWindow,
      rootCauseAnalysis,
      candidateStrategies,
      activeProfilePreset: 'PROFILE_A',
      activeScenario: null,
      liveDemo: { ...INITIAL_LIVE_DEMO },
      performanceDNA,
      riskScore: initialPerformance.riskScore,
      gameplayStabilityIndex: initialPerformance.gameplayStabilityIndex,
      actionQueue: generateActionQueue('MONITORING', null, initialPerformance.riskScore),
    });
  }

  public stopStreaming(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setLiveDeviceMode(enabled: boolean): void {
    liveDeviceSensor.setLiveActive(enabled);
    if (enabled) {
      const sample = liveDeviceSensor.sampleLiveTelemetry();
      this.updateTelemetryManual(sample);
    }
  }

  public isLiveDeviceMode(): boolean {
    return liveDeviceSensor.isLiveDevice();
  }

  public getLiveDeviceStatus(): LiveDeviceStatus {
    return liveDeviceSensor.getStatus();
  }
}

export const vyraEngine = new VYRAEngine();
