import { Link, useLocation } from 'react-router-dom';
import { Users, ClipboardCheck, LayoutDashboard } from 'lucide-react';

const NAV = [
  { to: '/',         label: 'Home',     icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users           },
  { to: '/tasks',    label: 'Tasks',    icon: ClipboardCheck  },
];

export default function MobileFooter() {
  const { pathname } = useLocation();

  return (
    <footer
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 px-4 pb-3 pt-0"
    >
      <div
        className="flex justify-around items-stretch rounded-2xl px-2 py-1.5 border border-white/60"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.10)',
        }}
      >
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all flex-1
                ${active ? 'text-primary-brand' : 'text-outline hover:text-on-surface'}
              `}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                active ? 'bg-primary-brand/10' : ''
              }`}>
                <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 1.75} />
              </div>
              <span className={`text-[9px] font-bold tracking-wide ${active ? '' : 'uppercase'}`}>
                {active ? label : label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
