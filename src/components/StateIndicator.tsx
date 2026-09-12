import { VYRAStateType } from '../types';
import { Activity, Eye, Search, Brain, Zap, CheckCircle } from 'lucide-react';

const stateConfig: Record<
  VYRAStateType,
  { icon: typeof Activity; label: string; description: string; color: string }
> = {
  MONITORING: {
    icon: Eye,
    label: 'MONITORING',
    description: 'Tracking session behaviour and device conditions.',
    color: 'text-vyra-text',
  },
  ANALYZING: {
    icon: Search,
    label: 'ANALYZING',
    description: 'Evaluating telemetry trends against learned baseline.',
    color: 'text-vyra-gold',
  },
  PREDICTING: {
    icon: Activity,
    label: 'PREDICTING',
    description: 'Forecasting potential performance degradation.',
    color: 'text-vyra-amber',
  },
  ADAPTING: {
    icon: Zap,
    label: 'ADAPTING',
    description: 'Selecting optimal performance strategy for current workload.',
    color: 'text-vyra-gold',
  },
  VERIFYING: {
    icon: CheckCircle,
    label: 'VERIFYING',
    description: 'Validating session outcome against learned patterns.',
    color: 'text-vyra-green',
  },
  LEARNING: {
    icon: Brain,
    label: 'LEARNING',
    description: 'Updating Performance DNA from session observations.',
    color: 'text-vyra-gold',
  },
};

export function StateIndicator({ state }: { state: VYRAStateType }) {
  const config = stateConfig[state] || stateConfig.MONITORING;
  const Icon = config.icon;

  const dotBg =
    config.color === 'text-vyra-gold'
      ? 'bg-vyra-gold'
      : config.color === 'text-vyra-green'
      ? 'bg-vyra-green'
      : config.color === 'text-vyra-amber'
      ? 'bg-vyra-amber'
      : 'bg-vyra-text';

  return (
    <div className="animate-fade-in">
      <div className="text-[10px] tracking-[0.2em] text-vyra-muted mb-2 font-body">
        VYRA STATE
      </div>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className={config.color}>
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <span className="font-display text-base font-semibold tracking-wide text-vyra-white">
          {config.label}
        </span>
        <div className={`w-1.5 h-1.5 rounded-full ${dotBg} animate-pulse-subtle`} />
      </div>
      <p className="text-xs text-vyra-muted font-body">{config.description}</p>
    </div>
  );
}
