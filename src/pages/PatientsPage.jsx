import { useMedical } from '../context/MedicalContext.jsx';
import { useNavigate } from 'react-router-dom';
import { BedDouble, ArrowRight, Users } from 'lucide-react';
import { motion } from 'motion/react';

const STATUS_STYLES = {
  Stable:               { bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700' },
  Critical:             { bar: 'bg-error',       badge: 'bg-red-100 text-red-700' },
  'Stable (Recovering)':{ bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700' },
  Observation:          { bar: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
};

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('');
}

export default function PatientsPage() {
  const { patients, setSelectedPatientId } = useMedical();
  const navigate = useNavigate();

  function goToPatient(id) {
    setSelectedPatientId(id);
    navigate('/');
  }

  return (
    <div className="flex-1 pt-[76px] pb-16 lg:pb-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-5">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary-brand" />
            <h1 className="text-xl font-black text-on-surface tracking-tight">All Patients</h1>
          </div>
          <p className="text-xs text-outline">Click on any patient to open their dashboard.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p, i) => {
            const styles = STATUS_STYLES[p.status] || STATUS_STYLES['Stable'];
            const initials = getInitials(p.name);
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => goToPatient(p.id)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-outline-variant/15 shadow-sm hover:shadow-lg hover:shadow-primary-brand/8 hover:border-primary-brand/25 hover:-translate-y-0.5 transition-all text-left overflow-hidden group"
              >
                {/* Color stripe */}
                <div className={`h-1 w-full ${styles.bar}`} />

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-primary-brand/10 text-primary-brand flex items-center justify-center font-black text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-on-surface truncate">{p.name}</h3>
                      <p className="text-[10px] text-outline font-medium">MRN {p.mrn}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 bg-surface-container-low rounded-lg px-2 py-1.5">
                      <BedDouble className="w-3 h-3 text-outline" />
                      <span className="text-[10px] font-bold text-on-surface">Room {p.room}</span>
                    </div>
                    <div className="bg-surface-container-low rounded-lg px-2 py-1.5">
                      <p className="text-[8px] text-outline uppercase font-bold">Vitals</p>
                      <p className="text-[10px] font-bold text-on-surface">{p.vitals}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${styles.badge}`}>
                      {p.status}
                    </span>
                    <span className="text-[9px] text-primary-brand font-bold group-hover:underline flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
