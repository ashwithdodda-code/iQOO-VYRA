import { useVYRA } from '../hooks/useVYRA';
import { formatDate, formatDuration } from '../utils/format';
import { ArchitectureStack } from '../components/ArchitectureStack';
import { PredictionRecordCard } from '../components/PredictionRecordCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { BarChart3, Brain, Timer, ShieldCheck } from 'lucide-react';

export function InsightsPage() {
  const { state } = useVYRA();
  const sessions = state.sessionHistory;
  const effectiveness = state.strategyEffectiveness;

  // Chart data from actual historical sessions
  const performanceData = sessions.slice(-10).map((s, i) => ({
    session: `#${i + 1}`,
    fps: Math.round(s.averageFps * 10) / 10,
    thermal: Math.round(s.averageThermal * 10) / 10,
    drain: Math.round(s.batteryDrain),
  }));

  return (
    <div className="min-h-screen pb-20 md:pb-6 px-5 pt-12 md:pt-8">
      <div className="animate-fade-in max-w-md mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-vyra-gold" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.3em] text-vyra-gold font-display font-medium">
              INSIGHTS & ARCHITECTURE
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-vyra-white leading-tight tracking-tight mb-1.5">
            PERFORMANCE<br />INSIGHTS
          </h2>
          <p className="text-xs text-vyra-muted font-body">
            Observed telemetry trends, verified strategy memory, and predictive learning curve.
          </p>
        </div>

        {/* 1. Device Intelligence Architecture Stack & Android Target */}
        <ArchitectureStack />

        {/* 2. Step 4 Req 10 & 11: Prediction Accuracy History & Learning Curve Progression */}
        <PredictionRecordCard />

        {/* 3. Performance Trend Chart */}
        {performanceData.length > 0 && (
          <div className="bg-vyra-surface border border-vyra-border rounded-md p-3.5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] tracking-[0.15em] text-vyra-muted font-body">
                AVERAGE FPS STABILITY ACROSS SESSIONS
              </div>
              <span className="text-[9px] font-mono text-vyra-gold">TARGET 60</span>
            </div>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis
                    dataKey="session"
                    tick={{ fontSize: 9, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis domain={[54, 62]} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #2A2A2A',
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: 'Inter',
                    }}
                    itemStyle={{ color: '#E5E5E5' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fps"
                    stroke="#C8A84E"
                    strokeWidth={1.8}
                    dot={{ r: 3, fill: '#C8A84E' }}
                    name="Avg FPS"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. Thermal Trend Chart */}
        {performanceData.length > 0 && (
          <div className="bg-vyra-surface border border-vyra-border rounded-md p-3.5 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] tracking-[0.15em] text-vyra-muted font-body">
                AVERAGE THERMAL CLIMB ACROSS SESSIONS
              </div>
              <span className="text-[9px] font-mono text-vyra-amber">LIMIT 41°C</span>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis
                    dataKey="session"
                    tick={{ fontSize: 9, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis domain={[32, 42]} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #2A2A2A',
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: 'Inter',
                    }}
                    itemStyle={{ color: '#E5E5E5' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="thermal"
                    stroke="#F59E0B"
                    strokeWidth={1.8}
                    dot={{ r: 3, fill: '#F59E0B' }}
                    name="Avg °C"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 5. Strategy Effectiveness Memory Library */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-1.5 mb-2.5">
            <ShieldCheck size={13} className="text-vyra-gold" />
            <span className="text-[10px] tracking-[0.15em] text-vyra-muted font-body">
              STRATEGY MEMORY & PASS RATE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {effectiveness.slice(0, 4).map((eff) => {
              const rate = Math.round((eff.successes / Math.max(1, eff.uses)) * 100);
              return (
                <div
                  key={eff.strategyId}
                  className="bg-vyra-surface border border-vyra-border rounded p-2.5"
                >
                  <div className="text-[10px] font-display font-semibold text-vyra-white truncate">
                    {eff.strategyId.replace('_', ' ')}
                  </div>
                  <div className="flex items-baseline justify-between mt-1 font-mono">
                    <span className="text-[9px] text-vyra-muted">{eff.uses} runs</span>
                    <span className="text-xs text-vyra-green font-bold">
                      {rate}% pass
                    </span>
                  </div>
                  <div className="text-[9px] text-vyra-gold font-mono mt-0.5">
                    +{eff.averageImprovement}% avg delta
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Recent Sessions List */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-2.5">
            <Timer size={13} className="text-vyra-muted" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.15em] text-vyra-muted font-body">
              RECENT SESSIONS
            </span>
          </div>
          <div className="space-y-2">
            {sessions.length > 0 ? (
              sessions
                .slice(-4)
                .reverse()
                .map((session) => (
                  <div
                    key={session.id}
                    className="bg-vyra-surface border border-vyra-border rounded-md p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] tracking-[0.1em] text-vyra-muted font-body">
                        {formatDate(session.startTime)} &middot; {session.workload}
                      </span>
                      <span className="font-mono text-xs font-semibold text-vyra-white">
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-vyra-muted font-mono">
                      <span>FPS {session.averageFps.toFixed(1)}</span>
                      <span>{session.averageThermal.toFixed(1)}°C</span>
                      <span>-{session.batteryDrain.toFixed(0)}% batt</span>
                      {session.peakRiskScore ? (
                        <span className="text-vyra-amber">
                          peak risk {session.peakRiskScore}
                        </span>
                      ) : null}
                    </div>
                    {session.finalVerification && (
                      <p className="text-[10px] text-vyra-text mt-1.5 font-body">
                        &ldquo;{session.finalVerification.message}&rdquo;
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <div className="text-xs text-vyra-muted p-3 bg-vyra-surface rounded border border-vyra-border">
                No completed sessions yet. Start a session to generate insights.
              </div>
            )}
          </div>
        </div>

        {/* 7. VYRA Learned Feed */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-2.5">
            <Brain size={13} className="text-vyra-gold" strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.15em] text-vyra-muted font-body">
              VYRA LEARNED
            </span>
          </div>
          <div className="bg-vyra-surface border border-vyra-border rounded-md p-3.5 space-y-2.5">
            {state.learningUpdates.slice(0, 4).map((update, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-vyra-gold mt-1.5 shrink-0" />
                <p className="text-xs text-vyra-text font-body leading-relaxed">
                  &ldquo;{update}&rdquo;
                </p>
              </div>
            ))}
            <div className="pt-2 border-t border-vyra-border/40 text-[10px] text-vyra-muted font-body">
              VYRA will consider this behaviour in the next prediction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
