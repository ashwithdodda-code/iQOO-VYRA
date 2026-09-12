import {
  AdaptationDecision,
  CounterfactualComparison,
  DecisionTraceStep,
  PerformanceState,
  Prediction,
  Strategy,
  StrategyEffectiveness,
  StrategyId,
  UserDNA,
  UserIntent,
} from '../types';
import { STRATEGY_LIBRARY } from '../data/simulationData';
import { calculateCandidateStrategyScores } from './predictiveAdvantage';

/**
 * Selects the optimal performance strategy based on:
 * USER INTENT + PERSONAL PERFORMANCE DNA + CURRENT DEVICE STATE + WORKLOAD
 *
 * Constructs the 6-step Decision Trace and Counterfactual Simulation.
 */
export function selectAdaptationStrategy(
  prediction: Prediction,
  performanceState: PerformanceState,
  userDNA: UserDNA,
  effectivenessHistory: StrategyEffectiveness[],
  intent: UserIntent = 'MAXIMUM_STABILITY'
): AdaptationDecision | null {
  if (prediction.type === 'STABLE' && performanceState.riskScore < 20) {
    return null;
  }

  const { telemetry, workload, sessionDuration } = performanceState;
  let chosenId: StrategyId = 'STABILITY_FIRST';
  let prioritizedText = '';
  let expectedResult = 'Lower performance variance and stabilized frame dispatch';

  // ── Intent & Gaming-First Workload Strategy Selection (Step 7 Requirement 2) ──
  if (intent === 'LOWEST_LATENCY' || prediction.type === 'NETWORK_INSTABILITY') {
    chosenId = 'NETWORK_PRIORITY';
    prioritizedText =
      'Network Priority · Touch queue & real-time packet transmission prioritized ahead of background tasks';
    expectedResult = 'Reduced touch-to-photon latency and zero upstream packet backlog';
  } else if (prediction.type === 'INPUT_RESPONSIVENESS_RISK') {
    chosenId = 'STABILITY_FIRST';
    prioritizedText =
      'Input Responsiveness Pacing · Lock 300Hz touch-to-display synchronization and eliminate render queue jitter';
    expectedResult = 'Sub-18ms gesture latency with 99%+ touch registration consistency';
  } else if (intent === 'COOLER_DEVICE') {
    chosenId = 'THERMAL_BALANCE';
    prioritizedText =
      'User Intent: COOLER DEVICE · Skin comfort ceiling strictly enforced';
    expectedResult = 'Curbs thermal acceleration rate by -0.25°C/min';
  } else if (intent === 'LONGEST_BATTERY') {
    chosenId = 'BATTERY_EFFICIENCY';
    prioritizedText =
      'User Intent: LONGEST BATTERY · Power envelope capped to maximize screen-on time';
    expectedResult = '35% reduction in compute power draw with intelligent refresh pacing';
  } else if (intent === 'PEAK_PERFORMANCE') {
    chosenId = 'PEAK_PERFORMANCE';
    prioritizedText =
      'User Intent: PEAK PERFORMANCE · Unconstrained GPU/CPU burst clocks unlocked';
    expectedResult = 'Maximum rendering throughput for complex scene transitions';
  } else if (workload === 'RANKED' || workload === 'COMPETITIVE') {
    // Ranked & Competitive: User DNA determines whether to lock frame consistency or preserve thermal margin
    if (userDNA.competitivePriority >= 0.65) {
      chosenId = 'STABILITY_FIRST';
      prioritizedText =
        'Your Performance DNA (Competitive Priority): Frame Consistency & Responsiveness > Battery/Thermal trade-offs';
      expectedResult = 'Elimination of frame-time spikes and locked 60 FPS VRR presentation';
    } else {
      chosenId = 'THERMAL_BALANCE';
      prioritizedText =
        'Your Performance DNA (Thermal Sensitivity): Proactive thermal ceiling maintained before hardware throttle trip points';
      expectedResult = 'Dampens thermal slope while keeping frames within 95%+ stability window';
    }
  } else if (workload === 'CASUAL') {
    // Casual: Prioritize battery efficiency and thermal comfort
    if (telemetry.batteryLevel < 40 || userDNA.batteryPriority > 0.6) {
      chosenId = 'BATTERY_EFFICIENCY';
      prioritizedText =
        'Casual Workload: Battery efficiency & comfortable palm thermals prioritized over ultra-low latency';
      expectedResult = 'Extended battery runtime with balanced power delivery';
    } else {
      chosenId = 'BALANCED_PERFORMANCE';
      prioritizedText =
        'Casual Workload: Harmonized equilibrium between thermal climb, power, and frame rate';
      expectedResult = 'Stable 60 FPS delivery with sustainable passive dissipation';
    }
  } else if (workload === 'STREAMING') {
    // Streaming: Network consistency and encoder thermal headroom
    if (telemetry.networkStability !== 'HIGH') {
      chosenId = 'NETWORK_PRIORITY';
      prioritizedText =
        'Streaming Workload: Ingress/egress socket prioritization for uninterrupted video uplink';
      expectedResult = 'Zero packet dropouts during live broadcast encoding';
    } else {
      chosenId = 'THERMAL_BALANCE';
      prioritizedText =
        'Streaming Workload: Dedicated GPU encoder thermal headroom preservation';
      expectedResult = 'Prevents encoder frame slips during combined gaming and broadcast loads';
    }
  } else if (workload === 'TRAINING') {
    chosenId = 'BALANCED_PERFORMANCE';
    prioritizedText =
      'Training Workload: Steady frame pacing cadence and sustained thermal endurance';
    expectedResult = 'Predictable, repeatable telemetry profile for skill acquisition';
  } else {
    chosenId = 'BALANCED_PERFORMANCE';
    prioritizedText =
      'Harmonized equilibrium between thermal climb, power, and frame rate';
    expectedResult = 'Stable 60 FPS delivery with sustainable passive dissipation';
  }

  // Adjust confidence based on historical effectiveness
  const historicalRecord = effectivenessHistory.find(
    (h) => h.strategyId === chosenId && h.workload === workload
  );

  let confidenceScore = prediction.confidenceBreakdown?.overall || 91;
  if (historicalRecord && historicalRecord.uses > 2) {
    const successRate = (historicalRecord.successes / historicalRecord.uses) * 100;
    confidenceScore = Math.min(
      97,
      Math.round(confidenceScore * 0.7 + successRate * 0.3)
    );
  }

  const strategy: Strategy = STRATEGY_LIBRARY[chosenId];

  // ── Step 01-06 Engineering Decision Trace ───────────────────
  const durationMins = Math.max(1, Math.round(sessionDuration / 60));
  const decisionTrace: DecisionTraceStep[] = [
    {
      step: '01',
      label: 'Your workload',
      value: `${workload} (${durationMins} min session)`,
      detail: 'High continuous GPU utilization with low latency tolerance',
    },
    {
      step: '02',
      label: 'Your learned preference',
      value: `FPS CONSISTENCY > BATTERY (Intent: ${intent.replace('_', ' ')})`,
      detail: `DNA Competitive Score: ${Math.round(userDNA.competitivePriority * 100)}%`,
    },
    {
      step: '03',
      label: 'Current device state',
      value: `THERMAL RISE DETECTED (+${telemetry.thermalRateOfRise.toFixed(2)}°C/min, ${telemetry.thermalTemp.toFixed(1)}°C)`,
      detail: `Frame-time variance elevated at ${telemetry.frameTimeVariance.toFixed(1)}ms`,
    },
    {
      step: '04',
      label: 'Predicted outcome',
      value: `${prediction.message.toUpperCase()} IN ~${prediction.timeHorizon.replace('Next ', '')}`,
      detail: prediction.primaryCause,
    },
    {
      step: '05',
      label: 'Selected strategy',
      value: strategy.label,
      detail: strategy.description,
    },
    {
      step: '06',
      label: 'Expected result',
      value: expectedResult,
      detail: `Historical pass rate: ${historicalRecord ? Math.round((historicalRecord.successes / historicalRecord.uses) * 100) : 89}%`,
    },
  ];

  // ── Counterfactual Simulation ("WHAT IF VYRA DID NOTHING?") ───
  const withoutTemp = (telemetry.thermalTemp + 2.6).toFixed(1);
  const withTemp = (telemetry.thermalTemp + 0.8).toFixed(1);
  const withoutFps = Math.max(84, Math.round(telemetry.fpsStability - 7));
  const withFps = Math.min(98, Math.round(telemetry.fpsStability + 2));

  const counterfactual: CounterfactualComparison = {
    withoutVyra: {
      temperature: `${telemetry.thermalTemp.toFixed(1)}°C → ${withoutTemp}°C`,
      fpsStability: `${Math.round(telemetry.fpsStability)}% → ${withoutFps}%`,
      frameTimeVariance: `+31% (+${(telemetry.frameTimeVariance * 0.31).toFixed(1)}ms)`,
      riskOutcome: 'Skin threshold crossed; burst thermal throttling',
    },
    withVyra: {
      temperature: `${telemetry.thermalTemp.toFixed(1)}°C → ${withTemp}°C`,
      fpsStability: `${Math.round(telemetry.fpsStability)}% → ${withFps}%`,
      frameTimeVariance: `-14% (-${(telemetry.frameTimeVariance * 0.14).toFixed(1)}ms)`,
      riskOutcome: 'Zero throttling; frame delivery envelope protected',
    },
    simulatedDeltaText:
      'Prevents +31% frame jitter spike and limits thermal rise to +0.8°C instead of +2.6°C.',
  };

  const detected = [
    {
      label: 'Thermal rise',
      value: `${telemetry.thermalRateOfRise > 0 ? '+' : ''}${telemetry.thermalRateOfRise.toFixed(2)}°C/min (${telemetry.thermalTemp.toFixed(1)}°C)`,
    },
    {
      label: 'FPS stability',
      value: `${Math.round(telemetry.fpsStability)}% (variance ${telemetry.frameTimeVariance.toFixed(1)}ms)`,
    },
    {
      label: 'User intent',
      value: intent.replace('_', ' '),
    },
    {
      label: 'GPU workload',
      value: telemetry.gpuUsage > 75 ? 'High (80%+)' : 'Moderate',
    },
  ];

  const candidateScores = calculateCandidateStrategyScores(
    performanceState,
    telemetry,
    userDNA,
    intent,
    effectivenessHistory
  );

  return {
    id: `adapt_${Date.now()}`,
    timestamp: Date.now(),
    strategy,
    prediction,
    reasoning: {
      detected,
      predicted: `${prediction.message} within ${prediction.timeHorizon}`,
      prioritized: prioritizedText,
      confidence: confidenceScore,
    },
    decisionTrace,
    counterfactual,
    candidateScores,
    accepted: false,
  };
}

