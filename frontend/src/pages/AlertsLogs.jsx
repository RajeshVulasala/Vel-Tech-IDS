import React, { useState, useEffect } from 'react';
import { Database, Download, Filter, Search, FileText } from 'lucide-react';

const AlertsLogs = () => {
   const [logs, setLogs] = useState([]);
   const [filter, setFilter] = useState('All');

   useEffect(() => {
       // Mock logs that would be fetched from database for previous alerts
       const dummyLogs = [
           { id: 1042, timestamp: new Date(Date.now() - 300000).toLocaleString(), type: 'DoS Hulk', severity: 'Critical', source: '192.168.1.45', target: '10.0.0.12' },
           { id: 1041, timestamp: new Date(Date.now() - 860000).toLocaleString(), type: 'PortScan', severity: 'High', source: '192.168.1.13', target: '10.0.0.8' },
           { id: 1040, timestamp: new Date(Date.now() - 1400000).toLocaleString(), type: 'FTP-Patator', severity: 'Medium', source: '172.16.0.4', target: '10.0.0.22' },
           { id: 1039, timestamp: new Date(Date.now() - 3600000).toLocaleString(), type: 'Web Attack - Brute Force', severity: 'Critical', source: '10.0.0.99', target: '10.0.0.15' },
           { id: 1038, timestamp: new Date(Date.now() - 8600000).toLocaleString(), type: 'DDoS', severity: 'Critical', source: 'Multiple', target: '10.0.0.1' },
       ];
       setLogs(dummyLogs);
   }, []);

   const displayedLogs = filter === 'All' ? logs : logs.filter(l => l.severity === filter);

   return (
       <div className="flex flex-col gap-8 animate-in fade-in duration-500">
           <div className="flex justify-between items-end">
               <div>
                  <h1 className="text-3xl font-bold mb-2">Alert Incident Logs</h1>
                  <p className="text-gray-400">Historical database of flagged malicious activities and network anomalies.</p>
               </div>
               
               <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                   <Download size={16} /> Export CSV
               </button>
           </div>

           <div className="flex flex-col lg:flex-row gap-4 mb-2">
               <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input 
                       type="text" 
                       placeholder="Search by IP, ID, or Attack Type..." 
                       className="w-full bg-[#161b22] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                   />
               </div>
               <div className="flex items-center gap-2 bg-[#161b22] border border-gray-700 rounded-lg px-2">
                   <Filter size={16} className="text-gray-500 ml-2" />
                   <select 
                       value={filter}
                       onChange={(e) => setFilter(e.target.value)}
                       className="bg-transparent border-none text-sm text-gray-300 py-2 pl-2 pr-4 focus:outline-none cursor-pointer"
                   >
                       <option value="All">All Severities</option>
                       <option value="Critical">Critical</option>
                       <option value="High">High</option>
                       <option value="Medium">Medium</option>
                   </select>
               </div>
           </div>

           <div className="glass-panel overflow-hidden">
               <div className="bg-[#161b22] border-b border-gray-700 p-4 grid grid-cols-7 gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                   <div className="col-span-1">Alert ID</div>
                   <div className="col-span-2">Timestamp</div>
                   <div className="col-span-1">Classification</div>
                   <div className="col-span-1">Severity</div>
                   <div className="col-span-1">Source</div>
                   <div className="col-span-1">Target</div>
               </div>
               
               <div className="divide-y divide-gray-800/60">
                   {displayedLogs.map((log) => (
                       <div key={log.id} className="p-4 grid grid-cols-7 gap-4 text-sm items-center hover:bg-gray-800/30 transition-colors">
                           <div className="font-mono text-gray-500">#{log.id}</div>
                           <div className="col-span-2 text-gray-300">{log.timestamp}</div>
                           <div className="font-bold text-red-400">{log.type}</div>
                           <div>
                               <span className={`px-2 py-1 rounded text-xs font-bold ${
                                   log.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                   log.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                   'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                               }`}>
                                   {log.severity}
                               </span>
                           </div>
                           <div className="font-mono text-gray-400 text-xs">{log.source}</div>
                           <div className="font-mono text-gray-400 text-xs">{log.target}</div>
                       </div>
                   ))}
                   
                   {displayedLogs.length === 0 && (
                       <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                           <FileText size={48} className="opacity-20" />
                           <p>No historical logs match your filters.</p>
                       </div>
                   )}
               </div>
           </div>
       </div>
   );
};

export default AlertsLogs;
