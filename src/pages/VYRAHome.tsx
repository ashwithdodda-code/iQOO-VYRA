import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVYRA } from '../hooks/useVYRA';
import { JudgeFriendlyStatus } from '../components/JudgeFriendlyStatus';
import { UpgradedPredictionCard } from '../components/UpgradedPredictionCard';
import { VyraActedBanner } from '../components/VyraActedBanner';
import { ThirtySecondJudgeFlow } from '../components/ThirtySecondJudgeFlow';
import { TelemetryCard } from '../components/TelemetryCard';
import { DNAPreview } from '../components/DNAPreview';
import { WhyItMattersToIQOO } from '../components/WhyItMattersToIQOO';
import { PrototypeArchitectureModal } from '../components/PrototypeArchitectureModal';
import { LiveDeviceConnectBar } from '../components/LiveDeviceConnectBar';
import {
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  ArrowRight,
  Eye,
  Zap
} from 'lucide-react';

export function VYRAHome() {
  const navigate = useNavigate();
  const {
    state,
    startSession,
    resetToDemo
  } = useVYRA();

  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [judgeDemoTrigger, setJudgeDemoTrigger] = useState(0);

  const handleStartVyra = () => {
    startSession('COMPETITIVE');
    setTimeout(() => navigate('/session'), 350);
  };

  const handleRunJudgeDemo = () => {
    // Increment trigger to start the ThirtySecondJudgeFlow
    setJudgeDemoTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#0A0A0A] text-[#FAFAFA]">
      <div className="px-4 sm:px-5 pt-10 pb-6 md:pt-8 max-w-md mx-auto space-y-5">
        
        {/* ── 1. PRODUCT ENTRY EXPERIENCE (Step 9 Requirement 1) ── */}
        <header className="space-y-4 animate-fade-in">
          {/* Top Bar with Brand & Reset */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-[#C8A84E] font-display font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A84E] animate-pulse" />
              <span>iQOO VYRA</span>
            </div>
            <button
              onClick={resetToDemo}
              title="Reset to default demo state"
              className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <RotateCcw size={10} />
              <span>RESET DEMO</span>
            </button>
          </div>

          {/* Product Title & Subtitle */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.15]">
              PERSONAL<br />
              PERFORMANCE<br />
              <span className="text-[#E5C973]">INTELLIGENCE</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-body font-medium mt-2 italic">
              &ldquo;Performance that learns you.&rdquo;
            </p>
            <p className="text-[11px] text-neutral-400 font-body mt-0.5 leading-snug">
              Transforming static hardware profiles into an autonomous, predictive intelligence layer built for iQOO.
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleStartVyra}
              className="bg-gradient-to-r from-[#C8A84E] via-[#E2C36D] to-[#C8A84E] hover:scale-[1.01] active:scale-[0.99] text-black font-display text-xs font-bold tracking-wider py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-[#C8A84E]/20 transition-all"
            >
              <Play size={14} className="fill-black" />
              <span>START VYRA</span>
            </button>

            <button
              onClick={handleRunJudgeDemo}
              className="bg-[#14120C] hover:bg-[#1C180E] border border-[#C8A84E]/60 text-[#E5C973] hover:text-white font-display text-xs font-semibold tracking-wider py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Zap size={13} className="text-[#C8A84E]" />
              <span>RUN JUDGE DEMO</span>
            </button>
          </div>

          {/* 3 Compact Live States (Predict, Adapt, Learn) */}
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
            <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-center flex flex-col justify-between">
              <div className="text-[9px] font-mono font-bold text-[#E5C973] uppercase tracking-wider">
                PREDICT
              </div>
              <p className="text-[9px] text-neutral-400 font-body mt-1 leading-tight">
                Detect what may happen next
              </p>
            </div>

            <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-center flex flex-col justify-between">
              <div className="text-[9px] font-mono font-bold text-[#C8A84E] uppercase tracking-wider">
                ADAPT
              </div>
              <p className="text-[9px] text-neutral-400 font-body mt-1 leading-tight">
                Choose what matters to you
              </p>
            </div>

            <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-center flex flex-col justify-between">
              <div className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                LEARN
              </div>
              <p className="text-[9px] text-neutral-400 font-body mt-1 leading-tight">
                Improve from every session
              </p>
            </div>
          </div>

          {/* 100% On-Device Trust Badge */}
          <div className="px-2.5 py-1.5 rounded-md bg-black/60 border border-neutral-800/90 flex items-center justify-between text-[9px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Shield size={11} />
              <span>100% ON-DEVICE INTELLIGENCE</span>
            </div>
            <span className="text-neutral-400">0 CLOUD APIS · &lt;0.2ms LOCAL</span>
          </div>
        </header>

        {/* ── LIVE iQOO DEVICE TELEMETRY INGESTION ── */}
        <section>
          <LiveDeviceConnectBar />
        </section>

        {/* ── 2. DOMINANT SYSTEM STATUS BEACON (Step 9 Requirement 2 & 3 Hierarchy #1) ── */}
        <section>
          <JudgeFriendlyStatus />
        </section>

        {/* ── 3. 30-SECOND JUDGE PROOF FLOW (Step 9 Requirement 9) ── */}
        <section>
          <ThirtySecondJudgeFlow autoStartTrigger={judgeDemoTrigger} />
        </section>

        {/* ── 4. UPGRADED PREDICTION CARD (Step 9 Requirement 3 & 4 Hierarchy #2) ── */}
        <section>
          <UpgradedPredictionCard />
        </section>

        {/* ── 5. PREEMPTIVE ACTION & VERIFIED OUTCOME NOTIFICATION (Step 9 Requirement 5 Hierarchy #3) ── */}
        <section>
          <VyraActedBanner />
        </section>

        {/* ── 6. CURRENT DEVICE STATE TELEMETRY (Step 9 Requirement 3 Hierarchy #4) ── */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[9px] tracking-[0.2em] text-neutral-400 font-body uppercase font-medium">
              CURRENT DEVICE TELEMETRY
            </div>
            <span className="text-[9px] font-mono text-[#C8A84E]/90 bg-[#C8A84E]/10 px-1.5 py-0.5 rounded">
              High-Precision Polling
            </span>
          </div>
          <TelemetryCard telemetry={state.currentTelemetry} />
        </section>

        {/* ── 7. VYRA ADVANTAGE PROOF GATEWAY (Step 8 Integration) ── */}
        <section className="bg-gradient-to-r from-[#1C160B] via-[#120F08] to-black border border-[#C8A84E]/60 rounded-xl p-4 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-[#C8A84E] font-semibold">
              <Sparkles size={13} className="text-[#C8A84E]" />
              <span>PROOF &amp; DIFFERENTIATION</span>
            </div>
            <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#C8A84E]/20 text-[#E5C973] font-bold">
              STEP 8 &amp; 9
            </span>
          </div>

          <div>
            <div className="text-sm font-display font-bold text-white tracking-tight">
              VYRA ADVANTAGE
            </div>
            <div className="text-xs text-[#E5C973] font-body font-medium mt-0.5">
              See what changes when your iQOO learns how you play.
            </div>
            <p className="text-[11px] text-neutral-400 font-body mt-1 leading-snug">
              Compare conventional reactive modes against VYRA&apos;s predictive A/B simulation, 15s early intervention, and personalization proof.
            </p>
          </div>

          <button
            onClick={() => navigate('/advantage')}
            className="w-full bg-[#C8A84E] hover:bg-[#E5C973] active:scale-[0.99] text-black font-display text-xs font-bold tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C8A84E]/15"
          >
            <span>VIEW COMPLETE ADVANTAGE PROOF</span>
            <ArrowRight size={13} />
          </button>
        </section>

        {/* ── 8. PERSONAL PERFORMANCE DNA PREVIEW (Step 9 Requirement 3 Hierarchy #5) ── */}
        <section className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="text-[10px] tracking-[0.2em] text-[#C8A84E] font-display font-semibold uppercase">
              PERSONAL PERFORMANCE DNA
            </div>
            <button
              onClick={() => navigate('/dna')}
              className="text-[9px] font-mono text-neutral-400 hover:text-[#C8A84E] flex items-center gap-1 transition-colors"
            >
              <span>VIEW 6 TRAITS</span>
              <ArrowRight size={10} />
            </button>
          </div>
          <DNAPreview dna={state.performanceDNA} />
        </section>

        {/* ── 9. WHY iQOO VYRA? PRODUCT PANEL (Step 9 Requirement 8 & Requirement 3 Hierarchy #6) ── */}
        <section>
          <WhyItMattersToIQOO />
        </section>

        {/* ── 10. PROTOTYPE ARCHITECTURE & TECHNICAL HONESTY (Step 9 Requirement 13) ── */}
        <section className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-display font-bold text-white">
              Prototype Technical Architecture
            </div>
            <div className="text-[10px] text-neutral-400 font-body">
              8-stage on-device pipeline · Implemented vs Target
            </div>
          </div>
          <button
            onClick={() => setShowArchitectureModal(true)}
            className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 hover:border-[#C8A84E] text-[#E5C973] hover:text-white text-[10px] font-mono flex items-center gap-1.5 transition-all"
          >
            <Eye size={11} />
            <span>INSPECT</span>
          </button>
        </section>

        {/* ── 11. FINAL PRODUCT STATEMENT ANTHEM (Step 9 Requirement 15) ── */}
        <footer className="p-4 rounded-xl bg-gradient-to-r from-[#1C160B] via-[#2A200E] to-[#1C160B] border border-[#C8A84E]/70 text-center shadow-lg shadow-[#C8A84E]/10 space-y-2 animate-fade-in">
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#C8A84E] uppercase font-bold">
            iQOO VYRA
          </div>
          <div className="text-xs sm:text-sm text-neutral-200 font-display font-semibold italic">
            &ldquo;From performance modes to personal performance intelligence.&rdquo;
          </div>
          <p className="text-[11px] text-neutral-300 font-body leading-relaxed max-w-xs mx-auto">
            &ldquo;Your device should not only know what it can do. It should learn how you need it to perform.&rdquo;
          </p>
          <div className="pt-1 border-t border-[#3E2F13]">
            <div className="text-xs sm:text-sm font-display font-extrabold text-white tracking-widest uppercase">
              YOUR iQOO LEARNS HOW YOU PLAY.
            </div>
          </div>
        </footer>

      </div>

      {/* Technical Architecture Modal */}
      <PrototypeArchitectureModal
        isOpen={showArchitectureModal}
        onClose={() => setShowArchitectureModal(false)}
      />
    </div>
  );
}
