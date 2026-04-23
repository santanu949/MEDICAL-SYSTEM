import { Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMedical } from '../../context/MedicalContext.jsx';

const TYPE_CFG = {
  completed: { dot: 'bg-primary-brand',  ring: 'ring-primary-brand/20',  label: 'text-primary-brand',  bg: 'bg-primary-brand/6'  },
  started:   { dot: 'bg-amber-500',      ring: 'ring-amber-200',         label: 'text-amber-600',      bg: 'bg-amber-50/60'       },
  created:   { dot: 'bg-slate-400',      ring: 'ring-slate-200',         label: 'text-slate-500',      bg: 'bg-slate-50/60'       },
  delayed:   { dot: 'bg-red-500',        ring: 'ring-red-200',           label: 'text-red-600',        bg: 'bg-red-50/60'         },
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Timeline() {
  const { patientTimeline } = useMedical();

  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-primary-brand/10 flex items-center justify-center">
          <Timer className="w-3.5 h-3.5 text-primary-brand" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          Clinical Timeline
        </h3>
        {patientTimeline.length > 0 && (
          <span className="ml-auto text-[9px] font-bold text-outline bg-surface-container px-2 py-0.5 rounded-full">
            {patientTimeline.length} events
          </span>
        )}
      </div>

      {/* Timeline list */}
      <div className="relative pl-5 space-y-0">
        {/* Vertical guide line */}
        {patientTimeline.length > 0 && (
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gradient-to-b from-outline-variant/40 via-outline-variant/20 to-transparent" />
        )}

        <AnimatePresence mode="popLayout">
          {patientTimeline.map((entry, i) => {
            const cfg   = TYPE_CFG[entry.type] || TYPE_CFG.created;
            const isNew = i === 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut', delay: isNew ? 0 : 0 }}
                className="relative pb-3 last:pb-0"
              >
                {/* Dot */}
                <div className={`
                  absolute -left-1 top-3 w-3.5 h-3.5 rounded-full border-2 border-white z-10 ring-2 shadow-sm
                  ${cfg.dot} ${cfg.ring}
                `} />

                {/* Card */}
                <div
                  className={`ml-3 rounded-xl px-3.5 py-2.5 border border-white/70 transition-shadow hover:shadow-sm ${cfg.bg}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${cfg.label}`}>
                      {entry.type}
                    </span>
                    <span className="text-[9px] text-outline font-medium tabular-nums">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-on-surface leading-snug">
                    {entry.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {patientTimeline.length === 0 && (
          <div className="text-center py-10">
            <Timer className="w-8 h-8 text-outline/25 mx-auto mb-2" />
            <p className="text-xs text-outline font-medium">No activity recorded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
