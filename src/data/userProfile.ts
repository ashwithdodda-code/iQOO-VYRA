import {
  UserDNA,
  PerformanceDNA,
  PriorityLevel,
  Session,
  StrategyEffectiveness,
  STORAGE_KEYS,
} from '../types';

// Default User DNA baseline (representing an enthusiast performance user)
export const defaultUserDNA: UserDNA = {
  competitivePriority: 0.92, // 92% competitive focus
  thermalSensitivity: 0.65,  // medium-high sensitivity to heat
  batteryPriority: 0.30,     // low battery concern during gaming
  networkSensitivity: 0.85,  // very sensitive to network spikes/jitter
  preferredSessionLength: 2400, // 40 minutes
  workloadPreferences: {
    COMPETITIVE: 0.85,
    CASUAL: 0.35,
    RANKED: 0.90,
    STREAMING: 0.50,
    TRAINING: 0.60,
    EDITING: 0.40,
    MULTITASKING: 0.45,
  },
  totalSessions: 14,
  totalAdaptations: 28,
};

// Map 0-1 numeric score to PriorityLevel
export function scoreToLevel(score: number): PriorityLevel {
  if (score >= 0.70) return 'HIGH';
  if (score >= 0.40) return 'MEDIUM';
  return 'LOW';
}

// Dynamically compute PerformanceDNA view model from UserDNA and session history
export function computePerformanceDNA(
  dna: UserDNA,
  sessions: Session[]
): PerformanceDNA {
  const compLevel = scoreToLevel(dna.competitivePriority);
  const thermLevel = scoreToLevel(dna.thermalSensitivity);
  const battLevel = scoreToLevel(dna.batteryPriority);
  const netLevel = scoreToLevel(dna.networkSensitivity);

  // Determine session pattern label from history
  let patternLabel = 'Extended competitive sessions';
  let patternScore = 0.82;

  if (sessions.length > 0) {
    const avgDuration =
      sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
    const competitiveCount = sessions.filter(
      (s) => s.workload === 'COMPETITIVE'
    ).length;
    const compRatio = competitiveCount / sessions.length;

    if (compRatio > 0.6 && avgDuration > 1200) {
      patternLabel = 'Extended competitive sessions';
      patternScore = Math.min(0.95, 0.7 + compRatio * 0.25);
    } else if (compRatio > 0.4) {
      patternLabel = 'Balanced competitive & casual';
      patternScore = 0.68;
    } else {
      patternLabel = 'Short-burst high efficiency';
      patternScore = 0.55;
    }
  }

  // Dynamically generate learned insights based on actual stored DNA and history
  const insights = generateDNAInsights(dna, sessions);

  return {
    competitivePriority: {
      level: compLevel,
      score: Math.round(dna.competitivePriority * 100) / 100,
    },
    thermalSensitivity: {
      level: thermLevel,
      score: Math.round(dna.thermalSensitivity * 100) / 100,
    },
    batteryPriority: {
      level: battLevel,
      score: Math.round(dna.batteryPriority * 100) / 100,
    },
    networkSensitivity: {
      level: netLevel,
      score: Math.round(dna.networkSensitivity * 100) / 100,
    },
    sessionPattern: {
      label: patternLabel,
      score: patternScore,
    },
    insights,
  };
}

