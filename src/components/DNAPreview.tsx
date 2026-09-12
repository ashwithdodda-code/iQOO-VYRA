import { PerformanceDNA } from '../types';
import { ChevronRight, Dna } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const levelColor = (level: string) => {
  if (level === 'HIGH') return 'text-vyra-gold';
  if (level === 'MEDIUM') return 'text-vyra-text';
  return 'text-vyra-muted';
};

const levelBar = (score: number) => (
  <div className="h-0.5 w-full bg-vyra-dark rounded-full overflow-hidden mt-1">
    <div className="h-full bg-vyra-gold rounded-full transition-all duration-700" style={{ width: `${score * 100}%` }} />
  </div>
);

export function DNAPreview({ dna }: { dna: PerformanceDNA }) {
  const navigate = useNavigate();
  const dimensions = [
    { label: 'COMPETITIVE PRIORITY', level: dna.competitivePriority.level, score: dna.competitivePriority.score },
    { label: 'THERMAL SENSITIVITY', level: dna.thermalSensitivity.level, score: dna.thermalSensitivity.score },
    { label: 'BATTERY PRIORITY', level: dna.batteryPriority.level, score: dna.batteryPriority.score },
    { label: 'NETWORK SENSITIVITY', level: dna.networkSensitivity.level, score: dna.networkSensitivity.score },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Dna size={14} className="text-vyra-gold" strokeWidth={1.5} />
        <span className="text-[10px] tracking-[0.2em] text-vyra-muted font-body">YOUR PERFORMANCE DNA</span>
      </div>

      <div className="space-y-3">
        {dimensions.map((dim) => (
          <div key={dim.label}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.1em] text-vyra-muted font-body">{dim.label}</span>
              <span className={`font-display text-xs font-semibold ${levelColor(dim.level)}`}>{dim.level}</span>
            </div>
            {levelBar(dim.score)}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dna')}
        className="flex items-center gap-1 mt-4 text-xs text-vyra-gold font-display font-medium hover:text-vyra-white transition-colors"
      >
        VIEW PERFORMANCE DNA
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
