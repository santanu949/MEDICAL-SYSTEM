import { Thermometer, Droplets, Clock, BedDouble, Pencil, Check, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useMedical } from '../../context/MedicalContext.jsx';

const STATUS_CFG = {
  Stable:               { strip: 'from-emerald-400 to-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-400',              label: 'Stable'      },
  Critical:             { strip: 'from-red-400 to-red-500',         badge: 'bg-red-100 text-red-700 border-red-200',              dot: 'bg-red-500 animate-pulse',    label: 'Critical ⚠' },
  'Stable (Recovering)':{ strip: 'from-blue-400 to-blue-500',       badge: 'bg-blue-100 text-blue-700 border-blue-200',           dot: 'bg-blue-400',                 label: 'Recovering'  },
  Observation:          { strip: 'from-amber-400 to-amber-500',     badge: 'bg-amber-100 text-amber-700 border-amber-200',        dot: 'bg-amber-400',                label: 'Observation' },
};

function admitDuration(ts) {
  if (!ts) return '—';
  const h = Math.floor((Date.now() - ts) / 3600000);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

/* ── Room editor (unchanged logic, new look) ── */
function RoomEditor({ patientId, currentRoom }) {
  const { updatePatientRoom } = useMedical();
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(Number(currentRoom) || 1);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(Number(currentRoom) || 1); setEditing(false); }, [patientId, currentRoom]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function confirm() { updatePatientRoom(patientId, draft); setEditing(false); }
  function handleKey(e) { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') setEditing(false); }

  if (!editing) return (
    <VitalCard
      label="Room"
      value={currentRoom}
      icon={BedDouble}
      color="text-primary-brand"
      bg="bg-primary-brand/6 border-primary-brand/15"
      suffix={
        <button
          onClick={() => setEditing(true)}
          title="Edit room"
          className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-lg bg-primary-brand/10 text-primary-brand flex items-center justify-center hover:bg-primary-brand/20 transition-all"
        >
          <Pencil className="w-2.5 h-2.5" />
        </button>
      }
    />
  );

  return (
    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl border-2 border-primary-brand/30 bg-primary-brand/4">
      <p className="text-[8px] font-black uppercase tracking-widest text-primary-brand mb-2">Edit Room (1–100)</p>
      <div className="flex items-center gap-2 mb-2.5">
        <BedDouble className="w-3.5 h-3.5 text-primary-brand shrink-0" />
        <input
          ref={inputRef}
          type="number" min={1} max={100}
          value={draft}
          onChange={(e) => setDraft(Math.max(1, Math.min(100, Number(e.target.value))))}
          onKeyDown={handleKey}
          className="w-16 bg-white border border-primary-brand/25 rounded-xl px-2 py-1.5 text-sm font-black text-primary-brand text-center focus:outline-none focus:ring-2 focus:ring-primary-brand/30"
        />
        <span className="text-[10px] text-outline">/ 100</span>
      </div>
      <input
        type="range" min={1} max={100} value={draft}
        onChange={(e) => setDraft(Number(e.target.value))}
        className="w-full mb-2"
        style={{ background: `linear-gradient(to right,#005f87 ${draft}%,#dde2e8 ${draft}%)` }}
      />
      <div className="flex gap-1.5">
        <button onClick={confirm} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary-brand text-white text-[9px] font-bold uppercase rounded-xl hover:opacity-90 active:scale-95 transition-all">
          <Check className="w-3 h-3" /> Save
        </button>
        <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-[9px] font-bold uppercase text-outline border border-outline-variant/25 rounded-xl hover:bg-surface-container transition-all">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function VitalCard({ label, value, icon: Icon, color, bg, suffix }) {
  return (
    <div className={`group flex items-center gap-3 p-3.5 rounded-2xl border ${bg} transition-shadow hover:shadow-sm`}>
      <div className={`w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-bold text-outline uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-on-surface">{value}</p>
      </div>
      {suffix}
    </div>
  );
}

export default function PatientHero() {
  const { selectedPatient } = useMedical();
  if (!selectedPatient) return null;

  const cfg      = STATUS_CFG[selectedPatient.status] || STATUS_CFG['Stable'];
  const initials = selectedPatient.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-white overflow-hidden">
      {/* Top gradient status strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${cfg.strip}`} />

      <div className="p-5">
        {/* Patient identity row */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-5">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #005f87 0%, #0097c4 100%)' }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[9px] font-bold text-outline uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded-lg">
                Patient Dashboard
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight leading-none truncate">
              {selectedPatient.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] text-outline font-semibold">MRN {selectedPatient.mrn}</span>
              {selectedPatient.age && (
                <span className="text-[10px] text-outline font-semibold">· Age {selectedPatient.age}</span>
              )}
              <span className={`flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-lg border ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Vitals grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <RoomEditor patientId={selectedPatient.id} currentRoom={selectedPatient.room} />
          <VitalCard label="Temperature" value={selectedPatient.vitals}              icon={Thermometer} color="text-red-500"           bg="bg-red-50 border-red-100" />
          <VitalCard label="Blood Type"  value={selectedPatient.bloodType || '—'}    icon={Droplets}    color="text-violet-500"         bg="bg-violet-50 border-violet-100" />
          <VitalCard label="Admitted"    value={admitDuration(selectedPatient.admittedAt)} icon={Clock} color="text-slate-500"          bg="bg-slate-50 border-slate-100" />
        </div>
      </div>
    </div>
  );
}
