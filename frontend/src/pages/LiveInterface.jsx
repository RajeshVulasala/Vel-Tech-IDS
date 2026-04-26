import React, { useState } from 'react';
import { Wifi, Play, Square, Settings, Radio } from 'lucide-react';
import api from '../api';

const LiveInterface = () => {
    const [status, setStatus] = useState("Idle");
    const [interf, setInterf] = useState("eth0");
    const [capturing, setCapturing] = useState(false);

    const toggleCapture = async () => {
         if (capturing) {
            try {
                await api.post('/live/stop');
                setCapturing(false);
                setStatus("Capture Stopped");
            } catch(e) {
                setStatus("Error stopping: " + e.message);
            }
         } else {
             try {
                const res = await api.post('/live/start', { interface: interf });
                setCapturing(true);
                setStatus(res.data.status || "Capture Started");
            } catch(e) {
                setStatus("Error starting: " + e.message);
            }
         }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div>
            <h1 className="text-3xl font-bold mb-2">Live Interface Configuration</h1>
            <p className="text-gray-400">Configure packet capture interfaces for real-time inference.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="glass-panel p-8">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <Settings size={20} className="text-primary"/> Capture Settings
                 </h2>
                 <div className="mb-6">
                     <label className="block text-sm text-gray-400 mb-2">Network Interface</label>
                     <input 
                        type="text" 
                        value={interf}
                        onChange={(e) => setInterf(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        placeholder="e.g. eth0, wlan0, Ethernet"
                     />
                     <p className="text-xs text-gray-500 mt-2">Requires Npcap on Windows or sudo on Linux.</p>
                 </div>

                 <button 
                    onClick={toggleCapture}
                    className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                        capturing 
                        ? 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30' 
                        : 'bg-primary border border-primary text-white shadow-[0_0_20px_rgba(88,166,255,0.4)] hover:shadow-[0_0_30px_rgba(88,166,255,0.6)]'
                    }`}
                 >
                     {capturing ? <><Square size={20}/> Stop Capture</> : <><Play size={20}/> Start Live Capture</>}
                 </button>
             </div>

             <div className="glass-panel flex flex-col justify-center items-center text-center p-8 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                 {capturing ? (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-success rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <Radio size={80} className="text-success animate-pulse relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-success mb-2">Sniffing Packets...</h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                           Listening on {interf}. Traffic is being routed through CNN-LSTM. Please go to Live Tracking to view alerts.
                        </p>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center opacity-50">
                        <Wifi size={80} className="text-gray-500 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-500 mb-2">Offline</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                           Start the live capture to begin monitoring network interfaces in real-time.
                        </p>
                    </div>
                 )}
                 <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-600 font-mono">
                     Status: {status}
                 </div>
             </div>
          </div>
        </div>
    );
};
export default LiveInterface;
