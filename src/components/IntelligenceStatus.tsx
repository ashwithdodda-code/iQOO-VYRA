import { VYRAStateType } from '../types';
import { Eye, Search, Activity, Zap, CheckCircle2, Brain } from 'lucide-react';

const stateConfig: Record<
  VYRAStateType,
  {
    icon: typeof Activity;
    label: string;
    description: string;
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    dotColor: string;
  }
> = {
  MONITORING: {
    icon: Eye,
    label: 'MONITORING',
    description: 'Tracking session behaviour and device conditions.',
    badgeBg: 'bg-vyra-surface',
    badgeBorder: 'border-vyra-border',
    textColor: 'text-vyra-white',
    dotColor: 'bg-vyra-muted',
  },
  ANALYZING: {
    icon: Search,
    label: 'ANALYZING',
    description: 'Evaluating telemetry trends against learned baseline.',
    badgeBg: 'bg-[#1C180E]',
    badgeBorder: 'border-[#423315]',
    textColor: 'text-vyra-gold',
    dotColor: 'bg-vyra-gold',
  },
  PREDICTING: {
    icon: Activity,
    label: 'PREDICTING',
    description: 'Forecasting potential performance degradation.',
    badgeBg: 'bg-[#22160C]',
    badgeBorder: 'border-[#553315]',
    textColor: 'text-vyra-amber',
    dotColor: 'bg-vyra-amber',
  },
  ADAPTING: {
    icon: Zap,
    label: 'ADAPTING',
    description: 'Synthesizing strategy tailored to your Performance DNA.',
    badgeBg: 'bg-[#1C180E]',
    badgeBorder: 'border-vyra-gold/50',
    textColor: 'text-vyra-gold',
    dotColor: 'bg-vyra-gold',
  },
  VERIFYING: {
    icon: CheckCircle2,
    label: 'VERIFYING',
    description: 'Quantifying intervention effectiveness (Before vs After).',
    badgeBg: 'bg-[#0E1F14]',
    badgeBorder: 'border-[#1E4E2C]',
    textColor: 'text-vyra-green',
    dotColor: 'bg-vyra-green',
  },
  LEARNING: {
    icon: Brain,
    label: 'LEARNING',
    description: 'Updating Personal Performance DNA from verified outcome.',
    badgeBg: 'bg-[#1A1424]',
    badgeBorder: 'border-[#3D2C56]',
    textColor: 'text-vyra-white',
    dotColor: 'bg-vyra-gold',
  },
};

interface Props {
  state: VYRAStateType;
  riskScore?: number;
  compact?: boolean;
}

export function IntelligenceStatus({ state, riskScore, compact = false }: Props) {
  const config = stateConfig[state] || stateConfig.MONITORING;
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border ${config.badgeBg} ${config.badgeBorder}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse-subtle`} />
        <Icon size={12} className={config.textColor} strokeWidth={1.5} />
        <span className={`text-[10px] font-display font-semibold tracking-wider ${config.textColor}`}>
          {config.label}
        </span>
        {typeof riskScore === 'number' && (
          <span className="text-[9px] font-mono text-vyra-muted border-l border-vyra-border pl-1.5 ml-0.5">
            RISK {riskScore}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`border ${config.badgeBorder} ${config.badgeBg} rounded-md p-3.5 animate-fade-in transition-all duration-300`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-vyra-gold animate-pulse-subtle" />
          <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body">
            INTELLIGENCE STATE
          </span>
        </div>
        {typeof riskScore === 'number' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-wider text-vyra-muted font-body">RISK SCORE</span>
            <span className={`font-display text-xs font-bold ${riskScore > 50 ? 'text-vyra-amber' : riskScore > 75 ? 'text-vyra-red' : 'text-vyra-green'}`}>
              {riskScore}/100
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 mb-1">
        <Icon size={16} className={config.textColor} strokeWidth={1.5} />
        <span className="font-display text-sm font-semibold tracking-wide text-vyra-white">
          {config.label}
        </span>
      </div>

      <p className="text-xs text-vyra-muted font-body leading-relaxed">
        {config.description}
      </p>
    </div>
  );
}
