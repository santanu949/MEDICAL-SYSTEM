import { X, ClipboardPlus, User, Venus, Mars, MapPin, Hash } from 'lucide-react';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMedical } from '../../context/MedicalContext.jsx';

const STATUS_BADGE = {
  Stable:               'bg-emerald-100 text-emerald-700',
  Critical:             'bg-red-100 text-red-700',
  'Stable (Recovering)':'bg-blue-100 text-blue-700',
  Observation:          'bg-amber-100 text-amber-700',
};

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-outline-variant/20 shadow-sm">
      <Icon className="w-3.5 h-3.5 text-primary-brand shrink-0" />
      <div>
        <p className="text-[8px] font-bold text-outline uppercase tracking-wider leading-none">{label}</p>
        <p className="text-xs font-bold text-on-surface leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function CreateTaskModal() {
  const { showCreateTask, setShowCreateTask, createTask, selectedPatient } = useMedical();
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createTask(fd.get('title'), fd.get('priority'), fd.get('role'));
    formRef.current?.reset();
  }

  if (!selectedPatient) return null;

  const initials  = selectedPatient.name.split(' ').map((n) => n[0]).join('');
  const statusCls = STATUS_BADGE[selectedPatient.status] || STATUS_BADGE['Stable'];
  const GenderIcon = selectedPatient.gender === 'Female' ? Venus : Mars;

  return (
    <AnimatePresence>
      {showCreateTask && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCreateTask(false)}
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10"
          >
            {/* ── Header ── */}
            <div className="px-6 pt-5 pb-4 flex items-center justify-between bg-gradient-to-r from-primary-brand/5 to-primary-brand/0 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-brand flex items-center justify-center shadow-sm">
                  <ClipboardPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-on-surface">New Clinical Task</h3>
                  <p className="text-[9px] text-outline font-semibold uppercase tracking-widest">Assign to clinical staff</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTask(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Patient Info ── */}
            <div className="px-6 pt-4 pb-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-outline mb-3">
                Patient Information
              </p>

              {/* Name + avatar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-brand to-primary-brand/70 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-on-surface truncate">{selectedPatient.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-outline">MRN {selectedPatient.mrn}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-lg ${statusCls}`}>
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pills */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <InfoPill icon={GenderIcon} label="Gender" value={selectedPatient.gender || '—'} />
                <InfoPill icon={User}       label="Age"    value={selectedPatient.age ? `${selectedPatient.age} yrs` : '—'} />
                <InfoPill icon={Hash}       label="Room"   value={`Room ${selectedPatient.room}`} />
              </div>

              {/* Residence */}
              <div className="flex items-start gap-2 bg-white rounded-xl px-3 py-2 border border-outline-variant/20 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-primary-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-[8px] font-bold text-outline uppercase tracking-wider leading-none">Residence</p>
                  <p className="text-xs font-bold text-on-surface mt-0.5">{selectedPatient.residence || '—'}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-dashed border-outline-variant/30 mb-3" />
            <p className="px-6 text-[9px] font-black uppercase tracking-widest text-outline mb-2">Task Details</p>

            {/* ── Form ── */}
            <form ref={formRef} onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">

              {/* Task Title */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-outline mb-1.5">
                  Task Title *
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Chest X-Ray, IV Drip, Blood Panel…"
                  className="w-full border border-outline-variant/25 rounded-xl px-3.5 py-3 text-sm text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all bg-surface-container-low/40"
                />
              </div>

              {/* Priority — FREE TEXT */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-outline mb-1.5">
                  Priority
                </label>
                <input
                  name="priority"
                  placeholder="e.g. High, Medium, Low, Urgent, Routine…"
                  defaultValue=""
                  className="w-full border border-outline-variant/25 rounded-xl px-3.5 py-3 text-sm text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all bg-surface-container-low/40"
                />
              </div>

              {/* Assign Unit — FREE TEXT */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-outline mb-1.5">
                  Assign Unit
                </label>
                <input
                  name="role"
                  placeholder="e.g. Nursing, Laboratory, Radiology, ICU…"
                  defaultValue=""
                  className="w-full border border-outline-variant/25 rounded-xl px-3.5 py-3 text-sm text-on-surface placeholder:text-outline/40 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all bg-surface-container-low/40"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-primary-brand text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary-brand/25 hover:bg-primary-brand/90 active:scale-[0.98] transition-all mt-1"
              >
                Dispatch Task →
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
