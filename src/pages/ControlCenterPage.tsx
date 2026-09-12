import { useNavigate } from 'react-router-dom';
import { useVYRA } from '../hooks/useVYRA';
import { evaluateControlDomains } from '../data/intentData';
import { IntentSelector } from '../components/IntentSelector';
import { CounterfactualCard } from '../components/CounterfactualCard';
import { DecisionTraceCard } from '../components/DecisionTraceCard';
import { ConfidenceBreakdownView } from '../components/ConfidenceBreakdownView';
import { PersonalizationComparisonCard } from '../components/PersonalizationComparisonCard';
import { ManualVsVyraCard } from '../components/ManualVsVyraCard';
import { IQOODeviceLayer } from '../components/IQOODeviceLayer';
import { ProductionArchitectureCard } from '../components/ProductionArchitectureCard';
import { Sliders, Cpu, Sparkles } from 'lucide-react';

export function ControlCenterPage() {
  const navigate = useNavigate();
  const { state, setIntent, setProfilePreset } = useVYRA();
  const domains = evaluateControlDomains(
    state.currentTelemetry,
    state.currentPerformanceState,
    state.currentAdaptation?.strategy.id || null,
    state.currentIntent
  );

  return (
    <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
      <div className="animate-fade-in max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-vyra-gold" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] text-vyra-gold font-display font-medium">
              CONTROL CENTER
            </span>
          </div>
          <span className="text-[9px] font-mono text-vyra-amber bg-[#22170E] px-2 py-0.5 rounded border border-vyra-amber/30">
            SIMULATED DEVICE CONTROL
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold text-vyra-white leading-tight tracking-tight mb-1.5">
          PERFORMANCE<br />CONTROL LAYER
        </h2>
        <p className="text-xs text-vyra-muted font-body mb-4 leading-relaxed">
          Actions VYRA synthesizes and requests from low-level SoC and OS subsystems based on your intent.
        </p>

        {/* Step 8 Advantage Banner */}
        <div className="mb-6 p-3 rounded-lg bg-gradient-to-r from-[#20180B] via-[#151108] to-black border border-vyra-gold/50 flex items-center justify-between gap-3 shadow-md">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-vyra-gold uppercase tracking-wider">
              <Sparkles size={11} />
              <span>STEP 8 PROOF</span>
            </div>
            <div className="font-display text-xs font-bold text-white mt-0.5">
              VYRA Advantage &amp; Differentiation
            </div>
            <div className="text-[10px] text-neutral-400 font-body">
              Side-by-side A/B simulation and 15s early intervention proof
            </div>
          </div>
          <button
            onClick={() => navigate('/advantage')}
            className="px-3 py-1.5 rounded bg-vyra-gold text-black font-display text-[10px] font-bold tracking-wider hover:bg-[#E5C973] shrink-0 transition-colors"
          >
            SEE PROOF
          </button>
        </div>

        {/* 1. Step 4 Req 8 & 9: Personalization Comparison (Profile A vs Profile B) */}
        <div className="mb-6">
          <PersonalizationComparisonCard
            activePreset={state.activeProfilePreset}
            onSelectPreset={setProfilePreset}
          />
        </div>

        {/* 2. Step 4 Req 13: Manual Mode vs VYRA Intelligence */}
        <div className="mb-6">
          <ManualVsVyraCard />
        </div>

        {/* 3. Intent-Driven Performance Interaction */}
        <div className="mb-6">
          <IntentSelector
            selectedIntent={state.currentIntent}
            onSelectIntent={setIntent}
          />
        </div>

        {/* 4. iQOO Device Layer Integration & Action Queue (Step 7 Req 1 & 8) */}
        <div className="mb-6">
          <IQOODeviceLayer />
        </div>

        {/* 4. Five Controllable Domains */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Cpu size={13} className="text-vyra-gold" />
              <span className="text-[10px] tracking-[0.15em] text-vyra-muted font-body">
                CONTROLLABLE HARDWARE DOMAINS
              </span>
            </div>
            <span className="text-[9px] font-mono text-vyra-muted">5 SUBSYSTEMS</span>
          </div>

          <div className="space-y-3">
            {domains.map((dom) => {
              const isModulating = dom.status === 'MODULATING' || dom.status === 'CRITICAL';
              return (
                <div
                  key={dom.id}
                  className={`bg-vyra-surface border ${
                    dom.status === 'CRITICAL'
                      ? 'border-[#552020]'
                      : isModulating
                      ? 'border-[#423315]'
                      : 'border-vyra-border'
                  } rounded-md p-3.5 animate-fade-in`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-display font-bold text-vyra-white">
                        {dom.label}
                      </span>
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          dom.status === 'CRITICAL'
                            ? 'bg-[#331114] text-vyra-red border border-vyra-red/40'
                            : isModulating
                            ? 'bg-[#2A200E] text-vyra-gold border border-vyra-gold/40'
                            : 'bg-vyra-dark text-vyra-muted'
                        }`}
                      >
                        {dom.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-vyra-muted">
                      {dom.currentState}
                    </span>
                  </div>

                  {/* Recommendation Bar */}
                  <div className="p-2 rounded bg-vyra-dark border border-vyra-border/60 my-2">
                    <div className="text-[8px] font-mono text-vyra-gold uppercase tracking-wider mb-0.5">
                      VYRA RECOMMENDATION
                    </div>
                    <div className="font-display text-xs font-semibold text-vyra-white">
                      {dom.recommendation}
                    </div>
                  </div>

                  {/* Reason & Expected Effect */}
                  <div className="space-y-1 text-[11px] font-body text-vyra-muted">
                    <div>
                      <span className="text-vyra-text font-medium">Reason:</span> &ldquo;{dom.reason}&rdquo;
                    </div>
                    <div>
                      <span className="text-vyra-text font-medium">Expected:</span> &ldquo;{dom.expectedEffect}&rdquo;
                    </div>
                  </div>

                  {/* Android Target Tag */}
                  <div className="mt-2 pt-2 border-t border-vyra-border/40 flex items-center justify-between text-[9px] font-mono text-vyra-muted">
                    <span>DEVICE TARGET:</span>
                    <span className="text-vyra-gold truncate max-w-[200px]">{dom.deviceTarget}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Counterfactual Simulation ("WHAT IF VYRA DID NOTHING?") */}
        <div className="mb-6">
          <CounterfactualCard
            counterfactual={state.currentAdaptation?.counterfactual}
          />
        </div>

        {/* 6. Engineering Decision Trace ("WHY THIS DECISION?") */}
        <div className="mb-6">
          <DecisionTraceCard
            trace={state.currentAdaptation?.decisionTrace}
            strategyLabel={state.currentAdaptation?.strategy.label}
          />
        </div>

        {/* 7. Inference Reliability Breakdown */}
        <div className="mb-6">
          <ConfidenceBreakdownView
            breakdown={state.currentPrediction?.confidenceBreakdown}
          />
        </div>

        {/* 8. Technical Architecture & Local Offline-First Callout (Step 7 Req 9 & 10) */}
        <div className="mb-6">
          <ProductionArchitectureCard />
        </div>

        {/* Product Positioning Statement */}
        <div className="p-4 bg-vyra-dark rounded border border-vyra-border/50 text-center animate-fade-in">
          <div className="text-[10px] font-display font-bold tracking-[0.2em] text-vyra-gold mb-1">
            PERFORMANCE THAT LEARNS YOU.
          </div>
          <div className="text-xs text-vyra-muted font-body">
            From static performance modes to personal performance intelligence.
          </div>
        </div>
      </div>
    </div>
  );
}
