import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PATIENTS, INITIAL_TASKS, INITIAL_TIMELINE } from '../data/mockData.js';


// ─── Context ──────────────────────────────────────────────────
const MedicalContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────
export function MedicalProvider({ children }) {
  const [role, setRole] = useState('Doctor');
  const [selectedPatientId, setSelectedPatientId] = useState('1');
  const [patients, setPatients] = useState(PATIENTS);   // ← now mutable
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [notifications, setNotifications] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // ── Derived ──
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientTasks = tasks.filter((t) => t.patientId === selectedPatientId);
  const patientTimeline = timeline
    .filter((e) => e.patientId === selectedPatientId)
    .sort((a, b) => b.timestamp - a.timestamp);
  const unreadNotifications = notifications.filter((n) => !n.read);

  // ── Helpers ──
  const addTimelineEntry = useCallback((patientId, message, type) => {
    setTimeline((prev) => [
      {
        id: Math.random().toString(36).substr(2, 9),
        patientId,
        message,
        timestamp: Date.now(),
        type,
      },
      ...prev,
    ]);
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message,
        timestamp: Date.now(),
        read: false,
        type,
      },
      ...prev,
    ]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const createTask = useCallback(
    (title, priority, assignedRole) => {
      const newTask = {
        id: 't' + Date.now(),
        patientId: selectedPatientId,
        title,
        priority,
        assignedRole,
        status: 'Pending',
        createdAt: Date.now(),
      };
      setTasks((prev) => [...prev, newTask]);
      addTimelineEntry(selectedPatientId, `${title} created by Doctor`, 'created');
      addNotification(`New task assigned: ${title}`, 'info');
      setShowCreateTask(false);
    },
    [selectedPatientId, addTimelineEntry, addNotification]
  );

  const updateTaskStatus = useCallback(
    (taskId, newStatus) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          let msg = '';
          let type = 'completed';
          if (newStatus === 'In Progress') {
            msg = `${t.title} started by ${t.assignedRole}`;
            type = 'started';
          } else if (newStatus === 'Completed') {
            msg = `${t.title} completed by ${t.assignedRole}`;
            type = 'completed';
            addNotification(`Task completed: ${t.title}`, 'success');
          }
          addTimelineEntry(t.patientId, msg, type);
          return {
            ...t,
            status: newStatus,
            startedAt: newStatus === 'In Progress' ? Date.now() : t.startedAt,
            completedAt: newStatus === 'Completed' ? Date.now() : t.completedAt,
          };
        })
      );
    },
    [addTimelineEntry, addNotification]
  );

  // ── Update room number (1-100) ──
  const updatePatientRoom = useCallback((patientId, newRoom) => {
    const clamped = Math.max(1, Math.min(100, Number(newRoom)));
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, room: String(clamped) } : p))
    );
    addTimelineEntry(patientId, `Room changed to ${clamped}`, 'created');
    addNotification(`Room updated to ${clamped}`, 'info');
  }, [addTimelineEntry, addNotification]);

  // ── Auto delay detection ──
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.status === 'Pending' && Date.now() - t.createdAt > 30000) {
            addNotification(`Task Delayed: ${t.title}`, 'error');
            addTimelineEntry(t.patientId, `${t.title} exceeded response threshold`, 'delayed');
            return { ...t, status: 'Delayed' };
          }
          return t;
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [addNotification, addTimelineEntry]);

  return (
    <MedicalContext.Provider
      value={{
        // State
        role, setRole,
        selectedPatientId, setSelectedPatientId,
        tasks, timeline, notifications,
        showCreateTask, setShowCreateTask,
        // Derived
        patients,
        selectedPatient,
        patientTasks,
        patientTimeline,
        unreadNotifications,
        // Actions
        createTask,
        updateTaskStatus,
        updatePatientRoom,
        addNotification,
        dismissNotification,
      }}
    >
      {children}
    </MedicalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────
export function useMedical() {
  const ctx = useContext(MedicalContext);
  if (!ctx) throw new Error('useMedical must be used inside <MedicalProvider>');
  return ctx;
}
