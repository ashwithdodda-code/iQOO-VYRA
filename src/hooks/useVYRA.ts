import { useState, useEffect, useCallback } from 'react';
import { vyraEngine } from '../engine/vyraEngine';
import {
  DemoScenarioId,
  StrategyId,
  TimelineStepId,
  UserIntent,
  VerificationResult,
  VYRAState,
  WorkloadType,
} from '../types';

export function useVYRA() {
  const [state, setState] = useState<VYRAState>(vyraEngine.getState());

  useEffect(() => {
    const unsubscribe = vyraEngine.subscribe(setState);
    return unsubscribe;
  }, []);

  const startSession = useCallback(
    (
      workload: WorkloadType = 'COMPETITIVE',
      intent: UserIntent = state.currentIntent,
      scenarioId?: DemoScenarioId
    ) => {
      vyraEngine.startSession(workload, intent, scenarioId);
    },
    [state.currentIntent]
  );

  const setWorkload = useCallback((workload: WorkloadType) => {
    vyraEngine.setWorkload(workload);
  }, []);

  const setIntent = useCallback((intent: UserIntent) => {
    vyraEngine.setIntent(intent);
  }, []);

  const setTimelineStep = useCallback((step: TimelineStepId) => {
    vyraEngine.setTimelineStep(step);
  }, []);

  const setProfilePreset = useCallback((presetId: 'PROFILE_A' | 'PROFILE_B' | 'PROFILE_COMPETITIVE') => {
    vyraEngine.setProfilePreset(presetId);
  }, []);

  const applyAdaptation = useCallback((strategyId?: StrategyId) => {
    vyraEngine.applyAdaptation(strategyId);
  }, []);

  const endSession = useCallback((): VerificationResult | null => {
    return vyraEngine.endSession();
  }, []);

  const resetToDemo = useCallback(() => {
    vyraEngine.resetToDemo();
  }, []);

  const runDemoScenario = useCallback((speed: number = 1.0) => {
    vyraEngine.runScenario('THERMAL_RISE', speed);
  }, []);

  const runJudgeDemo = useCallback((speed: number = 2.0) => {
    vyraEngine.runJudgeDemo(speed);
  }, []);

  const runScenario = useCallback((scenarioId: DemoScenarioId, speed: number = 2.0) => {
    vyraEngine.runScenario(scenarioId, speed);
  }, []);

  const skipToDecision = useCallback(() => {
    vyraEngine.skipToDecision();
  }, []);

  const runLiveDemo = useCallback((scenarioId: DemoScenarioId = 'THERMAL_RISE', speed: number = 1.0) => {
    vyraEngine.runLiveDemo(scenarioId, speed);
  }, []);

  const replayLiveDemo = useCallback(() => {
    vyraEngine.replayLiveDemo();
  }, []);

  const stopLiveDemo = useCallback(() => {
    vyraEngine.stopLiveDemo();
  }, []);

  const setLiveDeviceMode = useCallback((enabled: boolean) => {
    vyraEngine.setLiveDeviceMode(enabled);
  }, []);

  const isLiveDeviceMode = useCallback(() => {
    return vyraEngine.isLiveDeviceMode();
  }, []);

  const getLiveDeviceStatus = useCallback(() => {
    return vyraEngine.getLiveDeviceStatus();
  }, []);

  return {
    state,
    startSession,
    setWorkload,
    setIntent,
    setTimelineStep,
    setProfilePreset,
    applyAdaptation,
    endSession,
    resetToDemo,
    runDemoScenario,
    runJudgeDemo,
    runScenario,
    skipToDecision,
    runLiveDemo,
    replayLiveDemo,
    stopLiveDemo,
    setLiveDeviceMode,
    isLiveDeviceMode,
    getLiveDeviceStatus,
    isSessionActive: state.currentSession !== null,
  };
}
