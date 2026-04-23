import { Hospital, Bell, LayoutDashboard, Users, ClipboardCheck, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useMedical } from '../../context/MedicalContext.jsx';

const ROLES = ['Doctor', 'Nurse', 'Lab'];

const NAV_LINKS = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients',  icon: Users           },
  { to: '/tasks',    label: 'Tasks',     icon: ClipboardCheck  },
];

const ROLE_COLORS = {
  Doctor: 'text-primary-brand',
  Nurse:  'text-emerald-600',
  Lab:    'text-violet-600',
};

export default function Navbar() {
  const { role, setRole, unreadNotifications } = useMedical();
  const { pathname } = useLocation();
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-3 pointer-events-none">
      <header
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
        className="
          pointer-events-auto w-full max-w-5xl
          border border-white/60
          rounded-2xl
          px-3 py-2
          flex items-center justify-between gap-2
        "
      >

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #005f87 0%, #0097c4 100%)' }}
          >
            <Hospital className="text-white w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-black tracking-tight text-on-surface leading-none">ClinicalOS</p>
            <p className="text-[7.5px] font-bold text-outline uppercase tracking-[0.12em] leading-none mt-0.5">
              Medical System
            </p>
          </div>
        </Link>

        {/* ── Nav links ── */}
        <nav className="hidden md:flex items-center rounded-xl p-1 gap-0.5"
          style={{ background: 'rgba(0,0,0,0.04)' }}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold tracking-wide
                  ${active
                    ? 'bg-primary-brand text-white shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/70'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-1.5">

          {/* Role dropdown (more refined than 3 buttons) */}
          <div className="relative">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all hover:bg-surface-container"
              style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(0,0,0,0.08)' }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                role === 'Doctor' ? 'bg-primary-brand' :
                role === 'Nurse'  ? 'bg-emerald-500' : 'bg-violet-500'
              }`} />
              <span className={`font-bold ${ROLE_COLORS[role]}`}>{role}</span>
              <ChevronDown className="w-3 h-3 text-outline" />
            </button>

            {roleOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-36 rounded-xl overflow-hidden border border-white/60 z-[200]"
                style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              >
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setRoleOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-left hover:bg-surface-container transition-colors ${
                      r === role ? 'bg-primary-brand/6' : ''
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      r === 'Doctor' ? 'bg-primary-brand' :
                      r === 'Nurse'  ? 'bg-emerald-500'   : 'bg-violet-500'
                    }`} />
                    <span className={r === role ? ROLE_COLORS[r] : 'text-on-surface-variant'}>{r}</span>
                    {r === role && <span className="ml-auto text-[8px] font-black text-primary-brand uppercase tracking-wider">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bell */}
          <button
            className="relative w-8 h-8 rounded-xl flex items-center justify-center hover:bg-surface-container border border-transparent hover:border-outline-variant/20"
            style={{ background: 'rgba(255,255,255,0.6)' }}
          >
            <Bell className="w-4 h-4 text-on-surface-variant" strokeWidth={2} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-[1.5px] ring-white" />
            )}
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-outline-variant/30 mx-0.5" />

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <img
              src="https://picsum.photos/seed/doctor/64/64"
              alt="Dr. Johnson"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-xl object-cover ring-2 ring-primary-brand/15 shadow-sm"
            />
            <div className="hidden lg:block pr-1">
              <p className="text-[11px] font-bold text-on-surface leading-none">Dr. Johnson</p>
              <p className={`text-[9px] font-semibold mt-0.5 ${ROLE_COLORS[role]}`}>{role}</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
