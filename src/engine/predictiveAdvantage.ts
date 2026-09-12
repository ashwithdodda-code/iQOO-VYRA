import {
  CandidateStrategyScore,
  EarlyWarningLevel,
  LearningCurvePoint,
  PerformanceState,
  PredictionAccuracyRecord,
  PredictiveWindow,
  PresetProfile,
  RootCauseAnalysis,
  RootCauseContributor,
  StrategyEffectiveness,
  StrategyId,
  Telemetry,
  UserDNA,
  UserIntent,
} from '../types';
import { STRATEGY_LIBRARY } from '../data/simulationData';

// ── 1. Calculate Predictive Window ────────────────────────

export function calculatePredictiveWindow(
  perfState: PerformanceState,
  telemetry: Telemetry,
  dna: UserDNA
): PredictiveWindow {
  const risk = perfState.riskScore;

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (risk < 30) {
    // Stable phase: calculate remaining buffer before thermal climb begins to affect pacing
    // Baseline margin: 37.5°C threshold.
    const tempMargin = Math.max(0.5, 37.5 - telemetry.thermalTemp);
    const rate = Math.max(0.1, telemetry.thermalRateOfRise || 0.12);
    // Minutes = tempMargin / rate; convert to seconds
    const rawSeconds = Math.round((tempMargin / rate) * 60);
    const secondsRemaining = Math.max(90, Math.min(360, rawSeconds));

    return {
      status: 'PREDICTED_STABLE',
      secondsRemaining,
      formattedTime: formatTime(secondsRemaining),
      label: 'PREDICTED STABLE FOR',
      trajectorySlope: `+${rate.toFixed(2)}°C/min slope`,
    };
  } else {
    // Risk developing or imminent: calculate lead time to frame jitter emergence
    // Thermal excess acceleration and frame variance slope
    const rate = Math.max(0.18, telemetry.thermalRateOfRise || 0.25);
    const varianceExcess = Math.max(0.5, 6.5 - telemetry.frameTimeVariance);
    const rawSeconds = Math.round((varianceExcess / (rate * 2.2)) * 60);
    const secondsRemaining = Math.max(45, Math.min(210, rawSeconds));

    return {
      status: 'RISK_IMMINENT',
      secondsRemaining,
      formattedTime: formatTime(secondsRemaining),
      label: 'PERFORMANCE RISK IN',
      trajectorySlope: `+${rate.toFixed(2)}°C/min climb · ${telemetry.frameTimeVariance.toFixed(1)}ms jitter`,
    };
  }
}

// ── 2. Early Warning Intelligence Level ───────────────────

export function getEarlyWarningLevel(riskScore: number): EarlyWarningLevel {
  if (riskScore < 30) return 'STABLE';
  if (riskScore <= 60) return 'WATCH';
  return 'INTERVENE';
}

// ── 3. Multi-Factor Root Cause Model ──────────────────────

export function calculateRootCauseAnalysis(
  perfState: PerformanceState,
  telemetry: Telemetry,
  dna: UserDNA
): RootCauseAnalysis {
  const level = getEarlyWarningLevel(perfState.riskScore);

  // Raw factor weights based on actual physical values
  const thermalRaw =
    Math.max(1, (telemetry.thermalTemp - 34) * 8 + telemetry.thermalRateOfRise * 50);
  const gpuRaw = Math.max(1, (telemetry.gpuUsage - 40) * 1.2);
  const durationRaw = Math.max(1, (perfState.sessionDuration / 60) * 4);
  const networkRaw =
    telemetry.networkStability === 'LOW'
      ? 45
      : telemetry.networkStability === 'MEDIUM'
      ? 20
      : 5;
  const batteryRaw = Math.max(1, (100 - telemetry.batteryLevel) * 0.4);

  const total = thermalRaw + gpuRaw + durationRaw + networkRaw + batteryRaw;

  // Normalized percentages summing to 100%
  const thermalPct = Math.round((thermalRaw / total) * 100);
  const gpuPct = Math.round((gpuRaw / total) * 100);
  const durationPct = Math.round((durationRaw / total) * 100);
  const netPct = Math.round((networkRaw / total) * 100);
  const battPct = Math.max(1, 100 - (thermalPct + gpuPct + durationPct + netPct));

  const contributors: RootCauseContributor[] = [
    {
      factor: 'Thermal trajectory',
      percentage: thermalPct,
      metricValue: `${telemetry.thermalTemp.toFixed(1)}°C (+${telemetry.thermalRateOfRise.toFixed(2)}°/m)`,
      detail: 'Skin temp climbing toward throttling boundary',
    },
    {
      factor: 'GPU saturation',
      percentage: gpuPct,
      metricValue: `${Math.round(telemetry.gpuUsage)}% load`,
      detail: 'Sustained rasterization without dispatch bubbles',
    },
    {
      factor: 'Session duration',
      percentage: durationPct,
      metricValue: `${Math.round(perfState.sessionDuration / 60)} min`,
      detail: 'Cumulative internal heat saturation profile',
    },
    {
      factor: 'Network instability',
      percentage: netPct,
      metricValue: telemetry.networkStability,
      detail: 'Upstream socket variance & packet jitter',
    },
    {
      factor: 'Battery drain',
      percentage: battPct,
      metricValue: `${Math.round(telemetry.batteryLevel)}%`,
      detail: 'Discharge velocity under compute intensity',
    },
  ].sort((a, b) => b.percentage - a.percentage);

  // Distinct root causes formulated with technical precision
  let predictedRootCause =
    'FPS instability is likely to emerge from the current thermal trajectory.';
  if (telemetry.networkStability === 'LOW') {
    predictedRootCause =
      'Competitive latency risk is increasing due to network instability.';
  } else if (telemetry.frameTimeVariance > 5.5) {
    predictedRootCause =
      'Pacing inconsistency emerging from GPU command queue saturation.';
  } else if (telemetry.batteryLevel < 25) {
    predictedRootCause =
      'Discharge slope threatens target competitive session duration.';
  } else if (telemetry.thermalRateOfRise > 0.32) {
    predictedRootCause =
      'FPS instability is likely to emerge from the current thermal trajectory.';
  }

  // Pattern match against historical sessions where degradation occurred
  const patternMatchPercentage = Math.min(
    95,
    Math.max(76, Math.round(82 + (perfState.riskScore / 100) * 12))
  );

  return {
    riskScore: perfState.riskScore,
    level,
    patternMatchPercentage,
    contributors,
    primaryInsight:
      'Current trajectory matches learned precursor signature from 14 prior sessions.',
    predictedRootCause,
  };
}

