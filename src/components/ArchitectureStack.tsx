import { useState } from 'react';
import { ANDROID_INTEGRATION_CONTRACT } from '../data/intentData';
import { Layers, ShieldCheck, Cpu, ArrowDown } from 'lucide-react';

const STACK_LAYERS = [
  { id: 'INTENT', label: 'USER INTENT', desc: 'Real-time objective bias (Stability, Battery, Latency)' },
  { id: 'DNA', label: 'PERSONAL PERFORMANCE DNA', desc: 'Learned individual tolerances & sensitivity weights' },
  { id: 'TELEMETRY', label: 'DEVICE TELEMETRY STREAM', desc: 'Sensor array: Thermal slope, Frame variance, Power' },
  { id: 'FEATURE', label: 'LOCAL FEATURE ENGINE', desc: 'Sliding window normalization & rate-of-climb derivation' },
  { id: 'MODEL', label: 'PREDICTION & RISK MODEL', desc: 'Deterministic / On-Device ML degradation forecasting' },
  { id: 'POLICY', label: 'DECISION & POLICY ENGINE', desc: 'Intent-weighted strategy synthesis & counterfactual check' },
  { id: 'CONTROL', label: 'DEVICE CONTROL LAYER', desc: 'Hardware abstraction for thermal, clock & pacing control' },
  { id: 'VERIFY', label: 'VERIFICATION ENGINE', desc: 'Quantitative delta evaluation (Before vs After)' },
  { id: 'MEMORY', label: 'LEARNING MEMORY (LOOP)', desc: 'Continual calibration of strategy effectiveness & DNA' },
];

export function ArchitectureStack() {
  const [selectedTab, setSelectedTab] = useState<'stack' | 'contract'>('stack');

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      {/* Header Tabs */}
      <div className="flex items-center justify-between mb-3 border-b border-vyra-border pb-2">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-vyra-gold" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            DEVICE INTELLIGENCE ARCHITECTURE
          </span>
        </div>
        <div className="flex items-center gap-1 bg-vyra-dark p-0.5 rounded border border-vyra-border/50 text-[9px] font-mono">
          <button
            onClick={() => setSelectedTab('stack')}
            className={`px-2 py-0.5 rounded transition-all ${
              selectedTab === 'stack' ? 'bg-vyra-surface text-vyra-gold font-bold' : 'text-vyra-muted'
            }`}
          >
            STACK
          </button>
          <button
            onClick={() => setSelectedTab('contract')}
            className={`px-2 py-0.5 rounded transition-all ${
              selectedTab === 'contract' ? 'bg-vyra-surface text-vyra-gold font-bold' : 'text-vyra-muted'
            }`}
          >
            ANDROID TARGET
          </button>
        </div>
      </div>

      {selectedTab === 'stack' ? (
        <div>
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display font-semibold text-vyra-white">
              LOCAL-FIRST INTELLIGENCE
            </span>
            <span className="text-[9px] font-mono text-vyra-green bg-[#102416] px-1.5 py-0.5 rounded border border-vyra-green/30">
              ZERO CLOUD DEPENDENCY
            </span>
          </div>
          <p className="text-[11px] text-vyra-muted font-body mb-4 leading-relaxed">
            Sensitive user telemetry and gaming workloads are processed entirely on-device
            using a local closed-loop architecture.
          </p>

          {/* Interactive Stack Visualizer */}
          <div className="space-y-1.5 font-mono">
            {STACK_LAYERS.map((layer, i) => (
              <div key={layer.id} className="relative">
                <div className="p-2.5 rounded bg-vyra-dark border border-vyra-border/60 flex items-center justify-between text-xs hover:border-vyra-gold/50 transition-colors">
                  <div>
                    <div className="text-[10px] font-bold text-vyra-white tracking-wide">
                      {layer.label}
                    </div>
                    <div className="text-[9px] text-vyra-muted font-body mt-0.5">
                      {layer.desc}
                    </div>
                  </div>
                  <span className="text-[9px] text-vyra-gold font-mono">0{i + 1}</span>
                </div>
                {i < STACK_LAYERS.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <ArrowDown size={10} className="text-vyra-muted/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-display font-semibold text-vyra-white">
              FUTURE ANDROID INTEGRATION CONTRACT
            </span>
            <span className="text-[9px] font-mono text-vyra-amber bg-[#22170E] px-1.5 py-0.5 rounded border border-vyra-amber/30">
              DEVICE-SIDE INTEGRATION TARGET
            </span>
          </div>
          <p className="text-[11px] text-vyra-muted font-body mb-4 leading-relaxed">
            Architectural contract defining how browser prototype signals map directly
            to native Android framework and iQOO SoC control services.
          </p>

          <div className="space-y-2 font-mono">
            {ANDROID_INTEGRATION_CONTRACT.map((item) => (
              <div
                key={item.prototypeSignal}
                className="p-2.5 rounded bg-vyra-dark border border-vyra-border/50 text-[10px]"
              >
                <div className="flex items-center justify-between text-vyra-gold font-bold mb-1">
                  <span>{item.prototypeSignal}</span>
                  <span className="text-[9px] text-vyra-muted">{item.telemetryCadence}</span>
                </div>
                <div className="text-vyra-text text-[11px] mb-1">
                  {item.androidTarget}
                </div>
                <div className="flex items-center justify-between text-[9px] text-vyra-muted pt-1 border-t border-vyra-border/40 font-body">
                  <span>{item.subsystem}</span>
                  <span className="font-mono text-vyra-muted">{item.interfaceType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
