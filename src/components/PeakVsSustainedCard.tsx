import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Shield,
  Zap,
  Users,
  AlertOctagon,
  CheckCircle,
  Clock,
  Sparkles,
  Flame,
  Battery,
} from 'lucide-react';

export function PeakVsSustainedCard() {
  const [activeTab, setActiveTab] = useState<'TRAP' | 'PERSONALIZATION'>('TRAP');
  const [selectedUser, setSelectedUser] = useState<'USER_A' | 'USER_B'>('USER_A');

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl space-y-4">
      {/* Header with Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            PREDICTIVE PERFORMANCE ADVANTAGE
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
          SIMULATED SCENARIO
        </span>
      </div>

      {/* Tabs */}
      <div className="flex rounded bg-vyra-dark p-1 border border-vyra-border/60">
        <button
          onClick={() => setActiveTab('TRAP')}
          className={`flex-1 py-1.5 px-2 text-xs font-display font-medium rounded transition-all ${
            activeTab === 'TRAP'
              ? 'bg-[#1D170A] text-vyra-gold shadow border border-vyra-gold/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          THE &ldquo;PEAK PERFORMANCE&rdquo; TRAP
        </button>
        <button
          onClick={() => setActiveTab('PERSONALIZATION')}
          className={`flex-1 py-1.5 px-2 text-xs font-display font-medium rounded transition-all ${
            activeTab === 'PERSONALIZATION'
              ? 'bg-[#1D170A] text-vyra-gold shadow border border-vyra-gold/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          PERSONALIZED GAMING DECISION
        </button>
      </div>

      {/* ── TAB 1: THE "PEAK PERFORMANCE" TRAP (Requirement 6) ── */}
      {activeTab === 'TRAP' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-vyra-muted font-body leading-relaxed">
            Standard smartphone performance modes push maximum clock frequencies initially, causing rapid thermal saturation followed by steep throttling drops mid-game. VYRA predicts the curve and paces sustained output.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Traditional Strategy */}
            <div className="p-3 rounded bg-rose-950/20 border border-rose-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingDown size={14} className="text-rose-400" />
                  <span className="font-display text-xs font-bold text-rose-300">
                    TRADITIONAL &ldquo;PEAK&rdquo; FIRST
                  </span>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  REACTIVE
                </span>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between py-1 border-b border-rose-950">
                  <span className="text-neutral-400">00:00 – 05:00</span>
                  <span className="text-emerald-400 font-bold">99% Stability (35.6°C)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-rose-950">
                  <span className="text-neutral-400">15:00 – 25:00</span>
                  <span className="text-amber-400 font-bold">91% Stability (39.8°C)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-neutral-400">30:00+ (CLIMAX)</span>
                  <span className="text-rose-400 font-bold">84% Throttle (42.5°C)</span>
                </div>
              </div>

              <div className="p-2 rounded bg-neutral-950/70 border border-rose-900/30 text-[10px] text-neutral-300 font-body">
                <div className="text-rose-400 font-semibold text-[9px] font-mono uppercase mb-0.5">
                  THE FAILURE PATTERN
                </div>
                Thermal boundary saturated early $\to$ aggressive emergency CPU governor throttling drops FPS from 120 to 74 right during final teamfight.
              </div>
            </div>

            {/* VYRA Sustained Strategy */}
            <div className="p-3 rounded bg-[#151209] border border-vyra-gold/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-vyra-gold" />
                  <span className="font-display text-xs font-bold text-[#E5C973]">
                    VYRA PREDICTIVE SUSTAINED
                  </span>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-vyra-gold/20 text-vyra-gold border border-vyra-gold/40">
                  PREEMPTIVE
                </span>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between py-1 border-b border-[#2A200E]">
                  <span className="text-neutral-400">00:00 – 05:00</span>
                  <span className="text-white font-bold">97% Stability (35.6°C)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2A200E]">
                  <span className="text-neutral-400">15:00 – 25:00</span>
                  <span className="text-vyra-gold font-bold">97% Stability (37.8°C)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-neutral-400">30:00+ (CLIMAX)</span>
                  <span className="text-emerald-400 font-bold">96% Sustained (38.3°C)</span>
                </div>
              </div>

              <div className="p-2 rounded bg-[#0D0B06] border border-vyra-gold/30 text-[10px] text-neutral-300 font-body">
                <div className="text-vyra-gold font-semibold text-[9px] font-mono uppercase mb-0.5">
                  THE VYRA ADVANTAGE
                </div>
                Proactive micro-pacing at minute 12 stabilizes thermal slope before saturation $\to$ zero catastrophic throttling drops, continuous 96% stability.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PERSONALIZED GAMING DECISION (Requirement 7) ── */}
      {activeTab === 'PERSONALIZATION' && (
        <div className="space-y-3 animate-fade-in">
          <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
              <span>IDENTICAL TELEMETRY ENVIRONMENT:</span>
              <span className="text-amber-400 font-bold">38.5°C · 25 MIN · RANKED MATCH</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-body leading-snug">
              Under identical device strain, VYRA adapts dynamically based on user identity and learned gaming DNA rather than applying a blanket system profile.
            </p>
          </div>

          {/* User selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedUser('USER_A')}
              className={`flex-1 p-2 rounded border text-left transition-all ${
                selectedUser === 'USER_A'
                  ? 'bg-[#1D170A] border-vyra-gold text-white'
                  : 'bg-vyra-dark border-vyra-border/60 text-neutral-400'
              }`}
            >
              <div className="font-display text-xs font-bold text-vyra-gold">USER A (COMPETITIVE)</div>
              <div className="text-[9px] font-mono text-neutral-400">Frame consistency & touch response</div>
            </button>
            <button
              onClick={() => setSelectedUser('USER_B')}
              className={`flex-1 p-2 rounded border text-left transition-all ${
                selectedUser === 'USER_B'
                  ? 'bg-[#1D170A] border-vyra-gold text-white'
                  : 'bg-vyra-dark border-vyra-border/60 text-neutral-400'
              }`}
            >
              <div className="font-display text-xs font-bold text-blue-400">USER B (CASUAL GAMER)</div>
              <div className="text-[9px] font-mono text-neutral-400">Surface comfort & battery endurance</div>
            </button>
          </div>

          {/* Selected User Outcome Details */}
          {selectedUser === 'USER_A' ? (
            <div className="p-3.5 rounded bg-[#16130A] border border-vyra-gold/50 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-white">
                  VYRA INTERVENTION: STABILITY-FIRST (MONSTER BIAS)
                </span>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-vyra-gold/20 text-vyra-gold font-semibold">
                  COMPETITIVE PRIORITY
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-body text-neutral-300">
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Touch Sampling:</strong> Overclocks instant touch polling to 1000Hz burst mode.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Frame Pacing:</strong> Clamps GPU to 740MHz target, locking 16.6ms cadence without frame jitter.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vapor Chamber:</strong> Schedules aggressive cooling dissipation curve to tolerate high performance envelope.</span>
                </div>
              </div>

              <div className="p-2 rounded bg-black/50 border border-vyra-gold/30 text-[10px] font-mono text-vyra-gold">
                OUTCOME: Frame stability preserved at 98.2% · Touch response remains instantaneous
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded bg-[#0A121A] border border-blue-900/60 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-white">
                  VYRA INTERVENTION: THERMAL BALANCE & EFFICIENCY
                </span>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-semibold border border-blue-800">
                  COMFORT PRIORITY
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-body text-neutral-300">
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Surface Cooling:</strong> Shifts workload to high-efficiency core clusters to keep chassis &lt; 37.5°C.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Battery Runtime:</strong> Eliminates high-voltage boost, extending playable runtime by +38 minutes.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Frame Rate:</strong> Seamlessly smooths refresh rate at 60/90Hz without user experiencing thermal throttling drops.</span>
                </div>
              </div>

              <div className="p-2 rounded bg-black/50 border border-blue-900/40 text-[10px] font-mono text-blue-300">
                OUTCOME: Phone remains comfortably cool to the touch · Battery runtime extended +38 min
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
