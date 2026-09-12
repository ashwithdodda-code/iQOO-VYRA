import { useState } from 'react';
import { Play, FastForward, RotateCcw, Sparkles, Award } from 'lucide-react';
import { DemoScenarioId } from '../types';

interface Props {
  onRunDemo: (speed: number) => void;
  onRunJudgeDemo?: (speed: number) => void;
  onRunScenario?: (scenarioId: DemoScenarioId, speed: number) => void;
  activeScenario?: DemoScenarioId | null;
  onSkipToDecision: () => void;
  onReset: () => void;
  isSessionActive: boolean;
}

const SCENARIOS: { id: DemoScenarioId; label: string; tag: string }[] = [
  { id: 'NORMAL_GAMING', label: 'Normal Gaming', tag: 'Optimal Envelope' },
  { id: 'LONG_COMPETITIVE', label: 'Long Competitive', tag: '28m Thermal Soak' },
  { id: 'THERMAL_RISE', label: 'Thermal Rise', tag: '+0.42°C/min Climb' },
  { id: 'NETWORK_INSTABILITY', label: 'Network Jitter', tag: 'Packet Socket Lag' },
  { id: 'LOW_BATTERY', label: 'Low Battery', tag: '16% Power Hazard' },
  { id: 'PERFORMANCE_DEGRADATION', label: 'Perf Degradation', tag: 'Queue Stutter' },
];

export function DemoAutopilotControls({
  onRunDemo,
  onRunJudgeDemo,
  onRunScenario,
  activeScenario,
  onSkipToDecision,
  onReset,
  isSessionActive,
}: Props) {
  const [speed, setSpeed] = useState<number>(2.0); // Default to 2x for brisk judging presentation

  return (
    <div className="bg-vyra-surface border border-[#423315] rounded-md p-4 animate-fade-in relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            HACKATHON AUTOPILOT
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono">
          <span className="text-vyra-muted">SPEED:</span>
          {[1.0, 2.0, 4.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speed === s
                  ? 'bg-vyra-gold text-vyra-black font-bold'
                  : 'bg-vyra-dark text-vyra-muted hover:text-vyra-text'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-display font-semibold text-vyra-white mb-1">
        60-SECOND DEMO SCENARIOS (STEP 5)
      </div>
      <p className="text-[11px] text-vyra-muted font-body mb-3 leading-relaxed">
        Select a scenario to trigger the deterministic closed loop:
        <span className="text-neutral-300 font-mono text-[10px] block mt-0.5">
          LEARN → PREDICT → ADAPT → VERIFY → LEARN
        </span>
      </p>

      {/* Scenario Grid Selector (Requirement I) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
        {SCENARIOS.map((scen) => {
          const isActive = activeScenario === scen.id;
          return (
            <button
              key={scen.id}
              onClick={() => {
                if (onRunScenario) {
                  onRunScenario(scen.id, speed);
                } else if (onRunJudgeDemo) {
                  onRunJudgeDemo(speed);
                } else {
                  onRunDemo(speed);
                }
              }}
              className={`p-2 rounded border text-left transition-all ${
                isActive
                  ? 'bg-[#22170E] border-[#C8A84E] text-white shadow-sm ring-1 ring-[#C8A84E]/40'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
              }`}
            >
              <div className="text-[11px] font-display font-bold truncate">
                {scen.label}
              </div>
              <div className="text-[9px] font-mono text-neutral-400 truncate">
                {scen.tag}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Action Button Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        {/* Primary 60-Second Judge Demo */}
        <button
          onClick={() => {
            if (onRunJudgeDemo) {
              onRunJudgeDemo(speed);
            } else {
              onRunDemo(speed);
            }
          }}
          className="bg-[#C8A84E] hover:bg-[#D4B55E] text-black font-display text-xs font-bold tracking-wider py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md shadow-[#C8A84E]/10"
        >
          <Award size={14} className="text-black" />
          <span>60-SEC JUDGE DEMO</span>
        </button>

        {/* Regular Scenario Restart */}
        <button
          onClick={() => onRunDemo(speed)}
          className="bg-neutral-850 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-display text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <Play size={12} fill="currentColor" />
          <span>{isSessionActive ? 'RESTART CURRENT' : 'RUN CURRENT CYCLE'}</span>
        </button>
      </div>

      {/* Secondary Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSkipToDecision}
          title="Jump directly to degradation & adaptation recommendation"
          className="flex-1 bg-vyra-dark hover:bg-vyra-border border border-vyra-border text-vyra-text font-display text-xs font-medium py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <FastForward size={13} />
          <span>SKIP TO PREEMPTIVE DECISION</span>
        </button>

        <button
          onClick={onReset}
          title="Reset telemetry baseline"
          className="p-2 bg-vyra-dark hover:bg-vyra-border border border-vyra-border text-vyra-muted hover:text-vyra-text rounded transition-colors"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
