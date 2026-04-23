import { Play, CheckCircle2, Clock3, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedical } from '../../context/MedicalContext.jsx';

// Normalise status — any string not in the map gets a fallback style
function getStatusStyle(status) {
  const s = (status || '').toLowerCase();
  if (s === 'completed')   return { bg: 'bg-emerald-50',  border: 'border-emerald-100', dot: 'bg-emerald-400', text: 'text-emerald-700'  };
  if (s === 'in progress') return { bg: 'bg-amber-50',    border: 'border-amber-100',   dot: 'bg-amber-400',   text: 'text-amber-700'    };
  if (s === 'delayed')     return { bg: 'bg-red-50',      border: 'border-red-200',     dot: 'bg-red-500 animate-pulse', text: 'text-red-700' };
  return                          { bg: 'bg-slate-50',    border: 'border-slate-100',   dot: 'bg-slate-400',   text: 'text-slate-600'    };
}

function getPriorityStyle(priority) {
  const p = (priority || '').toLowerCase();
  if (p === 'high'  || p === 'urgent'    ) return 'bg-red-100   text-red-700';
  if (p === 'medium'|| p === 'moderate'  ) return 'bg-amber-100 text-amber-700';
  if (p === 'low'   || p === 'routine'   ) return 'bg-sky-100   text-sky-700';
  return 'bg-surface-container text-outline';
}

export default function TaskCard({ task }) {
  const { role, updateTaskStatus } = useMedical();
  const canAct = role === task.assignedRole || role === 'Doctor';
  const isDone = (task.status || '').toLowerCase() === 'completed';
  const statusStyle = getStatusStyle(task.status);
  const isDelayed   = (task.status || '').toLowerCase() === 'delayed';
  const isInProg    = (task.status || '').toLowerCase() === 'in progress';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDone ? 0.55 : 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`
        relative rounded-2xl border overflow-hidden transition-shadow
        ${isDelayed
          ? 'border-red-200 shadow-sm shadow-red-50'
          : isDone
          ? 'border-outline-variant/10'
          : 'border-white/70 shadow-sm hover:shadow-md'
        }
      `}
      style={{ background: 'rgba(255,255,255,0.82)' }}
    >
      {/* colored left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusStyle.dot}`} />

      <div className="pl-4 pr-4 py-3.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold text-on-surface leading-snug ${isDone ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </h4>
            <p className="text-[10px] text-outline mt-0.5 font-medium">
              {task.assignedRole ? `${task.assignedRole} Unit` : 'Unassigned'}
            </p>
          </div>

          {/* Status pill */}
          <span className={`
            flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide
            px-2 py-1 rounded-lg border shrink-0
            ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {task.status}
          </span>
        </div>

        {/* Priority badge */}
        <div className="flex items-center gap-1.5">
          {task.priority && (
            <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
              {task.priority}
            </span>
          )}
        </div>

        {/* Action button */}
        {!isDone && canAct && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10">
            {(isDelayed || (!isInProg && !isDone)) ? (
              <button
                onClick={() => updateTaskStatus(task.id, 'In Progress')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #1a2a3a 0%, #334155 100%)' }}
              >
                <Play className="w-3 h-3 fill-white" /> Start Task
              </button>
            ) : (
              <button
                onClick={() => updateTaskStatus(task.id, 'Completed')}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #005f87 0%, #0097c4 100%)' }}
              >
                <CheckCircle2 className="w-3 h-3" /> Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
