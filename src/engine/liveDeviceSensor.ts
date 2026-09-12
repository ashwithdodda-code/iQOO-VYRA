import { Telemetry, InputTelemetry, NetworkStability } from '../types';

export interface LiveDeviceStatus {
  isLiveDeviceActive: boolean;
  deviceModel: string;
  source: 'ADB_KERNEL_BRIDGE' | 'DEVICE_WEB_SENSORS' | 'PHONE_WIRELESS_SYNC' | 'SIMULATION';
  batteryConnected: boolean;
  batteryLevel: number;
  batteryCharging: boolean;
  displayRefreshRate: number;
  realFps: number;
  frameTimeVariance: number;
  networkLatency: number;
  networkType: string;
  touchSampleRate: number;
  inputJitter: number;
  isMobileTransmitter?: boolean;
  phoneLinked?: boolean;
}

class LiveDeviceSensorManager {
  private isLiveActive: boolean = false;
  private deviceModel: string = 'iQOO Device';
  private source: 'ADB_KERNEL_BRIDGE' | 'DEVICE_WEB_SENSORS' | 'PHONE_WIRELESS_SYNC' | 'SIMULATION' = 'SIMULATION';
  private phoneLinked: boolean = false;
  private isMobile: boolean = false;
  
  // Real sensor state
  private batteryLevel: number = 80;
  private batteryCharging: boolean = false;
  private batteryVoltage: number = 4150;
  private realFps: number = 120;
  private frameTimeVariance: number = 1.2;
  private networkLatency: number = 25;
  private networkType: string = '4G / Wi-Fi';
  private networkStability: NetworkStability = 'HIGH';
  private touchSampleRate: number = 300;
  private inputJitter: number = 1.1;
  private touchStability: number = 99.4;
  private memoryUsage: number = 55;

  // Frame timing
  private lastFrameTime: number = performance.now();
  private frameTimes: number[] = [];
  private rafId: number | null = null;

  // Touch timing
  private touchTimestamps: number[] = [];

