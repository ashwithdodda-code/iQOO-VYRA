import { EarlyWarningLevel, PredictiveWindow } from '../types';
import { Clock, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface Props {
  predictiveWindow: PredictiveWindow;
  earlyWarningLevel: EarlyWarningLevel;
  riskScore: number;
}

export function PredictiveWindowCard({
  predictiveWindow,
  earlyWarningLevel,
  riskScore,
}: Props) {
  const isImminent = predictiveWindow.status === 'RISK_IMMINENT';

  const badgeConfig = {
    STABLE: {
      label: 'STABLE',
      color: 'text-vyra-green',
      bg: 'bg-[#102416]',
      border: 'border-vyra-green/30',
      icon: ShieldCheck,
    },
    WATCH: {
      label: 'WATCH',
      color: 'text-vyra-amber',
      bg: 'bg-[#22170E]',
      border: 'border-vyra-amber/40',
      icon: AlertTriangle,
    },
    INTERVENE: {
      label: 'INTERVENE',
      color: 'text-vyra-red',
      bg: 'bg-[#2B1115]',
      border: 'border-vyra-red/40',
      icon: AlertCircle,
    },
  }[earlyWarningLevel];

  const BadgeIcon = badgeConfig.icon;

  return (
    <div
      className={`bg-vyra-surface border ${
        isImminent ? 'border-vyra-amber/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'border-vyra-border'
      } rounded-md p-4 animate-fade-in transition-all duration-300`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
            PREDICTIVE WINDOW
          </span>
        </div>

        {/* 3-Level Early Warning Badge */}
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${badgeConfig.bg} ${badgeConfig.border} ${badgeConfig.color}`}
        >
          <BadgeIcon size={11} strokeWidth={2} />
          <span>{badgeConfig.label}</span>
          <span className="text-vyra-muted font-normal border-l border-vyra-border/60 pl-1 ml-0.5">
            {riskScore}/100
          </span>
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-[9px] font-mono tracking-wider text-vyra-muted uppercase mb-0.5">
            {predictiveWindow.label}
          </div>
          <div
            className={`font-mono text-3xl font-black tracking-tight ${
              isImminent ? 'text-vyra-amber' : 'text-vyra-white'
            }`}
          >
            {predictiveWindow.formattedTime}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[8px] font-mono text-vyra-muted">TRAJECTORY SLOPE</div>
          <div className="text-[10px] font-mono text-vyra-gold mt-0.5">
            {predictiveWindow.trajectorySlope}
          </div>
        </div>
      </div>

      {/* Continuously Updated Risk Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[9px] font-mono text-vyra-muted">
          <span>0 (STABLE)</span>
          <span>30 (WATCH)</span>
          <span>60 (INTERVENE)</span>
          <span>100</span>
        </div>
        <div className="h-1.5 w-full bg-vyra-dark rounded-full overflow-hidden relative">
          {/* Threshold markers */}
          <div className="absolute left-[30%] top-0 bottom-0 w-[1px] bg-vyra-border z-10" />
          <div className="absolute left-[60%] top-0 bottom-0 w-[1px] bg-vyra-border z-10" />
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              riskScore > 60
                ? 'bg-vyra-red'
                : riskScore > 30
                ? 'bg-vyra-amber'
                : 'bg-vyra-green'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
