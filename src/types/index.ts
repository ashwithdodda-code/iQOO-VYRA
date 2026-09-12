// ─────────────────────────────────────────────────────────
// iQOO VYRA — Type System (Step 4 Predictive Advantage)
// ─────────────────────────────────────────────────────────

// ── Intelligence States ──────────────────────────────────

export type VYRAStateType =
  | 'MONITORING'
  | 'ANALYZING'
  | 'PREDICTING'
  | 'ADAPTING'
  | 'VERIFYING'
  | 'LEARNING';

// ── Early Warning Intelligence Levels ────────────────────

export type EarlyWarningLevel = 'STABLE' | 'WATCH' | 'INTERVENE';

// ── Workload ─────────────────────────────────────────────

export type WorkloadType =
  | 'COMPETITIVE'
  | 'CASUAL'
  | 'RANKED'
  | 'STREAMING'
  | 'TRAINING'
  | 'EDITING'
  | 'MULTITASKING';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type NetworkStability = 'HIGH' | 'MEDIUM' | 'LOW';

// ── User Intent (Intent-Driven Performance) ──────────────

export type UserIntent =
  | 'MAXIMUM_STABILITY'
  | 'LOWEST_LATENCY'
  | 'LONGEST_BATTERY'
  | 'COOLER_DEVICE'
  | 'PEAK_PERFORMANCE'
  | 'BALANCED';

export interface IntentConfig {
  id: UserIntent;
  label: string;
  shortDescription: string;
  bias: {
    fpsStability: number;
    thermalMargin: number;
    latencyBuffer: number;
    powerCap: number;
  };
}

// ── Strategies ───────────────────────────────────────────

export type StrategyId =
  | 'STABILITY_FIRST'
  | 'THERMAL_BALANCE'
  | 'NETWORK_PRIORITY'
  | 'BATTERY_EFFICIENCY'
  | 'PEAK_PERFORMANCE'
  | 'BALANCED_PERFORMANCE';

export interface Strategy {
  id: StrategyId;
  label: string;
  description: string;
  targets: ('thermal' | 'fps' | 'network' | 'battery')[];
}

// ── Telemetry / Device Signals ───────────────────────────

export interface InputTelemetry {
  touchStability: number;       // 0-100% e.g. 99.1%
  inputJitter: number;          // ms e.g. 1.2ms
  touchSampleRate: number;      // Hz e.g. 300Hz
  gestureLatency: number;       // ms e.g. 16.5ms
  triggerConsistency: number;   // 0-100% e.g. 99.6%
}

export interface Telemetry {
  timestamp: number;
  fps: number;
  fpsStability: number;          // 0-100%
  frameTimeVariance: number;     // ms
  thermalTemp: number;           // °C
  thermalRateOfRise: number;     // °C/min
  batteryLevel: number;          // 0-100%
  networkStability: NetworkStability;
  cpuUsage: number;              // 0-100%
  gpuUsage: number;              // 0-100%
  memoryUsage: number;           // 0-100% (RAM pressure)
  inputTelemetry?: InputTelemetry;
}

// ── Workload Profile ─────────────────────────────────────

export interface WorkloadProfile {
  type: WorkloadType;
  cpuIntensity: number;
  gpuIntensity: number;
  networkDependency: number;
  thermalImpact: number;
  batteryDrain: number;
}

// ── Simulation Config ────────────────────────────────────

export interface SimulationConfig {
  workload: WorkloadType;
  adaptationModifier: number;
  strategyActive: boolean;
  activeStrategy: StrategyId | null;
}

// ── User Performance DNA ─────────────────────────────────

export interface UserDNA {
  competitivePriority: number;    // 0-1
  thermalSensitivity: number;     // 0-1
  batteryPriority: number;        // 0-1
  networkSensitivity: number;     // 0-1
  preferredSessionLength: number; // seconds
  preferredPerformanceBehaviour?: string; // e.g. "Frame consistency over peak FPS"
  typicalSessionDuration?: number; // seconds
  workloadPreferences: Record<WorkloadType, number>;
  totalSessions: number;
  totalAdaptations: number;
}

export interface PerformanceDNA {
  competitivePriority: { level: PriorityLevel; score: number };
  thermalSensitivity: { level: PriorityLevel; score: number };
  batteryPriority: { level: PriorityLevel; score: number };
  networkSensitivity: { level: PriorityLevel; score: number };
  sessionPattern: { label: string; score: number };
  insights: string[];
}

