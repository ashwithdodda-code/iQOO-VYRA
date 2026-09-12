import { Prediction } from '../types';
import { Activity, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Props {
  prediction: Prediction | null;
  riskScore: number;
}

export function PredictionCard({ prediction, riskScore }: Props) {
  if (!prediction) return null;

  const confidencePercent = Math.round(prediction.confidence * 100);
  const isElevatedRisk = prediction.type !== 'STABLE';

  return (
    <div className={`bg-vyra-surface border ${isElevatedRisk ? 'border-[#553315]' : 'border-vyra-border'} rounded-md p-4 animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isElevatedRisk ? (
            <AlertTriangle size={14} className="text-vyra-amber" strokeWidth={1.5} />
          ) : (
            <Activity size={14} className="text-vyra-gold" strokeWidth={1.5} />
          )}
          <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body">
            PREDICTION ENGINE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-vyra-muted font-body">
          <Clock size={11} strokeWidth={1.5} />
          <span>{prediction.timeHorizon}</span>
        </div>
      </div>

      {/* Main Prediction Heading */}
      <h3 className="font-display text-base font-semibold text-vyra-white mb-1.5">
        &ldquo;{prediction.message}&rdquo;
      </h3>

      {/* Primary Cause */}
      <div className="text-xs text-vyra-muted font-body mb-4">
        <span className="text-vyra-text font-medium">Primary cause:</span>{' '}
        {prediction.primaryCause}
      </div>

      {/* Confidence Bar & Risk Indicator */}
      <div className="grid grid-cols-2 gap-3 p-2.5 bg-vyra-dark rounded mb-3 border border-vyra-border/50">
        <div>
          <div className="flex items-center justify-between text-[9px] tracking-wider text-vyra-muted font-body mb-1">
            <span>CONFIDENCE</span>
            <span className="font-mono text-vyra-white font-semibold">{confidencePercent}%</span>
          </div>
          <div className="h-1 bg-vyra-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-vyra-gold rounded-full transition-all duration-700"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[9px] tracking-wider text-vyra-muted font-body mb-1">
            <span>PERF RISK</span>
            <span className={`font-mono font-semibold ${riskScore > 50 ? 'text-vyra-amber' : 'text-vyra-green'}`}>
              {riskScore}/100
            </span>
          </div>
          <div className="h-1 bg-vyra-surface rounded-full overflow-hidden">
            <div
              className={`h-full ${riskScore > 50 ? 'bg-vyra-amber' : 'bg-vyra-green'} rounded-full transition-all duration-700`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Factors Micro-grid */}
      {prediction.factors && prediction.factors.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-vyra-border/50">
          {prediction.factors.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-[10px] py-0.5">
              <span className="text-vyra-muted font-body">{f.label}</span>
              <div className="flex items-center gap-1 font-mono text-vyra-text text-[10px]">
                <span>{f.value}</span>
                {f.trend === 'rising' ? (
                  <ArrowUpRight size={11} className="text-vyra-amber" />
                ) : f.trend === 'falling' ? (
                  <ArrowDownRight size={11} className="text-vyra-green" />
                ) : (
                  <Minus size={11} className="text-vyra-muted" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
