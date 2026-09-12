import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';

const TIMELINE_POINTS = [
  { t: 0, timeLabel: '0s', conventionalFps: 120, vyraFps: 120, conventionalStab: 99, vyraStab: 99 },
  { t: 5, timeLabel: '5s', conventionalFps: 120, vyraFps: 119, conventionalStab: 98, vyraStab: 98 },
  { t: 10, timeLabel: '10s', conventionalFps: 119, vyraFps: 119, conventionalStab: 97, vyraStab: 97 },
  { t: 13, timeLabel: '13s', conventionalFps: 118, vyraFps: 118, conventionalStab: 96, vyraStab: 97 },
  { t: 20, timeLabel: '20s', conventionalFps: 115, vyraFps: 118, conventionalStab: 92, vyraStab: 97 },
  { t: 28, timeLabel: '28s', conventionalFps: 82, vyraFps: 117, conventionalStab: 76, vyraStab: 96 },
  { t: 35, timeLabel: '35s', conventionalFps: 74, vyraFps: 117, conventionalStab: 72, vyraStab: 96 },
  { t: 40, timeLabel: '40s', conventionalFps: 78, vyraFps: 117, conventionalStab: 74, vyraStab: 96 },
];

export function PredictiveAdvantageGraph() {
  const [activeCursorTime, setActiveCursorTime] = useState<number>(13);

  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-xl p-5 shadow-xl space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-vyra-gold" />
          <span className="text-[10px] tracking-[0.25em] text-vyra-gold font-display font-semibold uppercase">
            PREDICTIVE ADVANTAGE VISUALIZATION
          </span>
        </div>
        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
          Timeline Analysis
        </span>
      </div>

      {/* Hero Headline Banner */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-[#20180B] via-[#171207] to-black border border-vyra-gold/50 flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-vyra-gold/20 border border-vyra-gold flex items-center justify-center shrink-0">
            <Zap size={16} className="text-vyra-gold animate-pulse" />
          </div>
          <div>
            <div className="font-display text-sm sm:text-base font-black text-white tracking-tight">
              VYRA ACTED BEFORE THE DROP
            </div>
            <div className="text-[10px] font-mono text-neutral-300 mt-0.5">
              Intervened at 13s · Throttling crash prevented at 28s
            </div>
          </div>
        </div>

        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800/60 shrink-0">
          +15s LEAD TIME
        </span>
      </div>

      {/* Grounded Physical Explanation */}
      <p className="text-xs text-neutral-300 font-body leading-relaxed">
        <strong>How it works:</strong> Prediction triggered from the physical combination of <strong>thermal trend (+0.42°C/min)</strong> + <strong>frame-time variance (+18%)</strong> + <strong>workload intensity (91% GPU dispatch)</strong>. VYRA adjusts the pacing curve before temperature reaches the critical trip point.
      </p>

      {/* Interactive Recharts Graph */}
      <div className="bg-vyra-dark border border-vyra-border/60 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mb-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400 rounded-full" />
              VYRA Sustained (117-120 FPS)
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-0.5 bg-rose-400 rounded-full" />
              Conventional Throttling (Drops to 74 FPS)
            </span>
          </div>
          <span>FPS Output</span>
        </div>

        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TIMELINE_POINTS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="timeLabel"
                stroke="#555555"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                domain={[60, 130]}
                stroke="#555555"
                fontSize={10}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D0D0D',
                  border: '1px solid #333333',
                  borderRadius: 6,
                  fontSize: 10,
                  fontFamily: 'Inter',
                }}
              />
              <ReferenceLine x="13s" stroke="#C8A84E" strokeDasharray="3 3" label={{ value: 'VYRA INTERVENTION (13s)', fill: '#C8A84E', fontSize: 8, position: 'insideTopLeft' }} />
              <ReferenceLine x="28s" stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'CONVENTIONAL CRASH (28s)', fill: '#EF4444', fontSize: 8, position: 'insideTopLeft' }} />
              <Line
                type="monotone"
                dataKey="vyraFps"
                name="iQOO VYRA"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#10B981' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="conventionalFps"
                name="Conventional"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={{ r: 2, fill: '#F43F5E' }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3-Step Milestone Progression */}
      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
        <div className="p-2 rounded bg-black/40 border border-neutral-800">
          <div className="text-amber-400 font-bold">10s: RISK PREDICTED</div>
          <div className="text-neutral-400 text-[9px] mt-0.5">
            Thermal gradient slope signals future throttling boundary.
          </div>
        </div>

        <div className="p-2 rounded bg-[#181308] border border-vyra-gold/50">
          <div className="text-vyra-gold font-bold">13s: VYRA INTERVENES</div>
          <div className="text-neutral-300 text-[9px] mt-0.5">
            Micro-paces GPU clock to 740MHz; bursts touch polling.
          </div>
        </div>

        <div className="p-2 rounded bg-rose-950/20 border border-rose-900/40">
          <div className="text-rose-400 font-bold">28s: TRADITIONAL CRASH</div>
          <div className="text-neutral-400 text-[9px] mt-0.5">
            Unmanaged phone suffers -15 FPS drop during teamfight.
          </div>
        </div>
      </div>
    </div>
  );
}