export interface PresetProfile {
  id: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE';
  name: string;
  tagline: string;
  dna: UserDNA;
  expectedStrategy: StrategyId;
  description: string;
}

// ── Predictive Window (Step 4 Requirement 1) ─────────────

export interface PredictiveWindow {
  status: 'PREDICTED_STABLE' | 'RISK_IMMINENT';
  secondsRemaining: number;
  formattedTime: string;
  label: string; // e.g. "PREDICTED STABLE FOR" or "PERFORMANCE RISK IN"
  trajectorySlope: string;
}

// ── Multi-Factor Root Cause Model (Step 4 Requirement 4) ──

export interface RootCauseContributor {
  factor: string;
  percentage: number; // Normalized to sum to 100%
  metricValue: string;
  detail: string;
}

export interface RootCauseAnalysis {
  riskScore: number;
  level: EarlyWarningLevel;
  patternMatchPercentage: number;
  contributors: RootCauseContributor[];
  primaryInsight: string;
  predictedRootCause: string;
}

// ── Candidate Strategy Selection Scoring (Step 4 Req 12) ──

export interface CandidateStrategyScore {
  strategyId: StrategyId;
  label: string;
  score: number;             // Overall ranking score (e.g. 91)
  userFit: number;           // 0-100%
  deviceFit: number;         // 0-100%
  predictedBenefit: number;   // 0-100%
  historicalEffectiveness: number; // 0-100%
  selected: boolean;
}

// ── Risk Assessment ──────────────────────────────────────

export interface RiskFactors {
  thermalRisk: number;         // 0-100
  fpsRisk: number;             // 0-100
  networkRisk: number;         // 0-100
  batteryRisk: number;         // 0-100
  sessionDurationRisk: number; // 0-100
  compoundRisk: number;        // 0-100
  inputRisk?: number;          // 0-100 (Step 7 Input-aware performance)
}

export interface PerformanceState {
  telemetry: Telemetry;
  workload: WorkloadType;
  riskScore: number;           // 0-100 weighted composite
  riskFactors: RiskFactors;
  sessionDuration: number;     // seconds
  gameplayStabilityIndex: number; // 0-100 (Step 7 Requirement 5)
}

// ── Prediction & Confidence Breakdown ────────────────────

export type PredictionType =
  | 'STABLE'
  | 'THERMAL_DEGRADATION'
  | 'FPS_INSTABILITY'
  | 'NETWORK_INSTABILITY'
  | 'BATTERY_RISK'
  | 'COMPOUND_RISK'
  | 'INPUT_RESPONSIVENESS_RISK';

export interface ConfidenceBreakdown {
  overall: number;               // 0-100
  signalConfidence: number;      // 0-100
  trendConfidence: number;       // 0-100
  userHistoryConfidence: number; // 0-100
  strategyConfidence: number;    // 0-100
}

export interface Prediction {
  id: string;
  timestamp: number;
  type: PredictionType;
  message: string;
  confidence: number;          // 0-1
  confidenceBreakdown: ConfidenceBreakdown;
  primaryCause: string;
  timeHorizon: string;         // e.g. "Next 2m 48s"
  riskScore: number;
  factors: {
    label: string;
    value: string;
    trend: 'rising' | 'falling' | 'stable';
  }[];
  contributorsText?: string;
}

// ── Decision Trace & Counterfactual ──────────────────────

export interface DecisionTraceStep {
  step: string;
  label: string;
  value: string;
  detail?: string;
}

export interface CounterfactualComparison {
  withoutVyra: {
    temperature: string;
    fpsStability: string;
    frameTimeVariance: string;
    riskOutcome: string;
  };
  withVyra: {
    temperature: string;
    fpsStability: string;
    frameTimeVariance: string;
    riskOutcome: string;
  };
  simulatedDeltaText: string;
}

// ── Performance Control Center Domains ───────────────────

export type ControlDomainId =
  | 'THERMAL'
  | 'CPU_GPU'
  | 'NETWORK'
  | 'MEMORY'
  | 'DISPLAY_PACING';

