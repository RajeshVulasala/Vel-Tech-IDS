import React, { useState } from 'react';
import api from '../api';
import { Activity, Database, CheckCircle2, Sliders, RefreshCw, Layers, Table as TableIcon } from 'lucide-react';

const Preprocessing = () => {
    const [status, setStatus] = useState(() => sessionStorage.getItem('preprocessStatus') || 'pending');
    const [previews, setPreviews] = useState(() => {
        const saved = sessionStorage.getItem('preprocessPreviews');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    const handlePreprocess = async () => {
        setLoading(true);
        setStatus('processing');
        try {
            const response = await api.get('/dataset/preprocess');
            setStatus('complete');
            setPreviews(response.data);
            sessionStorage.setItem('preprocessStatus', 'complete');
            sessionStorage.setItem('preprocessPreviews', JSON.stringify(response.data));
        } catch (err) {
            setStatus('error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dataset Preprocessing</h1>
                <p className="text-gray-400">Transform raw network traffic into clean, scaled, and encoded vectors optimized for Machine Learning.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <Sliders className="text-primary" />
                            Pipeline Operations
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded">1</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Missing Value Imputation</h4>
                                    <p className="text-xs text-gray-400 mt-1">Converts Inf/-Inf to NaN, and fills all missing numeric entries with their column median.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded">2</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Label Encoding & Target Masking</h4>
                                    <p className="text-xs text-gray-400 mt-1">Identifies dependent categorical labels using flexible matching, converts targets automatically.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded">3</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">Feature Scaling</h4>
                                    <p className="text-xs text-gray-400 mt-1">Normalizes all numerical dimensions uniformly using MinMax Scaler parameters.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded">4</div>
                                <div>
                                    <h4 className="font-bold text-gray-200">CNN-LSTM Sequencing (Deep Learning)</h4>
                                    <p className="text-xs text-gray-400 mt-1">Generates temporal overlapping sequences (Shape: Window=10) on massive data specifically for CNN ingestion.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                        <Layers size={48} className="text-accent mb-4" />
                        <h3 className="text-lg font-bold mb-2">Execute Pipeline</h3>
                        <p className="text-sm text-gray-400 mb-6">Start dataset cleaning and sequence allocations.</p>

                        <button 
                            onClick={handlePreprocess}
                            disabled={status === 'processing' || status === 'complete'}
                            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                                status === 'complete' 
                                ? 'bg-success/20 text-success border border-success/30 cursor-not-allowed' 
                                : status === 'processing' 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:scale-105'
                            }`}
                        >
                            {status === 'complete' ? (
                                <><CheckCircle2 size={18} /> Preprocessing Complete</>
                            ) : status === 'processing' ? (
                                <><RefreshCw size={18} className="animate-spin" /> Processing Data...</>
                            ) : (
                                "Run Pipeline"
                            )}
                        </button>
                    </div>

                    {status === 'complete' && previews && (
                        <div className="glass-panel p-6 animate-in slide-in-from-bottom-5 w-full overflow-hidden">
                           <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                               <TableIcon size={18} className="text-primary" />
                               <h3 className="font-bold">Data Preview (CLEANED)</h3>
                           </div>
                           <div className="overflow-x-auto max-h-[300px]">
                               <table className="w-full text-[10px] font-mono text-gray-300 border-collapse">
                                   <thead>
                                       <tr className="bg-gray-800 text-gray-400">
                                           {Object.keys(previews?.processed?.[0] || {}).slice(0, 8).map(k => (
                                               <th key={k} className="p-2 text-left border border-gray-700">{k}</th>
                                           ))}
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {previews?.processed?.map((row, i) => (
                                           <tr key={i} className="hover:bg-gray-800/50">
                                               {Object.values(row).slice(0, 8).map((v, j) => (
                                                   <td key={j} className="p-2 border border-gray-700 truncate max-w-[100px]">
                                                       {typeof v === 'number' ? v.toFixed(2) : String(v)}
                                                   </td>
                                               ))}
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           </div>
                           <p className="text-[10px] text-gray-500 mt-2 text-center">Displaying top 5 rows for validation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Preprocessing;
