import { Zap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function UserFeelsNothingCard() {
  return (
    <div className="bg-vyra-surface border border-vyra-border rounded-md p-4 animate-fade-in">
      <div className="flex items-center gap-1.5 mb-3">
        <Zap size={14} className="text-vyra-gold" strokeWidth={1.5} />
        <span className="text-[10px] tracking-[0.2em] text-vyra-gold font-display font-medium">
          PREEMPTIVE ADVANTAGE
        </span>
      </div>

      <h3 className="font-display text-sm font-semibold text-vyra-white mb-1.5">
        &ldquo;USER FEELS NOTHING&rdquo; ARCHITECTURE
      </h3>
      <p className="text-[11px] text-vyra-muted font-body mb-4 leading-relaxed">
        Traditional phones react after performance drops. VYRA intercepts degradation before frame delivery degrades.
      </p>

      {/* Side-by-side Flow Comparison */}
      <div className="space-y-3 font-mono text-[10px]">
        {/* WITHOUT VYRA */}
        <div className="p-3 rounded bg-[#1C1214] border border-[#441C20]">
          <div className="flex items-center gap-1.5 text-vyra-red font-bold mb-2">
            <AlertCircle size={11} />
            TRADITIONAL PHONES (REACTIVE)
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-vyra-muted">
            <span className="text-vyra-text">Thermal climb</span>
            <ArrowRight size={10} />
            <span className="text-vyra-red">Hardware throttle</span>
            <ArrowRight size={10} />
            <span className="text-vyra-red font-bold">FPS drops & stutters</span>
            <ArrowRight size={10} />
            <span className="text-vyra-amber">User notices</span>
            <ArrowRight size={10} />
            <span>Manual mode change</span>
          </div>
        </div>

        {/* WITH VYRA */}
        <div className="p-3 rounded bg-[#0E1F14] border border-[#1E4E2C]">
          <div className="flex items-center gap-1.5 text-vyra-green font-bold mb-2">
            <ShieldCheck size={11} />
            iQOO VYRA (PREEMPTIVE INTELLIGENCE)
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-vyra-muted">
            <span className="text-vyra-text">Thermal slope</span>
            <ArrowRight size={10} />
            <span className="text-vyra-gold font-bold">Pattern recognized</span>
            <ArrowRight size={10} />
            <span className="text-vyra-gold font-bold">Risk predicted</span>
            <ArrowRight size={10} />
            <span className="text-vyra-green font-bold">Preemptive pacing</span>
            <ArrowRight size={10} />
            <span className="text-vyra-green font-bold">Zero perceived drop</span>
          </div>
        </div>
      </div>

      {/* Conceptual Positioning Statement (Requirement 15) */}
      <div className="mt-4 pt-3 border-t border-vyra-border/50 text-center">
        <div className="text-[10px] font-display font-bold tracking-[0.18em] text-vyra-gold uppercase leading-relaxed">
          &ldquo;VYRA DOESN&rsquo;T WAIT FOR PERFORMANCE TO DROP.<br />
          IT LEARNS THE PATTERN BEFORE THE DROP.&rdquo;
        </div>
      </div>
    </div>
  );
}
