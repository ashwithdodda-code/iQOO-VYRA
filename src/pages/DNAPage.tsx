import { useVYRA } from '../hooks/useVYRA';
import { PersonalizationComparisonCard } from '../components/PersonalizationComparisonCard';
import { LearningDeltaCard } from '../components/LearningDeltaCard';
import { Dna, RefreshCw, Brain, UserCheck } from 'lucide-react';

const levelColor = (level: string) => {
  if (level === 'HIGH' || level === 'LOW JITTER' || level === 'EARLY') return 'text-[#C8A84E]';
  if (level === 'MEDIUM' || level === 'BALANCED') return 'text-neutral-200';
  return 'text-neutral-400';
};

const levelBarWidth = (score: number) =>
  `${Math.min(100, Math.max(8, Math.round(score * 100)))}%`;

export function DNAPage() {
  const { state, resetToDemo, setProfilePreset } = useVYRA();
  const dna = state.performanceDNA;
  const effectiveness = state.strategyEffectiveness;

  // 6 Defined Traits according to Step 9 Requirement 6
  const sixTraits = [
    {
      id: 'thermal',
      label: 'THERMAL SENSITIVITY',
      level: 'HIGH (38.5°C)',
      score: dna.thermalSensitivity?.score ?? 0.88,
      sub: 'Proactive throttle ceiling margin before thermal ramp',
      tag: 'Core Limit'
    },
    {
      id: 'jitter',
      label: 'JITTER TOLERANCE',
      level: 'LOW JITTER (98%+)',
      score: dna.competitivePriority?.score ?? 0.92,
      sub: 'Zero tolerance for frame micro-stutters in active combat',
      tag: 'Competitive'
    },
    {
      id: 'battery',
      label: 'BATTERY TRADEOFF WILLINGNESS',
      level: 'MODERATE (0.35)',
      score: dna.batteryPriority?.score ?? 0.35,
      sub: 'Willing to consume additional power to maintain flatline 120 FPS',
      tag: 'Tradeoff'
    },
    {
      id: 'recovery',
      label: 'RECOVERY AGGRESSION',
      level: 'AGGRESSIVE (8s)',
      score: 0.82,
      sub: 'Rapid clock restoration within 8 seconds of thermal clearance',
      tag: 'Adaptive'
    },
    {
      id: 'workload',
      label: 'WORKLOAD PREFERENCE',
      level: 'COMPETITIVE GAMING',
      score: 0.85,
      sub: 'Prioritizes sustained 90/120 FPS competitive titles over casual apps',
      tag: 'Domain'
    },
    {
      id: 'preemptive',
      label: 'PREEMPTIVE BIAS',
      level: 'EARLY (15–30s)',
      score: 0.89,
      sub: 'Intervenes 15–30 seconds before degradation reaches user perception',
      tag: 'Anticipatory'
    },
  ];

  // Learning Memory structured records
  const memoryRecords = [
    {
      label: 'YOUR WORKLOAD',
      value: 'Competitive sessions are your most performance-sensitive workload.',
      sub: 'Based on 85% competitive gaming frequency across logged sessions',
    },
    {
      label: 'YOUR PRIORITY',
      value: 'You consistently prefer frame stability over battery savings.',
      sub: '0.92 frame consistency score vs 0.35 battery priority',
    },
    {
      label: 'YOUR THERMAL PATTERN',
      value: 'Performance risk increases after sustained high GPU workload.',
      sub: 'Thermal climb steepens past 37.0°C during extended competitive sessions',
    },
    {
      label: 'YOUR PREEMPTIVE RESPONSE',
      value: 'Early 5% GPU pacing prevents 85% of thermal throttling events.',
      sub: 'Zero perceptible frame drop verified across 24 historical sessions',
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#0A0A0A] text-[#FAFAFA] px-4 sm:px-5 pt-10 md:pt-8">
      <div className="animate-fade-in max-w-md mx-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dna size={16} className="text-[#C8A84E]" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] text-[#C8A84E] font-display font-medium uppercase">
              PERFORMANCE DNA
            </span>
          </div>
          <button
            onClick={resetToDemo}
            title="Recalibrate to baseline"
            className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded bg-neutral-900 border border-neutral-800 transition-colors"
          >
            <RefreshCw size={10} />
            <span>RECALIBRATE</span>
          </button>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1">
            PERSONAL<br />PERFORMANCE DNA
          </h1>
          <p className="text-xs text-neutral-400 font-body leading-relaxed">
            VYRA continuously learns what performance means for you from every session.
          </p>
        </div>

        {/* ── CORE PRODUCT STATEMENT BANNER (Step 9 Requirement 6) ── */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#221A0C] via-[#2D220F] to-[#221A0C] border border-[#C8A84E]/70 shadow-lg shadow-[#C8A84E]/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#E5C973] uppercase tracking-wider font-semibold">
            <UserCheck size={12} className="text-[#C8A84E]" />
            <span>PERSONALIZATION PHILOSOPHY</span>
          </div>
          <div className="text-xs sm:text-sm font-display font-bold text-white leading-snug">
            &ldquo;VYRA does not optimize for an average user.<br />
            <span className="text-[#E5C973]">VYRA optimizes for this user.</span>&rdquo;
          </div>
          <p className="text-[10px] text-neutral-400 font-body leading-tight pt-0.5">
            Static modes impose fixed global thresholds. VYRA models individual thermal tolerance, jitter sensitivity, and gameplay priorities.
          </p>
        </div>

        {/* ── DNA CONFIDENCE & SESSIONS STATS (Step 9 Requirement 6) ── */}
        <div className="grid grid-cols-3 gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-center font-mono">
          <div>
            <div className="text-[8px] text-neutral-400 tracking-wider uppercase">DNA CONFIDENCE</div>
            <div className="text-sm font-bold text-[#E5C973] mt-0.5">
              88%
            </div>
            <div className="text-[7.5px] text-emerald-400 mt-0.5 font-medium">HIGH CERTAINTY</div>
          </div>
          <div>
            <div className="text-[8px] text-neutral-400 tracking-wider uppercase">SESSIONS LEARNED</div>
            <div className="text-sm font-bold text-white mt-0.5">
              24
            </div>
            <div className="text-[7.5px] text-neutral-400 mt-0.5">LOGGED &amp; VERIFIED</div>
          </div>
          <div>
            <div className="text-[8px] text-neutral-400 tracking-wider uppercase">LOCAL INFERENCE</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              &lt;0.2ms
            </div>
            <div className="text-[7.5px] text-neutral-400 mt-0.5">100% ON-DEVICE</div>
          </div>
        </div>

        {/* Profile Preset Switcher (Step 4 Comparison) */}
        <PersonalizationComparisonCard
          activePreset={state.activeProfilePreset}
          onSelectPreset={setProfilePreset}
        />

        {/* ── 6 TRAITS OF PERFORMANCE DNA (Step 9 Requirement 6) ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] tracking-[0.2em] text-[#C8A84E] font-display font-semibold uppercase">
              6 CORE TRAITS
            </div>
            <span className="text-[8px] font-mono text-neutral-400">
              ADAPTIVE WEIGHTINGS
            </span>
          </div>

          {sixTraits.map((trait) => (
            <div
              key={trait.id}
              className="bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 rounded-lg p-3 space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-display font-semibold text-white tracking-wide">
                    {trait.label}
                  </span>
                  <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                    {trait.tag}
                  </span>
                </div>
                <span className={`font-mono text-xs font-bold ${levelColor(trait.level)}`}>
                  {trait.level}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C8A84E] to-[#E5C973] rounded-full transition-all duration-700 ease-out"
                  style={{ width: levelBarWidth(trait.score) }}
                />
              </div>

              <div className="text-[9px] text-neutral-400 font-body">
                {trait.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── LEARNING DELTA INDICATOR (Step 9 Requirement 7) ── */}
        <LearningDeltaCard />

        {/* ── VYRA MEMORY & HISTORICAL LEARNED RECORDS ── */}
        <div className="bg-neutral-950 border border-[#3E2F13] rounded-xl p-4 space-y-3.5">
          <div className="flex items-center gap-2">
            <Brain size={15} className="text-[#C8A84E]" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.2em] text-[#C8A84E] font-display font-semibold uppercase">
              PERSISTENT ON-DEVICE MEMORY
            </span>
          </div>

          <div className="space-y-2.5">
            {memoryRecords.map((m) => (
              <div key={m.label} className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-1">
                <div className="text-[8px] font-mono text-[#E5C973] tracking-wider uppercase font-semibold">
                  {m.label}
                </div>
                <div className="text-xs text-neutral-200 font-body font-medium leading-relaxed">
                  &ldquo;{m.value}&rdquo;
                </div>
                <div className="text-[9px] text-neutral-400 font-mono">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Effectiveness in Memory */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase mb-2">
              VERIFIED STRATEGY EFFECTIVENESS IN MEMORY
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {effectiveness.slice(0, 3).map((eff) => {
                const passRate = Math.round(
                  (eff.successes / Math.max(1, eff.uses)) * 100
                );
                return (
                  <div
                    key={eff.strategyId}
                    className="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800/70"
                  >
                    <span className="text-white text-[11px] font-medium">
                      {eff.strategyId.replace(/_/g, ' ')}
                    </span>
                    <span className="text-emerald-400 font-bold text-xs">
                      {passRate}% effective ({eff.successes}/{eff.uses})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
