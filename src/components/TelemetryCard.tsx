import { Telemetry } from '../types';
import { Gauge, Thermometer, Battery, Wifi } from 'lucide-react';

export function TelemetryCard({ telemetry }: { telemetry: Telemetry }) {
  const netValue = telemetry.networkStability || 'HIGH';
  const rateStr =
    typeof telemetry.thermalRateOfRise === 'number'
      ? ` (${telemetry.thermalRateOfRise > 0 ? '+' : ''}${telemetry.thermalRateOfRise.toFixed(2)}°/m)`
      : '';

  const signals = [
    {
      label: 'FPS STABILITY',
      value: `${Math.round(telemetry.fpsStability)}%`,
      sub: `${telemetry.frameTimeVariance ? telemetry.frameTimeVariance.toFixed(1) + 'ms var' : '60 FPS'}`,
      icon: Gauge,
      status: telemetry.fpsStability > 95 ? 'good' : telemetry.fpsStability > 88 ? 'warn' : 'bad',
    },
    {
      label: 'THERMAL',
      value: `${telemetry.thermalTemp.toFixed(1)}°C`,
      sub: rateStr || 'Normal',
      icon: Thermometer,
      status: telemetry.thermalTemp < 37 ? 'good' : telemetry.thermalTemp < 40 ? 'warn' : 'bad',
    },
    {
      label: 'BATTERY',
      value: `${Math.round(telemetry.batteryLevel)}%`,
      sub: 'Simulated Drain',
      icon: Battery,
      status: telemetry.batteryLevel > 40 ? 'good' : telemetry.batteryLevel > 20 ? 'warn' : 'bad',
    },
    {
      label: 'NETWORK',
      value: netValue,
      sub: 'Low Latency',
      icon: Wifi,
      status: netValue === 'HIGH' ? 'good' : netValue === 'MEDIUM' ? 'warn' : 'bad',
    },
  ];

  const statusColor = (s: string) => {
    if (s === 'good') return 'text-vyra-green';
    if (s === 'warn') return 'text-vyra-amber';
    return 'text-vyra-red';
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {signals.map((sig, i) => {
        const Icon = sig.icon;
        return (
          <div
            key={sig.label}
            className="bg-vyra-surface border border-vyra-border rounded-md p-3 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-vyra-muted" strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.15em] text-vyra-muted font-body">
                {sig.label}
              </span>
            </div>
            <div className={`font-display text-lg font-semibold ${statusColor(sig.status)}`}>
              {sig.value}
            </div>
            <div className="text-[9px] text-vyra-muted font-mono mt-0.5 truncate">
              {sig.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
