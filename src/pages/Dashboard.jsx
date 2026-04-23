import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedical } from '../context/MedicalContext.jsx';
import PatientSidebar from '../components/patient/PatientSidebar.jsx';
import PatientHero from '../components/patient/PatientHero.jsx';
import Timeline from '../components/timeline/Timeline.jsx';
import TaskPanel from '../components/tasks/TaskPanel.jsx';
import CreateTaskModal from '../components/tasks/CreateTaskModal.jsx';
import NotificationToast from '../components/notifications/NotificationToast.jsx';

export default function Dashboard() {
  const { role, setShowCreateTask } = useMedical();

  return (
    <>
      <div className="flex-1 pt-[72px] pb-16 lg:pb-0 flex flex-col lg:flex-row h-screen overflow-hidden">

        {/* Sidebar */}
        <PatientSidebar />

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* Hero card */}
          <div className="m-3 mb-0 rounded-2xl overflow-hidden shadow-sm border border-white/70">
            <PatientHero />
          </div>

          {/* Content grid */}
          <div className="p-3 grid grid-cols-1 xl:grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4 border border-white/70 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)' }}
            >
              <Timeline />
            </div>
            <div
              className="rounded-2xl p-4 border border-white/70 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)' }}
            >
              <TaskPanel />
            </div>
          </div>
        </main>
      </div>

      {/* Doctor FAB */}
      {role === 'Doctor' && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowCreateTask(true)}
          className="lg:hidden fixed bottom-20 right-4 w-13 h-13 text-white rounded-2xl shadow-xl flex items-center justify-center z-[70]"
          style={{ background: 'linear-gradient(135deg,#005f87,#0097c4)', boxShadow: '0 8px 24px rgba(0,95,135,0.35)' }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      <CreateTaskModal />
      <NotificationToast />
    </>
  );
}
