import { NavLink } from 'react-router-dom';
import { Activity, Timer, Sliders, Dna, BarChart3, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', label: 'VYRA', icon: Activity },
  { to: '/session', label: 'SESSION', icon: Timer },
  { to: '/advantage', label: 'ADVANTAGE', icon: Sparkles },
  { to: '/controls', label: 'CONTROLS', icon: Sliders },
  { to: '/dna', label: 'DNA', icon: Dna },
  { to: '/insights', label: 'INSIGHTS', icon: BarChart3 },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-vyra-dark/95 backdrop-blur-md border-t border-vyra-border z-50 md:hidden">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-1.5 py-1 transition-colors ${
                isActive ? 'text-vyra-gold' : 'text-vyra-muted hover:text-vyra-text'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.5} />
            <span className="text-[7.5px] tracking-[0.12em] font-display font-medium">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function SideNav() {
  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 bg-vyra-dark border-r border-vyra-border flex-col items-center py-8 z-50">
      <div className="font-display text-[10px] font-bold tracking-[0.2em] text-vyra-gold mb-10">
        V
      </div>
      <div className="flex flex-col gap-6 items-center">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded transition-colors ${
                isActive ? 'text-vyra-gold bg-vyra-surface' : 'text-vyra-muted hover:text-vyra-text'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.5} />
            <span className="text-[7px] tracking-[0.15em] font-display">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