// ── 4. Candidate Strategy Selection Scoring ───────────────

export function calculateCandidateStrategyScores(
  perfState: PerformanceState,
  telemetry: Telemetry,
  dna: UserDNA,
  intent: UserIntent,
  effectivenessHistory: StrategyEffectiveness[]
): CandidateStrategyScore[] {
  const strategies: StrategyId[] = [
    'STABILITY_FIRST',
    'THERMAL_BALANCE',
    'PEAK_PERFORMANCE',
    'BATTERY_EFFICIENCY',
    'NETWORK_PRIORITY',
    'BALANCED_PERFORMANCE',
  ];

  const scores: CandidateStrategyScore[] = strategies.map((id) => {
    const strat = STRATEGY_LIBRARY[id];
    let userFit = 50;
    let deviceFit = 50;
    let predictedBenefit = 60;

    // 1. User Fit (DNA + Intent)
    if (id === 'STABILITY_FIRST') {
      userFit = Math.round(dna.competitivePriority * 60 + (intent === 'MAXIMUM_STABILITY' ? 38 : 25));
    } else if (id === 'THERMAL_BALANCE') {
      userFit = Math.round(dna.thermalSensitivity * 60 + (intent === 'COOLER_DEVICE' ? 38 : 22));
    } else if (id === 'BATTERY_EFFICIENCY') {
      userFit = Math.round(dna.batteryPriority * 60 + (intent === 'LONGEST_BATTERY' ? 38 : 15));
    } else if (id === 'NETWORK_PRIORITY') {
      userFit = Math.round(dna.networkSensitivity * 60 + (intent === 'LOWEST_LATENCY' ? 38 : 20));
    } else if (id === 'PEAK_PERFORMANCE') {
      userFit = intent === 'PEAK_PERFORMANCE' ? 88 : 52;
    } else {
      userFit = intent === 'BALANCED' ? 90 : 65;
    }

    // 2. Device Fit (Addressing current physical signals)
    if (id === 'STABILITY_FIRST') {
      deviceFit = Math.min(96, Math.round(65 + telemetry.frameTimeVariance * 4.5));
    } else if (id === 'THERMAL_BALANCE') {
      deviceFit = Math.min(95, Math.round(50 + (telemetry.thermalTemp - 34) * 8));
    } else if (id === 'NETWORK_PRIORITY') {
      deviceFit = telemetry.networkStability === 'LOW' ? 96 : telemetry.networkStability === 'MEDIUM' ? 78 : 38;
    } else if (id === 'BATTERY_EFFICIENCY') {
      deviceFit = telemetry.batteryLevel < 30 ? 92 : 40;
    } else if (id === 'PEAK_PERFORMANCE') {
      deviceFit = telemetry.thermalTemp > 38.0 ? 25 : 68;
    } else {
      deviceFit = 72;
    }

    // 3. Historical Effectiveness
    const history = effectivenessHistory.find((h) => h.strategyId === id);
    const historicalEffectiveness = history
      ? Math.round((history.successes / Math.max(1, history.uses)) * 100)
      : 80;

    predictedBenefit = Math.round((deviceFit * 0.6 + userFit * 0.4));

    // Weighted Overall Score (0-100)
    const overallScore = Math.round(
      userFit * 0.35 +
      deviceFit * 0.35 +
      predictedBenefit * 0.15 +
      historicalEffectiveness * 0.15
    );

    return {
      strategyId: id,
      label: strat.label,
      score: overallScore,
      userFit: Math.min(98, userFit),
      deviceFit: Math.min(98, deviceFit),
      predictedBenefit: Math.min(98, predictedBenefit),
      historicalEffectiveness,
      selected: false,
    };
  });

  // Sort descending by score
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > 0) {
    scores[0].selected = true;
  }

  return scores;
}