// Generate dynamic, explainable statements from the DNA metrics and history
export function generateDNAInsights(
  dna: UserDNA,
  sessions: Session[]
): string[] {
  const insights: string[] = [];

  // Insight 1: Competitive priority
  if (dna.competitivePriority >= 0.75) {
    insights.push(
      'Long competitive sessions are your highest-priority workload.'
    );
  } else if (dna.competitivePriority >= 0.45) {
    insights.push(
      'Competitive workloads receive balanced resource allocation.'
    );
  } else {
    insights.push(
      'Efficiency and endurance take precedence over peak throughput.'
    );
  }

  // Insight 2: Network sensitivity
  if (dna.networkSensitivity >= 0.75) {
    insights.push('You are sensitive to network instability and jitter.');
  } else if (dna.networkSensitivity >= 0.45) {
    insights.push('Standard packet variance tolerance observed.');
  }

  // Insight 3: Performance vs battery priority
  if (dna.competitivePriority > dna.batteryPriority + 0.3) {
    insights.push('Performance consistency matters more than battery conservation.');
  } else if (dna.batteryPriority > dna.competitivePriority) {
    insights.push('Battery efficiency is prioritized over unconstrained FPS.');
  } else {
    insights.push('Dynamic thermal-battery balance applied across sessions.');
  }

  // Insight 4: Thermal behavior from sessions
  if (sessions.length > 0) {
    const highThermalSessions = sessions.filter((s) => s.averageThermal > 36.5);
    if (highThermalSessions.length / sessions.length > 0.4) {
      insights.push(
        'Thermal rise during sustained workloads follows a steep initial curve.'
      );
    } else {
      insights.push(
        'Thermal dissipation remains within optimal equilibrium.'
      );
    }
  } else {
    insights.push(
      'Thermal curve calibrated from baseline benchmark profiles.'
    );
  }

  // Insight 5: Adaptation success
  if (dna.totalAdaptations > 0) {
    insights.push(
      `Learned from ${dna.totalAdaptations} successful interventions across ${dna.totalSessions} sessions.`
    );
  }

  return insights;
}

// ── Persistence Helpers (Local-First) ────────────────────

export function loadUserDNA(): UserDNA {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_DNA);
    if (saved) {
      return { ...defaultUserDNA, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('[VYRA] Failed to load UserDNA from localStorage', e);
  }
  return { ...defaultUserDNA };
}

export function saveUserDNA(dna: UserDNA): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DNA, JSON.stringify(dna));
  } catch (e) {
    console.warn('[VYRA] Failed to save UserDNA to localStorage', e);
  }
}

export function loadSessionHistory(): Session[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[VYRA] Failed to load SessionHistory from localStorage', e);
  }
  return [];
}

export function saveSessionHistory(history: Session[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SESSION_HISTORY,
      JSON.stringify(history.slice(-20)) // keep last 20
    );
  } catch (e) {
    console.warn('[VYRA] Failed to save SessionHistory to localStorage', e);
  }
}

export function loadStrategyEffectiveness(): StrategyEffectiveness[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STRATEGY_EFFECTIVENESS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[VYRA] Failed to load StrategyEffectiveness', e);
  }
  return defaultStrategyEffectiveness;
}

export function saveStrategyEffectiveness(
  records: StrategyEffectiveness[]
): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.STRATEGY_EFFECTIVENESS,
      JSON.stringify(records)
    );
  } catch (e) {
    console.warn('[VYRA] Failed to save StrategyEffectiveness', e);
  }
}

export function loadLearningUpdates(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LEARNING_UPDATES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('[VYRA] Failed to load LearningUpdates', e);
  }
  return [
    'Competitive gaming pattern recognized: frame-pacing prioritized.',
    'Thermal rise curve calibrated from 14 previous sessions.',
    'Network sensitivity threshold adjusted: jitter > 8ms triggers early warning.',
    'Stability First strategy effectiveness verified at 89% confidence.',
  ];
}

export function saveLearningUpdates(updates: string[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LEARNING_UPDATES,
      JSON.stringify(updates.slice(0, 15))
    );
  } catch (e) {
    console.warn('[VYRA] Failed to save LearningUpdates', e);
  }
}

// Initial strategy effectiveness baseline
export const defaultStrategyEffectiveness: StrategyEffectiveness[] = [
  {
    strategyId: 'STABILITY_FIRST',
    workload: 'COMPETITIVE',
    uses: 12,
    successes: 11,
    averageImprovement: 19.4,
    lastUsed: Date.now() - 3600000 * 24,
  },
  {
    strategyId: 'THERMAL_BALANCE',
    workload: 'COMPETITIVE',
    uses: 8,
    successes: 7,
    averageImprovement: 15.2,
    lastUsed: Date.now() - 3600000 * 48,
  },
  {
    strategyId: 'NETWORK_PRIORITY',
    workload: 'COMPETITIVE',
    uses: 6,
    successes: 5,
    averageImprovement: 22.0,
    lastUsed: Date.now() - 3600000 * 72,
  },
  {
    strategyId: 'BATTERY_EFFICIENCY',
    workload: 'CASUAL',
    uses: 9,
    successes: 9,
    averageImprovement: 28.5,
    lastUsed: Date.now() - 3600000 * 12,
  },
];
