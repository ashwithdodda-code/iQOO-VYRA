import { Sparkles, Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { TimeToInterventionCard } from '../components/TimeToInterventionCard';
import { AdvantageDemoRunner } from '../components/AdvantageDemoRunner';
import { CoreABComparison } from '../components/CoreABComparison';
import { PredictiveAdvantageGraph } from '../components/PredictiveAdvantageGraph';
import { PersonalizationProofCard } from '../components/PersonalizationProofCard';
import { WhyVyraIsDifferentPanel } from '../components/WhyVyraIsDifferentPanel';
import { ModeToIntelligenceGraphic } from '../components/ModeToIntelligenceGraphic';
import { EngineeringTracePanel } from '../components/EngineeringTracePanel';
import { CostOfWaitingCard } from '../components/CostOfWaitingCard';
import { GamerFirstSummary } from '../components/GamerFirstSummary';

export function AdvantagePage() {

  return (
    <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
      <div className="animate-fade-in max-w-md mx-auto space-y-6">
        {/* ── 1. Header & Positioning (Requirement 1 & 13) ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-vyra-gold" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.3em] text-vyra-gold font-display font-medium uppercase">
                PROOF &amp; DIFFERENTIATION
              </span>
            </div>
            <span className="text-[8px] font-mono text-neutral-400 bg-vyra-dark px-2 py-0.5 rounded border border-vyra-border">
              HACKATHON EVALUATION
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white leading-tight tracking-tight mb-1.5">
            VYRA ADVANTAGE
          </h1>
          <p className="text-sm font-display font-semibold text-[#E5C973] mb-1">
            See what changes when your iQOO learns how you play.
          </p>
          <p className="text-xs text-vyra-muted font-body leading-relaxed">
            Instead of asking users to learn how to tune a performance phone, VYRA makes the phone learn how they need it to perform.
          </p>
        </div>

        {/* ── Core Contrast Banner (Requirement 1) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-lg bg-[#140C0C] border border-rose-950/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold text-rose-400">
              <TrendingDown size={14} />
              <span>WITHOUT VYRA</span>
            </div>
            <div className="text-[10px] font-mono text-rose-300 font-semibold uppercase">
              Reactive / Manual Management
            </div>
            <p className="text-[11px] text-neutral-400 font-body leading-snug">
              Fixed system profiles wait for thermal throttling to trigger emergency clock cuts, causing abrupt late-game frame hitching.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#17130A] border border-vyra-gold/60 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold text-[#E5C973]">
              <TrendingUp size={14} className="text-vyra-gold" />
              <span>WITH VYRA</span>
            </div>
            <div className="text-[10px] font-mono text-vyra-gold font-semibold uppercase">
              Predictive + Personalized Intelligence
            </div>
            <p className="text-[11px] text-neutral-300 font-body leading-snug">
              Anticipates thermal saturation 15 seconds early based on your Player DNA, micro-pacing output to sustain flatline 120 FPS.
            </p>
          </div>
        </div>

        {/* ── 2. Hero Metric: TIME-TO-INTERVENTION (Requirement 9) ── */}
        <TimeToInterventionCard />

        {/* ── 3. Automated Judge Demo Console (Requirement 11) ── */}
        <AdvantageDemoRunner />

        {/* ── 4. Core A/B Performance Simulation (Requirement 2) ── */}
        <CoreABComparison />

        {/* ── 5. Predictive Advantage Timeline Graph (Requirement 3) ── */}
        <PredictiveAdvantageGraph />

        {/* ── 6. Personalization Proof: Same Conditions, Different Decision (Requirement 4) ── */}
        <PersonalizationProofCard />

        {/* ── 7. Why VYRA Is Different Technical Panel (Requirement 5) ── */}
        <WhyVyraIsDifferentPanel />

        {/* ── 8. Paradigm Evolution Graphic (Requirement 6) ── */}
        <ModeToIntelligenceGraphic />

        {/* ── 9. Real Engineering Trace Panel (Requirement 7) ── */}
        <EngineeringTracePanel />

        {/* ── 10. The Cost of Waiting / Counterfactual Proof (Requirement 8) ── */}
        <CostOfWaitingCard />

        {/* ── 11. Gamer-First Summary & Final Anthem (Requirement 10 & 13) ── */}
        <GamerFirstSummary />

        {/* ── 12. Technical Honesty & Transparency Notice (Requirement 12) ── */}
        <div className="p-3 rounded bg-black/40 border border-vyra-border/60 text-center text-[10px] font-mono text-neutral-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-neutral-300 font-semibold">
            <Shield size={11} className="text-vyra-gold" />
            <span>ARCHITECTURAL TRANSPARENCY</span>
          </div>
          <p className="font-body text-neutral-400 leading-snug">
            Low-level hardware knobs are rendered via high-fidelity on-device simulation (<span className="text-vyra-gold">Prototype Simulation</span>). Production implementation targets direct kernel sysfs nodes and OriginOS Game Space HAL (<span className="text-[#E5C973]">Production Integration Target</span>).
          </p>
        </div>
      </div>
    </div>
  );
}
