import { Routes, Route } from 'react-router-dom';
import { MedicalProvider } from './context/MedicalContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import MobileFooter from './components/layout/MobileFooter.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';

export default function App() {
  return (
    <MedicalProvider>
      <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">

        {/* Top Navigation */}
        <Navbar />

        {/* Page Content — routed */}
        <div className="flex flex-1 overflow-hidden">
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/tasks"    element={<TasksPage />} />
            {/* fallback */}
            <Route path="*"         element={<Dashboard />} />
          </Routes>
        </div>

        {/* Mobile Bottom Nav */}
        <MobileFooter />
      </div>
    </MedicalProvider>
  );
}
