import React from 'react';
import {
  Layers,
  Shield,
  Cpu,
  Smartphone,
  Zap,
  Lock,
  WifiOff,
  Clock,
  ChevronDown,
} from 'lucide-react';

export function ProductionArchitectureCard() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-lg p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            TECHNICAL ARCHITECTURE
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#22170E] text-vyra-amber border border-vyra-amber/40">
          PRODUCTION INTEGRATION TARGET
        </span>
      </div>

      <p className="text-xs text-vyra-muted font-body leading-relaxed">
        How iQOO VYRA integrates natively as a zero-latency performance intelligence layer between user intent and low-level hardware controllers.
      </p>

      {/* ── 4-Layer Architecture Diagram (Requirement 9) ── */}
      <div className="space-y-2 font-mono text-[10px]">
        {/* Layer 1 */}
        <div className="p-3 rounded bg-vyra-dark border border-vyra-border/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400">LAYER 1: USER INTENT & GAMING DNA</span>
            <span className="text-[8px] text-neutral-500">USERSPACE</span>
          </div>
          <div className="font-display text-xs font-semibold text-vyra-white">
            OriginOS Game Space & Touch Intention Interface
          </div>
          <div className="text-neutral-400 text-[10px] font-body">
            User Intent (Max Stability, Lowest Latency, Cooler Device) + Learned Personal Performance DNA
          </div>
        </div>

        <div className="flex justify-center text-vyra-gold/60">
          <ChevronDown size={14} />
        </div>

        {/* Layer 2 */}
        <div className="p-3 rounded bg-[#1A1409] border border-vyra-gold/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-vyra-gold">LAYER 2: iQOO VYRA INTELLIGENCE CORE</span>
            <span className="text-[8px] bg-vyra-gold/20 text-vyra-gold px-1 rounded font-bold">100% LOCAL</span>
          </div>
          <div className="font-display text-xs font-bold text-[#E5C973]">
            Deterministic Closed-Loop Intelligence Daemon
          </div>
          <div className="text-neutral-300 text-[10px] font-body">
            Predictive Window Model · Multi-Factor Root Cause Analyzer · Closed-Loop Outcome Verifier (&lt;0.2ms latency)
          </div>
        </div>

        <div className="flex justify-center text-vyra-gold/60">
          <ChevronDown size={14} />
        </div>

        {/* Layer 3 */}
        <div className="p-3 rounded bg-vyra-dark border border-vyra-border/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400">LAYER 3: HARDWARE ABSTRACTION LAYER (HAL)</span>
            <span className="text-[8px] text-neutral-500">KERNEL / DRIVERS</span>
          </div>
          <div className="font-display text-xs font-semibold text-vyra-white">
            iQOO Monster Mode & Low-Level Subsystem Controllers
          </div>
          <div className="text-neutral-400 text-[10px] font-body">
            EAS CPU Task Placer · Adreno GPU devfreq & VRS · 1000Hz Touch HAL · SuperVC Dissipation · TI Bypass Charge Bus
          </div>
        </div>

        <div className="flex justify-center text-vyra-gold/60">
          <ChevronDown size={14} />
        </div>

        {/* Layer 4 */}
        <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400">LAYER 4: PHYSICAL PERFORMANCE SILICON</span>
            <span className="text-[8px] text-neutral-500">HARDWARE</span>
          </div>
          <div className="font-display text-xs font-semibold text-neutral-200">
            iQOO Flagship Device Hardware Stack
          </div>
          <div className="text-neutral-500 text-[10px] font-body">
            Snapdragon / Dimensity SoC · 6K SuperVC Chamber · 144Hz LTPO AMOLED · Dual-Cell FlashCharge · Wi-Fi 7 / 5G RF
          </div>
        </div>
      </div>

      {/* ── 100% Offline-First / Local Intelligence Callout (Requirement 10) ── */}
      <div className="p-3.5 rounded bg-[#101511] border border-emerald-900/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-display text-xs font-bold">
            <Shield size={14} />
            <span>OFFLINE-FIRST LOCAL INTELLIGENCE</span>
          </div>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            0 CLOUD APIS
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded bg-black/40 border border-emerald-950 flex items-center gap-2">
            <Clock size={12} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold">&lt;0.2ms Inference</div>
              <div className="text-neutral-500 text-[8px]">Zero network lag</div>
            </div>
          </div>

          <div className="p-2 rounded bg-black/40 border border-emerald-950 flex items-center gap-2">
            <WifiOff size={12} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold">Tournament Legal</div>
              <div className="text-neutral-500 text-[8px]">Runs in airplane mode</div>
            </div>
          </div>

          <div className="p-2 rounded bg-black/40 border border-emerald-950 flex items-center gap-2">
            <Lock size={12} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold">Absolute Privacy</div>
              <div className="text-neutral-500 text-[8px]">Telemetry stays on-chip</div>
            </div>
          </div>

          <div className="p-2 rounded bg-black/40 border border-emerald-950 flex items-center gap-2">
            <Cpu size={12} className="text-emerald-400 shrink-0" />
            <div>
              <div className="text-white font-bold">0% Cloud Overhead</div>
              <div className="text-neutral-500 text-[8px]">No battery drain from network</div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-emerald-200/80 font-body leading-snug pt-1">
          Every decision, prediction, and verification happens entirely within the local NPU and kernel scheduler. No external servers or API calls are ever made.
        </p>
      </div>
    </div>
  );
}
