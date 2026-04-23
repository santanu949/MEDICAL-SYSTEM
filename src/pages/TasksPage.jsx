import { useState } from 'react';
import { useMedical } from '../context/MedicalContext.jsx';
import { ClipboardCheck, Stethoscope, Microscope, UserCog } from 'lucide-react';
import { motion } from 'motion/react';

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-surface-container-highest text-outline',
};
const STATUS_STYLES = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-amber-50 text-amber-700 border border-amber-200',
  Delayed: 'bg-red-100 text-red-700',
  Pending: 'bg-surface-container-highest text-outline',
};
const ROLE_ICON = { Nurse: Stethoscope, Lab: Microscope, Doctor: UserCog };

const TABS = ['All', 'Pending', 'In Progress', 'Completed', 'Delayed'];

export default function TasksPage() {
  const { tasks, patients, role, updateTaskStatus } = useMedical();
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All' ? tasks : tasks.filter((t) => t.status === activeTab);

  function getPatientName(id) {
    return patients.find((p) => p.id === id)?.name || 'Unknown';
  }

  return (
    <div className="flex-1 pt-[76px] pb-16 lg:pb-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-5">

        {/* Page Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-primary-brand" />
            <h1 className="text-xl font-black text-on-surface tracking-tight">All Tasks</h1>
          </div>
          <p className="text-xs text-outline">{tasks.length} total tasks across all patients.</p>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {TABS.map((tab) => {
            const count = tab === 'All' ? tasks.length : tasks.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                  ? 'bg-primary-brand text-white shadow-sm'
                  : 'bg-white border border-outline-variant/20 text-outline hover:text-on-surface hover:border-outline-variant/50'
                  }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {filtered.map((task, i) => {
            const Icon = ROLE_ICON[task.assignedRole] || UserCog;
            const canAct = role === task.assignedRole || role === 'Doctor';
            const isDone = task.status === 'Completed';

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white/80 backdrop-blur-sm p-4 rounded-2xl border shadow-sm transition-all ${task.status === 'Delayed' ? 'border-red-200 ring-1 ring-red-50' :
                  task.status === 'Completed' ? 'border-transparent opacity-55' :
                    'border-outline-variant/15 hover:shadow-md hover:border-outline-variant/30'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary-brand/5 text-primary-brand shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold text-on-surface ${isDone ? 'line-through opacity-60' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-outline font-medium">
                        {getPatientName(task.patientId)} · {task.assignedRole} Unit
                      </p>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${PRIORITY_STYLES[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${STATUS_STYLES[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isDone && canAct && (
                    <div className="shrink-0">
                      {task.status === 'Pending' || task.status === 'Delayed' ? (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'In Progress')}
                          className="text-[9px] font-black uppercase px-3 py-2 bg-on-surface text-white rounded-xl hover:bg-on-surface/90 transition-all active:scale-95"
                        >
                          Start
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="text-[9px] font-black uppercase px-3 py-2 bg-primary-brand text-white rounded-xl hover:bg-primary-brand/90 transition-all active:scale-95"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-outline text-xs">
              <ClipboardCheck className="w-10 h-10 text-outline/20 mx-auto mb-3" />
              No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} tasks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
