import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Database, Cpu, TestTube, PieChart, ShieldAlert } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DatasetUpload from './pages/DatasetUpload';
import ModelTraining from './pages/ModelTraining';
import ModelTesting from './pages/ModelTesting';
import EvaluationResults from './pages/EvaluationResults';
import LiveInterface from './pages/LiveInterface';
import LiveTracking from './pages/LiveTracking';
import Preprocessing from './pages/Preprocessing';
import AlertsLogs from './pages/AlertsLogs';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <PieChart size={20} /> },
    { name: 'Dataset Upload', path: '/dataset-upload', icon: <Database size={20} /> },
    { name: 'Preprocessing', path: '/preprocessing', icon: <Activity size={20} /> },
    { name: 'Model Training', path: '/model-training', icon: <Cpu size={20} /> },
    { name: 'Model Testing', path: '/model-testing', icon: <TestTube size={20} /> },
    { name: 'Evaluation / Analytics', path: '/evaluation', icon: <Activity size={20} /> },
    { name: 'Live Interface', path: '/live-interface', icon: <Activity size={20} /> },
    { name: 'Live Tracking', path: '/live-tracking', icon: <ShieldAlert size={20} /> },
    { name: 'Alerts / Logs', path: '/alerts-logs', icon: <Database size={20} /> },
  ];

  return (
    <div className="w-64 glass-panel border-y-0 border-l-0 min-h-screen flex flex-col pt-8 px-4 sticky top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <ShieldAlert className="text-primary glow-text" size={28} />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Vel Tech IDS</h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-[var(--color-primary)]/20 text-blue-300 border border-[var(--color-primary)]/30 shadow-[0_0_10px_rgba(88,166,255,0.2)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pb-6 px-2">
         <div className="glass-card p-4 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity"></div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">System Status</p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
              <span className="text-sm text-green-400">All Systems Nominal</span>
            </div>
         </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[var(--color-dark-bg)]">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto w-full relative">
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-primary opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[200px] w-96 h-96 bg-accent opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto z-10 relative">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dataset-upload" element={<DatasetUpload />} />
                <Route path="/preprocessing" element={<Preprocessing />} />
                <Route path="/model-training" element={<ModelTraining />} />
                <Route path="/model-testing" element={<ModelTesting />} />
                <Route path="/evaluation" element={<EvaluationResults />} />
                <Route path="/live-interface" element={<LiveInterface />} />
                <Route path="/live-tracking" element={<LiveTracking />} />
                <Route path="/alerts-logs" element={<AlertsLogs />} />
              </Routes>
            </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
