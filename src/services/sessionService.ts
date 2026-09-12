import { Session, StrategyType, WorkloadType, Telemetry } from '../types';

let sessions: Session[] = [];
let activeSession: Session | null = null;

export const sessionService = {
  startSession(workload: WorkloadType = 'COMPETITIVE', strategy: StrategyType = 'MAINTAIN_STABILITY'): Session {
    const session: Session = {
      id: `ses_${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      workload,
      telemetryHistory: [],
      averageFps: 0,
      averageThermal: 0,
      batteryDrain: 0,
      verified: false,
      verificationResult: null,
      strategy,
    };
    activeSession = session;
    return session;
  },

  recordTelemetry(telemetry: Telemetry): void {
    if (!activeSession) return;
    activeSession.telemetryHistory.push({ ...telemetry });
    activeSession.duration = Math.floor((Date.now() - activeSession.startTime) / 1000);
    
    const history = activeSession.telemetryHistory;
    activeSession.averageFps = history.reduce((s, t) => s + t.fps, 0) / history.length;
    activeSession.averageThermal = history.reduce((s, t) => s + t.thermalTemp, 0) / history.length;
    
    if (history.length > 1) {
      activeSession.batteryDrain = history[0].batteryLevel - history[history.length - 1].batteryLevel;
    }
  },

  endSession(): Session | null {
    if (!activeSession) return null;
    activeSession.endTime = Date.now();
    activeSession.duration = Math.floor((activeSession.endTime - activeSession.startTime) / 1000);
    const completed = { ...activeSession };
    sessions.push(completed);
    activeSession = null;
    return completed;
  },

  getActive(): Session | null {
    return activeSession;
  },

  getHistory(): Session[] {
    return sessions;
  },

  loadHistory(history: Session[]): void {
    sessions = [...history];
  },
};
