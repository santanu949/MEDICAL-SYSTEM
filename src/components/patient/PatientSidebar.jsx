import { Search, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';
import { useMedical } from '../../context/MedicalContext.jsx';

const STATUS_STYLES = {
  Stable:               'bg-emerald-100 text-emerald-700',
  Critical:             'bg-red-100 text-red-700',
  'Stable (Recovering)':'bg-blue-100 text-blue-700',
  Observation:          'bg-amber-100 text-amber-700',
};

const STATUS_DOT = {
  Stable:               'bg-emerald-400',
  Critical:             'bg-red-500 animate-pulse',
  'Stable (Recovering)':'bg-blue-400',
  Observation:          'bg-amber-400',
};

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('');
}

function formatAdmit(ts) {
  if (!ts) return '—';
  const h = Math.floor((Date.now() - ts) / 3600000);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export default function PatientSidebar() {
  const { patients, selectedPatientId, setSelectedPatientId } = useMedical();
  const [query, setQuery] = useState('');

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.room.includes(query) ||
    p.mrn.includes(query)
  );

  const totalCritical = patients.filter((p) => p.status === 'Critical').length;
  const totalStable   = patients.filter((p) => p.status === 'Stable').length;

  return (
    <aside className="w-full lg:w-72 bg-white/70 backdrop-blur-sm border-r border-outline-variant/15 flex flex-col h-[34vh] lg:h-full shrink-0">

      {/* ── Header ── */}
      <div className="p-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-primary-brand/10 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary-brand" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ward Overview</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { label: 'Total',    value: patients.length,  cls: 'text-on-surface',  ring: 'ring-outline-variant/30' },
            { label: 'Critical', value: totalCritical,    cls: 'text-red-600',     ring: 'ring-red-200'            },
            { label: 'Stable',   value: totalStable,      cls: 'text-emerald-600', ring: 'ring-emerald-200'        },
          ].map(({ label, value, cls, ring }) => (
            <div key={label} className={`text-center p-2.5 bg-white rounded-xl border border-outline-variant/15 ring-1 ${ring} shadow-sm`}>
              <div className={`text-lg font-black ${cls}`}>{value}</div>
              <div className="text-[8px] font-bold text-outline uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-outline" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients…"
            className="w-full bg-white pl-9 pr-3 py-2.5 text-xs rounded-xl border border-outline-variant/25 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all placeholder:text-outline/50 shadow-sm"
          />
        </div>
      </div>

      {/* ── Patient List ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <p className="text-[8px] font-black text-outline uppercase tracking-widest px-1 mb-2">
          All Patients ({filtered.length})
        </p>

        {filtered.map((p) => {
          const isSelected = p.id === selectedPatientId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`
                w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 group
                ${isSelected
                  ? 'bg-primary-brand/8 border-primary-brand/20 shadow-sm'
                  : 'border-transparent hover:bg-white hover:border-outline-variant/20 hover:shadow-sm'
                }
              `}
            >
              {/* Avatar */}
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all
                ${isSelected
                  ? 'bg-gradient-to-br from-primary-brand to-primary-brand/70 text-white shadow-md shadow-primary-brand/25'
                  : 'bg-surface-container text-on-surface-variant group-hover:bg-primary-brand/8 group-hover:text-primary-brand'
                }
              `}>
                {getInitials(p.name)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className={`font-bold text-sm truncate ${isSelected ? 'text-primary-brand' : 'text-on-surface'}`}>
                  {p.name}
                </p>
                <p className="text-[10px] text-outline font-medium truncate">
                  Room {p.room} · {p.mrn}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[p.status] || 'bg-outline'}`} />
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${STATUS_STYLES[p.status] || 'bg-surface-container text-outline'}`}>
                    {p.status}
                  </span>
                  <span className="text-[9px] text-outline">{formatAdmit(p.admittedAt)}</span>
                </div>
              </div>

              {isSelected && <ChevronRight className="w-3.5 h-3.5 text-primary-brand shrink-0" />}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-outline text-xs">
            No patients match your search.
          </div>
        )}
      </div>
    </aside>
  );
}