export interface ControlDomainState {
  id: ControlDomainId;
  label: string;
  currentState: string;
  recommendation: string;
  reason: string;
  expectedEffect: string;
  status: 'OPTIMAL' | 'MODULATING' | 'CRITICAL';
  deviceTarget: string;
}

// ── Adaptation ───────────────────────────────────────────

export interface AdaptationDecision {
  id: string;
  timestamp: number;
  strategy: Strategy;
  prediction: Prediction;
  reasoning: {
    detected: { label: string; value: string }[];
    predicted: string;
    prioritized: string;
    confidence: number;
  };
  decisionTrace: DecisionTraceStep[];
  counterfactual: CounterfactualComparison;
  candidateScores: CandidateStrategyScore[];
  accepted: boolean;
}

// ── Verification ─────────────────────────────────────────

export interface VerificationResult {
  id: string;
  timestamp: number;
  sessionId: string;
  strategyUsed: StrategyId;
  before: {
    fpsStability: number;
    thermalRate: number;
    frameTimeVariance: number;
    riskScore: number;
  };
  after: {
    fpsStability: number;
    thermalRate: number;
    frameTimeVariance: number;
    riskScore: number;
  };
  improvement: number;
  effective: boolean;
  message: string;
  predictionAccuracy?: number;
  thermalImpact?: string;
  stabilityChange?: string;
}

// ── Learning & Strategy Memory ───────────────────────────

export interface StrategyEffectiveness {
  strategyId: StrategyId;
  workload: WorkloadType;
  uses: number;
  successes: number;
  averageImprovement: number;
  lastUsed: number;
  workload_context?: WorkloadType;
  thermal_context?: string;
  network_context?: string;
}

export interface LearningOutcome {
  timestamp: number;
  sessionId: string;
  strategyId: StrategyId;
  workload: WorkloadType;
  effective: boolean;
  improvement: number;
  insight: string;
  previousBelief?: string;
  observedPattern?: string;
  updatedBelief?: string;
  dnaUpdates: { field: keyof UserDNA; delta: number }[];
}

// ── Step 5 Demo Scenarios (Req I) ─────────────────────────

export type DemoScenarioId =
  | 'NORMAL_GAMING'
  | 'LONG_COMPETITIVE'
  | 'THERMAL_RISE'
  | 'NETWORK_INSTABILITY'
  | 'LOW_BATTERY'
  | 'PERFORMANCE_DEGRADATION';

export interface DemoScenario {
  id: DemoScenarioId;
  label: string;
  tagline: string;
  workload: WorkloadType;
  initialTelemetry: Partial<Telemetry>;
  targetStrategy: StrategyId;
  description: string;
  expectedOutcome: string;
}

export interface PredictionAccuracyRecord {
  id: string;
  prediction: string;
  predictedTime: string;
  observedTime: string;
  accuracy: number;
  leadTimeSeconds: number;
}

export interface LearningCurvePoint {
  sessionNumber: number;
  accuracy: number;
  status: string;
}

// ── Decision Timeline ────────────────────────────────────

export type TimelineStepId =
  | 'SESSION_START'
  | 'SIGNALS_OBSERVED'
  | 'PATTERN_RECOGNIZED'
  | 'DEGRADATION_PREDICTED'
  | 'USER_PRIORITY_CHECKED'
  | 'STRATEGY_SELECTED'
  | 'OUTCOME_VERIFIED'
  | 'PROFILE_UPDATED';

export interface TimelineStep {
  id: TimelineStepId;
  label: string;
  shortText: string;
  active: boolean;
  completed: boolean;
  timestamp?: number;
}

// ── Session ──────────────────────────────────────────────

export interface Session {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  workload: WorkloadType;
  userIntent: UserIntent;
  telemetryHistory: Telemetry[];
  predictions: Prediction[];
  adaptations: AdaptationDecision[];
  verifications: VerificationResult[];
  learningOutcomes: LearningOutcome[];
  averageFps: number;
  averageThermal: number;
  batteryDrain: number;
  peakRiskScore: number;
  finalVerification: VerificationResult | null;
}

// ── Step 6 Live Intelligence Demonstration (Req 1-12) ───

export type LiveDemoStage =
  | 'IDLE'
  | 'MONITOR'
  | 'DETECT'
  | 'PREDICT'
  | 'DECIDE'
  | 'VERIFY'
  | 'LEARN'
  | 'COMPLETE';

