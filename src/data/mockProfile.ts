import { UserDNA, PerformanceDNA } from '../types';

export const mockUserDNA: UserDNA = {
  competitivePriority: 0.92,
  thermalSensitivity: 0.61,
  batteryPriority: 0.34,
  networkSensitivity: 0.87,
  preferredSessionLength: 2400,
  preferredPerformanceBehaviour: 'Frame consistency over peak FPS',
  typicalSessionDuration: 2400,
  workloadPreferences: {
    COMPETITIVE: 0.85,
    CASUAL: 0.1,
    RANKED: 0.8,
    STREAMING: 0.05,
    TRAINING: 0.0,
    EDITING: 0.0,
    MULTITASKING: 0.0,
  },
  totalSessions: 24,
  totalAdaptations: 28,
};

export const mockPerformanceDNA: PerformanceDNA = {
  competitivePriority: { level: 'HIGH', score: 0.92 },
  thermalSensitivity: { level: 'MEDIUM', score: 0.61 },
  batteryPriority: { level: 'LOW', score: 0.34 },
  networkSensitivity: { level: 'HIGH', score: 0.87 },
  sessionPattern: { label: 'Extended competitive sessions', score: 0.78 },
  insights: [
    'Long competitive sessions are your highest-priority workload.',
    'You are sensitive to network instability.',
    'Performance consistency matters more than peak FPS.',
    'Thermal rise during extended sessions follows a predictable curve.',
    'Battery optimization is secondary to frame stability in your usage.',
  ],
};
