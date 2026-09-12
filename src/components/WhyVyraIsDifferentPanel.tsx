import React from 'react';
import {
  Clock,
  UserCheck,
  RefreshCw,
  Layers,
  HelpCircle,
  Shield,
  Sparkles,
} from 'lucide-react';

const PILLARS = [
  {
    num: '1',
    title: 'Predictive',
    icon: Clock,
    description: 'Does not wait for visible performance degradation.',
    metricBadge: 'Acts 15s Early',
  },
  {
    num: '2',
    title: 'Personal',
    icon: UserCheck,
    description: 'Uses Personal Performance DNA instead of one fixed optimization profile.',
    metricBadge: 'User DNA Driven',
  },
  {
    num: '3',
    title: 'Closed-Loop',
    icon: RefreshCw,
    description: 'Learn → Predict → Adapt → Verify → Learn.',
    metricBadge: 'Self-Calibrating',
  },
  {
    num: '4',
    title: 'Workload-Aware',
    icon: Layers,
    description: 'Gaming, streaming, multitasking and other demanding workloads can require different strategies.',
    metricBadge: '5 Workloads',
  },
  {
    num: '5',
    title: 'Explainable',
    icon: HelpCircle,
    description: 'Every intervention has a measurable reason and expected outcome.',
    metricBadge: 'Decision Trace',
  },
  {
    num: '6',
    title: 'Local-First',
    icon: Shield,
    description: 'The intelligence architecture is designed to operate locally without requiring continuous cloud inference.',
    metricBadge: '0 Cloud APIs',
  },
];

export function WhyVyraIsDifferentPanel() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            TECHNICAL DIFFERENTIATION
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          6 Core Pillars
        </span>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold text-white tracking-tight uppercase">
          WHY VYRA IS DIFFERENT
        </h3>
        <p className="text-xs text-vyra-muted font-body mt-1 leading-relaxed">
          How iQOO VYRA fundamentally diverges from static OEM performance toggles and generic cloud-based AI.
        </p>
      </div>

      {/* 6-Pillar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PILLARS.map(({ num, title, icon: Icon, description, metricBadge }) => (
          <div
            key={num}
            className="p-3 rounded-lg bg-vyra-dark border border-vyra-border/60 flex flex-col justify-between space-y-2 hover:border-vyra-gold/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#1D170A] border border-vyra-gold/50 flex items-center justify-center text-vyra-gold font-display text-xs font-bold shrink-0">
                  {num}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon size={14} className="text-vyra-gold" />
                  <span className="font-display text-xs font-bold text-white">
                    {title}
                  </span>
                </div>
              </div>

              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#20180A] text-[#E5C973] border border-[#3E2F13]">
                {metricBadge}
              </span>
            </div>

            <p className="text-[11px] text-neutral-300 font-body leading-relaxed pl-8">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