export interface LiveDemoState {
  isActive: boolean;
  scenarioId: DemoScenarioId;
  stage: LiveDemoStage;
  stageProgress: number; // 0-100%
  completedStages: LiveDemoStage[];
  stepDetails: {
    detectionMessage?: string;
    degradationRisk?: number;
    predictedCause?: string;
    predictionConfidence?: number;
    predictionReason?: string;
    recommendedStrategy?: string;
    strategyReasoning?: string;
    decisionFactors?: { label: string; value: string; level: 'HIGH' | 'MEDIUM' | 'LOW' }[];
    beforeStability?: string;
    afterStability?: string;
    thermalDelta?: string;
    strategyResult?: string;
    verificationMessage?: string;
    updatedDnaAttribute?: string;
    updatedDnaChange?: string;
    sessionPattern?: string;
    newLearningText?: string;
    summaryPredicted?: string;
    summaryStrategy?: string;
    summaryObserved?: string;
    summaryConfidence?: number;
    summaryLearning?: string;
  };
}

// ── iQOO Device Layer Resources (Step 7 Requirement 1) ────

export type DeviceResourceId =
  | 'CPU'
  | 'GPU'
  | 'THERMAL'
  | 'DISPLAY'
  | 'INPUT'
  | 'NETWORK'
  | 'BATTERY'
  | 'MEMORY';

export interface IQOODeviceResource {
  id: DeviceResourceId;
  name: string;
  subsystem: string;
  currentState: string;
  statusLevel: 'OPTIMAL' | 'MODULATING' | 'HIGH' | 'CRITICAL';
  vyraIntent: string;
  controlTarget: string;
  metricValue: string;
  productionIntegrationTarget: string;
}

// ── VYRA Device Action Queue (Step 7 Requirement 8) ──────

export interface DeviceActionQueueItem {
  id: string;
  label: string;
  status: 'COMPLETED' | 'ACTIVE' | 'QUEUED';
  type: 'OBSERVE' | 'PREDICT' | 'REQUEST' | 'VERIFY' | 'UPDATE';
  deviceSubsystem: string;
  recommendedAction: string;
}

// ── Unified VYRA State ───────────────────────────────────

export interface VYRAState {
  currentState: VYRAStateType;
  currentSession: Session | null;
  currentTelemetry: Telemetry;
  currentPerformanceState: PerformanceState | null;
  currentPrediction: Prediction | null;
  currentAdaptation: AdaptationDecision | null;
  currentVerification: VerificationResult | null;
  currentIntent: UserIntent;
  activeTimelineStep: TimelineStepId;
  earlyWarningLevel: EarlyWarningLevel;
  predictiveWindow: PredictiveWindow;
  rootCauseAnalysis: RootCauseAnalysis | null;
  candidateStrategies: CandidateStrategyScore[];
  activeProfilePreset: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE';
  activeScenario: DemoScenarioId | null;
  liveDemo: LiveDemoState;
  userDNA: UserDNA;
  performanceDNA: PerformanceDNA;
  sessionHistory: Session[];
  strategyEffectiveness: StrategyEffectiveness[];
  learningUpdates: string[];
  riskScore: number;
  gameplayStabilityIndex: number;
  actionQueue: DeviceActionQueueItem[];
}

// ── Step 8 Advantage & Differentiation Types ───────────

export interface AdvantageMetric {
  id: string;
  metric: string;
  conventional: string;
  vyra: string;
  conventionalDetail: string;
  vyraDetail: string;
  tradeOffNote: string;
  status: 'SUSTAINED' | 'TRADE_OFF' | 'PREEMPTIVE';
}

export interface AdvantageDemoStep {
  step: number;
  label: string;
  description: string;
  enginePhase: string;
  metricSnapshot: {
    fps: string;
    thermal: string;
    stability: string;
    jitter: string;
  };
}

// ── Persistence Keys ─────────────────────────────────────

export const STORAGE_KEYS = {
  USER_DNA: 'vyra_user_dna',
  SESSION_HISTORY: 'vyra_session_history',
  STRATEGY_EFFECTIVENESS: 'vyra_strategy_effectiveness',
  LEARNING_UPDATES: 'vyra_learning_updates',
  USER_INTENT: 'vyra_user_intent',
  PRESET_PROFILE: 'vyra_preset_profile',
} as const;