// ── 5. Profile A vs Profile B Presets ─────────────────────

export const PRESET_PROFILES: Record<'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE', PresetProfile> = {
  PROFILE_A: {
    id: 'PROFILE_A',
    name: 'COMPETITIVE GAMER (ASHWITH)',
    tagline: 'FPS Stability > Everything',
    expectedStrategy: 'STABILITY_FIRST',
    description: 'Prioritizes jitter elimination and locked 60 FPS pacing regardless of battery or heat.',
    dna: {
      competitivePriority: 0.94,
      thermalSensitivity: 0.58,
      batteryPriority: 0.28,
      networkSensitivity: 0.88,
      preferredSessionLength: 2700,
      workloadPreferences: {
        COMPETITIVE: 0.92,
        CASUAL: 0.25,
        RANKED: 0.95,
        STREAMING: 0.55,
        TRAINING: 0.60,
        EDITING: 0.40,
        MULTITASKING: 0.45,
      },
      totalSessions: 18,
      totalAdaptations: 34,
    },
  },
  PROFILE_B: {
    id: 'PROFILE_B',
    name: 'ENDURANCE USER (SAI / MONISH)',
    tagline: 'Skin Comfort & Battery > Peak FPS',
    expectedStrategy: 'THERMAL_BALANCE',
    description: 'Prioritizes comfortable device temperature and battery longevity over unconstrained frames.',
    dna: {
      competitivePriority: 0.35,
      thermalSensitivity: 0.88,
      batteryPriority: 0.85,
      networkSensitivity: 0.45,
      preferredSessionLength: 1500,
      workloadPreferences: {
        COMPETITIVE: 0.30,
        CASUAL: 0.85,
        RANKED: 0.25,
        STREAMING: 0.70,
        TRAINING: 0.75,
        EDITING: 0.50,
        MULTITASKING: 0.80,
      },
      totalSessions: 12,
      totalAdaptations: 20,
    },
  },
  PROFILE_COMPETITIVE: {
    id: 'PROFILE_COMPETITIVE',
    name: 'COMPETITIVE PERFORMANCE (iQOO PRIORITY)',
    tagline: '1. Responsiveness · 2. Frame Consistency · 3. Network',
    expectedStrategy: 'STABILITY_FIRST',
    description: 'iQOO engineered gaming profile. Prioritizes: 1. responsiveness, 2. frame consistency, 3. network consistency, 4. thermal sustainability, 5. battery. Balances sustained cadence over short-burst peak throttling.',
    dna: {
      competitivePriority: 0.96,
      thermalSensitivity: 0.72,
      batteryPriority: 0.40,
      networkSensitivity: 0.94,
      preferredSessionLength: 3600,
      workloadPreferences: {
        COMPETITIVE: 0.98,
        CASUAL: 0.30,
        RANKED: 0.99,
        STREAMING: 0.65,
        TRAINING: 0.70,
        EDITING: 0.30,
        MULTITASKING: 0.40,
      },
      totalSessions: 26,
      totalAdaptations: 42,
    },
  },
};

// ── 6. Prediction Accuracy History & Learning Curve ───────

export const HISTORICAL_PREDICTION_RECORDS: PredictionAccuracyRecord[] = [
  {
    id: 'rec_01',
    prediction: 'Thermal degradation likely',
    predictedTime: '03:12',
    observedTime: '03:05',
    accuracy: 96,
    leadTimeSeconds: 192,
  },
  {
    id: 'rec_02',
    prediction: 'Performance instability likely',
    predictedTime: '02:48',
    observedTime: '02:39',
    accuracy: 95,
    leadTimeSeconds: 168,
  },
  {
    id: 'rec_03',
    prediction: 'Network jitter risk likely',
    predictedTime: '01:40',
    observedTime: '01:47',
    accuracy: 93,
    leadTimeSeconds: 100,
  },
  {
    id: 'rec_04',
    prediction: 'Frame variance escalation likely',
    predictedTime: '02:15',
    observedTime: '02:24',
    accuracy: 93,
    leadTimeSeconds: 135,
  },
];

export const SIMULATED_LEARNING_CURVE: LearningCurvePoint[] = [
  { sessionNumber: 1, accuracy: 71, status: 'Baseline profiling' },
  { sessionNumber: 2, accuracy: 78, status: 'Slope curve calibration' },
  { sessionNumber: 3, accuracy: 84, status: 'Variance threshold locked' },
  { sessionNumber: 4, accuracy: 89, status: 'Preemptive pacing confirmed' },
  { sessionNumber: 5, accuracy: 92, status: 'Closed-loop autonomous' },
];
