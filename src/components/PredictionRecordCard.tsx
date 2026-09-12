import React from 'react';
import {
  HISTORICAL_PREDICTION_RECORDS,
  SIMULATED_LEARNING_CURVE,
} from '../engine/predictiveAdvantage';

export const PredictionRecordCard: React.FC = () => {
  return (
    <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 mb-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-40 bg-[#C8A84E]/5 rounded-bl-full pointer-events-none blur-3xl" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8A84E]" />
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display">
              Prediction Verification & Learning Curve
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Empirical accuracy tracking of preemptive lead-time predictions vs physical telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#C8A84E]/10 border border-[#C8A84E]/30 text-[#C8A84E] font-semibold">
            AVG ACCURACY: 94.2%
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            LEAD TIME: ~2m 30s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Historical Prediction Accuracy Records (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span className="font-semibold text-neutral-300">RECENT PREEMPTIVE VALIDATIONS</span>
            <span className="font-mono text-[10px]">4 RECORDED CYCLES</span>
          </div>

          <div className="space-y-2.5">
            {HISTORICAL_PREDICTION_RECORDS.map((rec) => (
              <div
                key={rec.id}
                className="bg-neutral-950/80 border border-neutral-850 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-white font-display">
                      {rec.prediction}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                    <span>
                      Pred: <strong className="text-neutral-300">{rec.predictedTime}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Obs: <strong className="text-neutral-300">{rec.observedTime}</strong>
                    </span>
                    <span>·</span>
                    <span className="text-neutral-400">
                      Lead: {Math.round(rec.leadTimeSeconds / 60)}m {rec.leadTimeSeconds % 60}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-neutral-850 pt-2 sm:pt-0">
                  <span className="text-[10px] font-mono text-neutral-400">Accuracy</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-[#C8A84E] rounded-full"
                        style={{ width: `${rec.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold font-mono text-[#C8A84E]">
                      {rec.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-neutral-900/50 rounded border border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Preemptive delta window variance: <strong className="text-neutral-200 font-mono">±6.8 seconds</strong></span>
            <span className="text-emerald-400 font-mono font-medium">PASS · NO FALSE POSITIVES</span>
          </div>
        </div>

        {/* Right Column: Learning Curve Progression (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-950/60 border border-neutral-850 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-200">LEARNING PROGRESSION</span>
              <span className="text-[10px] font-mono text-[#C8A84E]">71% → 92% (+21%)</span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">
              Accuracy improves across consecutive gaming sessions as VYRA locks onto thermal inertia and frame time variance signatures.
            </p>

            {/* Progression Bar Track */}
            <div className="space-y-3">
              {SIMULATED_LEARNING_CURVE.map((point) => (
                <div key={point.sessionNumber} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-neutral-300">
                      Session {point.sessionNumber}:{' '}
                      <span className="text-neutral-400 text-[10px]">{point.status}</span>
                    </span>
                    <span className="text-[#C8A84E] font-bold">{point.accuracy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neutral-600 via-[#C8A84E]/70 to-[#C8A84E] rounded-full transition-all duration-500"
                      style={{ width: `${point.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-850">
            <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Model State:</span>
              <span className="text-[#C8A84E] font-semibold">Autonomous Converged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
