import React, { useState, useEffect } from 'react';
import { useVYRA } from '../hooks/useVYRA';
import { Smartphone, Radio, Battery, Wifi, Cpu, Layers, CheckCircle2, AlertCircle, Terminal, HelpCircle } from 'lucide-react';
import { LiveDeviceStatus } from '../engine/liveDeviceSensor';

export function LiveDeviceConnectBar() {
  const { setLiveDeviceMode, isLiveDeviceMode, getLiveDeviceStatus } = useVYRA();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [deviceStatus, setDeviceStatus] = useState<LiveDeviceStatus | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    const active = isLiveDeviceMode();
    setIsLive(active);
    setDeviceStatus(getLiveDeviceStatus());

    const interval = setInterval(() => {
      setDeviceStatus(getLiveDeviceStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveDeviceMode, getLiveDeviceStatus]);

  const toggleLiveDevice = () => {
    const next = !isLive;
    setIsLive(next);
    setLiveDeviceMode(next);
  };

  return (
    <div className="bg-gradient-to-r from-[#14120C] via-[#1A150C] to-[#120F0A] border border-[#C8A84E]/50 rounded-xl p-3.5 shadow-lg space-y-2.5 animate-fade-in">
      {/* Top row: Mode Switcher & Source */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone size={15} className={isLive ? 'text-emerald-400' : 'text-[#C8A84E]'} />
          <span className="text-[10px] tracking-[0.25em] font-display font-bold uppercase text-white">
            DEVICE TELEMETRY SOURCE
          </span>
        </div>

        <button
          onClick={() => setShowHelpModal(true)}
          title="How real iQOO device connection works"
          className="text-[9px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <HelpCircle size={11} />
          <span>HOW IT WORKS</span>
        </button>
      </div>

      {/* Toggle Bar */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-black/60 border border-neutral-800">
        <button
          onClick={() => isLive && toggleLiveDevice()}
          className={`py-2 px-3 rounded text-xs font-display font-semibold transition-all flex items-center justify-center gap-1.5 ${
            !isLive
              ? 'bg-neutral-800 text-white shadow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers size={12} />
          <span>SIMULATION ENGINE</span>
        </button>

        <button
          onClick={() => !isLive && toggleLiveDevice()}
          className={`py-2 px-3 rounded text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 ${
            isLive
              ? 'bg-gradient-to-r from-[#C8A84E] to-[#E5C973] text-black shadow-md shadow-[#C8A84E]/20'
              : 'text-[#E5C973] hover:text-white'
          }`}
        >
          <Radio size={12} className={isLive ? 'animate-pulse' : ''} />
          <span>⚡ LIVE iQOO DEVICE</span>
        </button>
      </div>

      {/* Live Device Telemetry HUD when Active */}
      {isLive && deviceStatus && (
        <div className="p-3 rounded-lg bg-black/80 border border-emerald-900/60 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-display font-bold text-white">
                {deviceStatus.deviceModel}
              </span>
            </div>
            <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              {deviceStatus.source === 'ADB_KERNEL_BRIDGE' ? 'ADB KERNEL BRIDGE' : 'DIRECT WEB SENSORS'}
            </span>
          </div>

          {/* Real Live Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center gap-1 text-neutral-400 text-[8px] uppercase">
                <Battery size={10} className="text-emerald-400" />
                <span>BATTERY</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {deviceStatus.batteryLevel}%
              </div>
              <div className="text-[7.5px] text-neutral-400">
                {deviceStatus.batteryCharging ? 'Charging' : 'Discharging'}
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center gap-1 text-neutral-400 text-[8px] uppercase">
                <Cpu size={10} className="text-[#C8A84E]" />
                <span>DISPLAY / FPS</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {deviceStatus.realFps} FPS
              </div>
              <div className="text-[7.5px] text-[#E5C973]">
                ±{deviceStatus.frameTimeVariance}ms frame var
              </div>
            </div>

            <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center gap-1 text-neutral-400 text-[8px] uppercase">
                <Wifi size={10} className="text-blue-400" />
                <span>TOUCH & NET</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {deviceStatus.touchSampleRate}Hz
              </div>
              <div className="text-[7.5px] text-neutral-400">
                {deviceStatus.inputJitter}ms jitter · {deviceStatus.networkLatency}ms
              </div>
            </div>
          </div>

          <div className="text-[8.5px] font-mono text-neutral-400 flex items-center justify-between pt-0.5">
            <span>Real hardware readings feeding closed-loop intelligence</span>
            <span className="text-emerald-400">LIVE SYNCED</span>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#C8A84E] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 text-sm font-display font-bold text-white">
                <Smartphone size={16} className="text-[#C8A84E]" />
                <span>HOW LIVE iQOO DEVICE INGESTION WORKS</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 font-body leading-relaxed">
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-display font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Option A: Direct Mobile Browser (Zero Setup)</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Open this URL directly on your iQOO phone (<span className="text-[#E5C973]">http://&lt;your-pc-ip&gt;:5173</span>).
                  VYRA automatically samples your phone&apos;s real battery level, charging velocity, display refresh rate, touch jitter, and network latency!
                </p>
              </div>

              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-display font-bold text-white flex items-center gap-1.5">
                  <Terminal size={13} className="text-[#C8A84E]" />
                  <span>Option B: USB / Wi-Fi ADB Kernel Bridge</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  Plug your iQOO phone into your computer via USB with USB Debugging enabled, and run:
                </p>
                <div className="p-2 rounded bg-black border border-neutral-800 font-mono text-[10px] text-[#E5C973]">
                  npm run bridge
                </div>
                <p className="text-neutral-400 text-[11px]">
                  This queries real-time battery thermistors, CPU core clocks, GPU load, and SurfaceFlinger frame pacing directly from the Android kernel!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-[#C8A84E] text-black font-display font-bold text-xs py-2.5 rounded-lg hover:bg-[#E5C973] transition-colors"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
