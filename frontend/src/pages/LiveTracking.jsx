import React, { useState, useEffect } from 'react';
import { Activity, Shield, ShieldAlert, Cpu } from 'lucide-react';
import api from '../api';

const LiveTracking = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/live/stats');
                setStats(res.data);
            } catch(e) {
                console.error("Failed to fetch live stats", e);
            }
        };

        fetchStats();
        // Poll every 1.5s
        const interval = setInterval(fetchStats, 1500);
        return () => clearInterval(interval);
    }, []);

    const isNormal = (pred) => pred.toLowerCase() === 'normal';

    const stopTracking = async () => {
         try {
             await api.post('/live/stop');
         } catch(e) {
             console.error("Failed to stop tracking", e);
         }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">Live Tracking Dashboard</h1>
              <p className="text-gray-400">Real-time packet inspection via CNN-LSTM Hybrid Model.</p>
            </div>
            
            <div className="glass-card px-6 py-3 flex items-center gap-3">
               <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
               </span>
               <span className="text-sm font-bold text-gray-300 mr-4">
                   Total Packets Captured: {stats ? stats.total_packets : 0}
               </span>
               <button 
                  onClick={stopTracking}
                  className="bg-danger/20 hover:bg-danger/40 text-danger border border-danger/30 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
               >
                  Stop Capture
               </button>
            </div>
          </div>
          
          <div className="glass-panel overflow-hidden">
             <div className="bg-[#161b22] border-b border-gray-700 p-4 grid grid-cols-6 gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                 <div className="col-span-1">Timestamp</div>
                 <div className="col-span-1">Source IP</div>
                 <div className="col-span-1">Dest IP</div>
                 <div className="col-span-1">Protocol / Len</div>
                 <div className="col-span-1">Classification</div>
                 <div className="col-span-1">Confidence</div>
             </div>
             
             <div className="divide-y divide-gray-800/60 max-h-[600px] overflow-y-auto">
                 {!stats || stats.last_packets.length === 0 ? (
                     <div className="p-12 text-center text-gray-500 italic flex items-center justify-center gap-2">
                        <Activity className="animate-pulse" size={20} /> Awaiting traffic...
                     </div>
                 ) : (
                     stats.last_packets.map((pkt, i) => (
                         <div key={i} className={`p-4 grid grid-cols-6 gap-4 text-sm items-center transition-colors hover:bg-gray-800/30 ${!isNormal(pkt.prediction) ? 'bg-danger/5 border-l-2 border-danger' : 'border-l-2 border-transparent'}`}>
                             <div className="text-gray-400 font-mono text-xs">{new Date(pkt.timestamp * 1000).toLocaleTimeString()}</div>
                             <div className="font-medium">{pkt.src}</div>
                             <div className="font-medium text-gray-300">{pkt.dst}</div>
                             <div>
                                 <span className="inline-block px-2 py-1 rounded bg-gray-800 text-xs text-blue-300 border border-gray-700">{pkt.protocol}</span>
                                 <span className="text-xs text-gray-500 ml-2">{pkt.length}b</span>
                             </div>
                             <div>
                                {isNormal(pkt.prediction) ? (
                                    <span className="inline-flex items-center gap-1.5 text-success font-medium">
                                        <Shield size={16} /> Normal
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-danger font-bold glow-text">
                                        <ShieldAlert size={16} /> {pkt.prediction} (Alert)
                                    </span>
                                )}
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-xs text-gray-400 font-mono">{(pkt.confidence * 100).toFixed(1)}%</span>
                                 <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full ${isNormal(pkt.prediction) ? 'bg-success' : 'bg-danger'}`} 
                                        style={{ width: `${pkt.confidence * 100}%` }}
                                     ></div>
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
          </div>
        </div>
    );
};
export default LiveTracking;
