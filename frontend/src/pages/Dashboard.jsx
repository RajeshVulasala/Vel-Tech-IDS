import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, Network } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const StatCard = ({ title, value, icon, trend, danger }) => (
  <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${danger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
    </div>
    <div className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {trend >= 0 ? '+' : ''}{trend}% from last hour
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${danger ? 'bg-danger' : 'bg-primary'}`}></div>
  </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        active_models: 0,
        processed_packets: 0,
        threats_detected: 0,
        system_load: '0%'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (e) {
                console.error("Dashboard hit a snag", e);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 3000);
        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
        <p className="text-gray-400">Real-time statistics and model health status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Models" value={stats.active_models} icon={<Cpu size={24} />} trend={0} />
        <StatCard title="Processed Packets" value={stats.processed_packets} icon={<Network size={24} />} trend={12.5} />
        <StatCard title="Threats Detected" value={stats.threats_detected} icon={<ShieldAlert size={24} />} trend={24.1} danger />
        <StatCard title="System Load" value={stats.system_load} icon={<Activity size={24} />} trend={-4.3} />
      </div>

      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Network Traffic vs Alerts</h2>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.history || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-dark-panel)', borderColor: 'var(--color-dark-border)', borderRadius: '8px' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="traffic" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorTraffic)" />
              <Area type="monotone" dataKey="alerts" stroke="var(--color-danger)" fillOpacity={1} fill="url(#colorAlerts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