  // Polling / broadcast timers
  private bridgeTimer: ReturnType<typeof setInterval> | null = null;
  private broadcastTimer: ReturnType<typeof setInterval> | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.detectClientType();
    this.detectDeviceModel();
    this.initWebSensors();
    this.initSyncSystem();
  }

  private detectClientType() {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    this.isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (typeof window !== 'undefined' && 'ontouchstart' in window);
  }

  private detectDeviceModel() {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/iQOO/i.test(ua)) {
      const match = ua.match(/iQOO\s*([A-Za-z0-9\s]+)/i);
      this.deviceModel = match ? `iQOO ${match[1].trim()}` : 'iQOO Smartphone';
    } else if (/vivo/i.test(ua)) {
      this.deviceModel = 'iQOO / Vivo Smartphone';
    } else if (/Android/i.test(ua)) {
      this.deviceModel = 'iQOO Mobile (OriginOS/Android)';
    } else {
      this.deviceModel = 'iQOO 12 (Snapdragon 8 Gen 3)';
    }
  }

  private initWebSensors() {
    if (typeof window === 'undefined') return;

    // 1. Real Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery?.().then((battery: any) => {
        this.updateBattery(battery);
        battery.addEventListener('levelchange', () => this.updateBattery(battery));
        battery.addEventListener('chargingchange', () => this.updateBattery(battery));
      }).catch(() => {});
    }

    // 2. Real Network Information API
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      this.updateNetwork(conn);
      conn.addEventListener('change', () => this.updateNetwork(conn));
    }

    // 3. Real Frame Pacing & Display Refresh Rate via requestAnimationFrame
    const measureFrame = (now: number) => {
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      if (delta > 0 && delta < 100) {
        this.frameTimes.push(delta);
        if (this.frameTimes.length > 60) this.frameTimes.shift();

        // Calculate average FPS
        const avgDelta = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        this.realFps = Math.min(144, Math.max(30, Math.round(1000 / avgDelta)));

        // Calculate standard deviation (frame-time variance in ms)
        const variance = this.frameTimes.reduce((sum, val) => sum + Math.pow(val - avgDelta, 2), 0) / this.frameTimes.length;
        this.frameTimeVariance = Math.round(Math.sqrt(variance) * 10) / 10;
      }

      this.rafId = requestAnimationFrame(measureFrame);
    };
    this.rafId = requestAnimationFrame(measureFrame);

    // 4. Real Touch & Input Jitter Tracker
    const handleTouch = () => {
      const now = performance.now();
      this.touchTimestamps.push(now);
      if (this.touchTimestamps.length > 20) this.touchTimestamps.shift();

      if (this.touchTimestamps.length > 2) {
        const intervals: number[] = [];
        for (let i = 1; i < this.touchTimestamps.length; i++) {
          intervals.push(this.touchTimestamps[i] - this.touchTimestamps[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        if (avgInterval > 0) {
          this.touchSampleRate = Math.min(1000, Math.max(120, Math.round(1000 / avgInterval)));
        }
        const jitVar = intervals.reduce((sum, v) => sum + Math.pow(v - avgInterval, 2), 0) / intervals.length;
        this.inputJitter = Math.min(6.0, Math.max(0.6, Math.round(Math.sqrt(jitVar) * 10) / 10));
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('pointerdown', handleTouch, { passive: true });
  }

  private updateBattery(battery: any) {
    this.batteryLevel = Math.round((battery.level || 0.8) * 100);
    this.batteryCharging = Boolean(battery.charging);
  }

  private updateNetwork(conn: any) {
    if (conn.rtt) {
      this.networkLatency = conn.rtt;
      this.networkStability = conn.rtt < 50 ? 'HIGH' : conn.rtt < 120 ? 'MEDIUM' : 'LOW';
    }
    if (conn.effectiveType) {
      this.networkType = conn.effectiveType.toUpperCase();
    }
  }

  // Wireless Phone <-> Laptop Sync and ADB Fallback
  private initSyncSystem() {
    if (typeof window === 'undefined') return;

    if (this.isMobile) {
      // MOBILE DEVICE: Broadcast hardware sensors to laptop dashboard
      this.source = 'DEVICE_WEB_SENSORS';
      this.broadcastTimer = setInterval(() => this.broadcastPhoneTelemetry(), 750);
      this.broadcastPhoneTelemetry();
    } else {
      // LAPTOP / DESKTOP: Poll for live mobile phone connection
      this.syncTimer = setInterval(() => this.checkPhoneSync(), 800);
      this.checkPhoneSync();
      this.checkAdbBridge();
    }
  }

  // Transmit real phone sensors over LAN
  private async broadcastPhoneTelemetry() {
    try {
      const payload = {
        deviceModel: this.deviceModel,
        batteryLevel: this.batteryLevel,
        batteryCharging: this.batteryCharging,
        batteryVoltage: this.batteryVoltage,
        realFps: this.realFps,
        frameTimeVariance: this.frameTimeVariance,
        touchSampleRate: this.touchSampleRate,
        inputJitter: this.inputJitter,
        touchStability: this.touchStability,
        networkLatency: this.networkLatency,
        networkType: this.networkType,
        networkStability: this.networkStability,
        timestamp: Date.now(),
      };

      await fetch('/api/sync-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1000),
      });
    } catch {}
  }

  // Check if a live phone is broadcasting
  private async checkPhoneSync() {
    try {
      const res = await fetch('/api/sync-phone', { signal: AbortSignal.timeout(800) });
      if (res.ok) {
        const data = await res.json();
        if (data.connected && data.telemetry) {
          const t = data.telemetry;
          this.phoneLinked = true;
          this.source = 'PHONE_WIRELESS_SYNC';
          this.deviceModel = t.deviceModel || 'iQOO Phone';
          this.batteryLevel = t.batteryLevel ?? this.batteryLevel;
          this.batteryCharging = Boolean(t.batteryCharging);
          this.batteryVoltage = t.batteryVoltage ?? this.batteryVoltage;
          this.realFps = t.realFps ?? this.realFps;
          this.frameTimeVariance = t.frameTimeVariance ?? this.frameTimeVariance;
          this.touchSampleRate = t.touchSampleRate ?? this.touchSampleRate;
          this.inputJitter = t.inputJitter ?? this.inputJitter;
          this.touchStability = t.touchStability ?? this.touchStability;
          this.networkLatency = t.networkLatency ?? this.networkLatency;
          this.networkType = t.networkType ?? this.networkType;
          this.networkStability = t.networkStability ?? this.networkStability;
          
          // Auto-enable live mode when phone connects
          if (!this.isLiveActive) {
            this.isLiveActive = true;
          }
          return;
        }
      }
    } catch {}

    this.phoneLinked = false;
    if (this.source === 'PHONE_WIRELESS_SYNC' && !this.isMobile) {
      this.source = 'SIMULATION';
    }
  }

  // Poll local ADB bridge service if available
  private async checkAdbBridge() {
    try {
      const res = await fetch('http://localhost:8765/api/iqoo-device', { signal: AbortSignal.timeout(800) });
      if (res.ok) {
        const data = await res.json();
        if (data.connected && data.telemetry) {
          this.source = 'ADB_KERNEL_BRIDGE';
          this.deviceModel = data.device?.model || 'iQOO Device (ADB USB)';
          this.batteryLevel = data.telemetry.batteryLevel || this.batteryLevel;
          this.batteryVoltage = data.telemetry.batteryVoltage || this.batteryVoltage;
          this.memoryUsage = data.telemetry.memoryUsage || this.memoryUsage;
        }
      }
    } catch {}
  }

  public setLiveActive(active: boolean) {
    this.isLiveActive = active;
    if (active) {
      this.checkPhoneSync();
      this.checkAdbBridge();
    } else {
      this.source = 'SIMULATION';
    }
  }

  public isLiveDevice(): boolean {
    return this.isLiveActive;
  }

  public getStatus(): LiveDeviceStatus {
    return {
      isLiveDeviceActive: this.isLiveActive,
      deviceModel: this.deviceModel,
      source: this.source,
      batteryConnected: true,
      batteryLevel: this.batteryLevel,
      batteryCharging: this.batteryCharging,
      displayRefreshRate: this.realFps > 100 ? 120 : 60,
      realFps: this.realFps,
      frameTimeVariance: this.frameTimeVariance,
      networkLatency: this.networkLatency,
      networkType: this.networkType,
      touchSampleRate: this.touchSampleRate,
      inputJitter: this.inputJitter,
      isMobileTransmitter: this.isMobile,
      phoneLinked: this.phoneLinked,
    };
  }

  public sampleLiveTelemetry(): Telemetry {
    // Memory from performance.memory if supported
    let mem = this.memoryUsage;
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const pmem = (performance as any).memory;
      if (pmem.totalJSHeapSize > 0) {
        mem = Math.min(90, Math.max(35, Math.round((pmem.usedJSHeapSize / pmem.totalJSHeapSize) * 100)));
      }
    }

    const inputTelem: InputTelemetry = {
      touchStability: this.touchStability,
      inputJitter: this.inputJitter,
      touchSampleRate: this.touchSampleRate,
      gestureLatency: Math.round(this.frameTimeVariance * 3.2 * 10) / 10,
      triggerConsistency: 99.4,
    };

    // Realistic thermal estimation based on discharge & compute intensity
    const baseThermal = 34.5;
    const computeFactor = (mem / 100) * 2.5;
    const batteryThermalFactor = this.batteryCharging ? 2.0 : 0.5;
    const estThermal = Math.round((baseThermal + computeFactor + batteryThermalFactor) * 10) / 10;

    return {
      timestamp: Date.now(),
      fps: this.realFps,
      fpsStability: Math.min(100, Math.max(85, Math.round((1 - (this.frameTimeVariance / 32)) * 100))),
      frameTimeVariance: this.frameTimeVariance,
      thermalTemp: estThermal,
      thermalRateOfRise: 0.12,
      batteryLevel: this.batteryLevel,
      networkStability: this.networkStability,
      cpuUsage: Math.min(95, Math.max(25, Math.round(mem * 0.8 + 10))),
      gpuUsage: Math.min(95, Math.max(20, Math.round(this.realFps > 90 ? 65 : 42))),
      memoryUsage: mem,
      inputTelemetry: inputTelem,
    };
  }
}

export const liveDeviceSensor = new LiveDeviceSensorManager();
