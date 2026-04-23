import { ClipboardCheck, Plus, Inbox } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useMedical } from '../../context/MedicalContext.jsx';
import TaskCard from './TaskCard.jsx';

export default function TaskPanel() {
  const { role, patientTasks, setShowCreateTask } = useMedical();
  const pending    = patientTasks.filter(t => t.status === 'Pending'     ).length;
  const inProgress = patientTasks.filter(t => t.status === 'In Progress' ).length;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-brand/10 flex items-center justify-center">
            <ClipboardCheck className="w-3.5 h-3.5 text-primary-brand" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Active Tasks
          </h3>
          {patientTasks.length > 0 && (
            <div className="flex items-center gap-1 ml-1">
              <span className="text-[9px] font-bold bg-primary-brand/10 text-primary-brand px-1.5 py-0.5 rounded-full">
                {patientTasks.length}
              </span>
              {inProgress > 0 && (
                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                  {inProgress} active
                </span>
              )}
            </div>
          )}
        </div>

        {role === 'Doctor' && (
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-1 text-[10px] font-bold text-white bg-primary-brand px-2.5 py-1.5 rounded-lg shadow-sm shadow-primary-brand/25 hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-3 h-3" /> New Task
          </button>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {patientTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </AnimatePresence>

        {patientTasks.length === 0 && (
          <div className="text-center py-10 rounded-2xl border-2 border-dashed border-outline-variant/25">
            <Inbox className="w-8 h-8 text-outline/25 mx-auto mb-2" />
            <p className="text-xs text-outline font-medium">No tasks for this patient.</p>
            {role === 'Doctor' && (
              <button
                onClick={() => setShowCreateTask(true)}
                className="mt-2 text-[10px] font-bold text-primary-brand hover:underline underline-offset-2"
              >
                + Create first task
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
