import React, { useState } from 'react';
import { Play, Cpu, Server, Terminal, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import api from '../api';

const models = [
  { id: 'CNN-LSTM', name: 'CNN-LSTM Hybrid (Deep Learning)', desc: 'Processes traffic sequences to find spatial & temporal anomalies.' },
  { id: 'Logistic Regression', name: 'Logistic Regression', desc: 'Fast, linear baseline model for binary classification.' },
  { id: 'Decision Tree', name: 'Decision Tree', desc: 'Non-linear tree-based structure, high accuracy under right conditions.' },
  { id: 'Random Forest', name: 'Random Forest', desc: 'Ensemble model with robust performance and feature importance.' },
  { id: 'Neural Networks', name: 'Baseline Neural Network', desc: 'Standard multi-layer perceptron for classical benchmarking.' },
];

const ModelTraining = () => {
  const [selectedModel, setSelectedModel] = useState('CNN-LSTM');
  const [logs, setLogs] = useState([]);
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const startTraining = async () => {
    setTraining(true);
    setMetrics(null);
    setLogs(["Initializing training environment...", `Selected Model: ${selectedModel}`, "Loading dataset artifacts...", "Starting epochs..."]);
    
    // Simulate training log streaming over time
    const interval = setInterval(() => {
       setLogs(prev => [...prev, `Epoch progress: processing batch...`]);
    }, 1500);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/models/train', {
          model_type: selectedModel
      });
      clearInterval(interval);
      setLogs(prev => [...prev, "Training Complete! Generating classification report..."]);
      setMetrics(response.data.metrics);
    } catch (err) {
      clearInterval(interval);
      setLogs(prev => [...prev, `Error: ${err.response?.data?.error || err.message}`]);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Model Training</h1>
        <p className="text-gray-400">Select an architecture to train on the active dataset.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Model Selection Column */}
        <div className="flex flex-col gap-4">
           {models.map(m => (
              <div 
                key={m.id}
                onClick={() => !training && setSelectedModel(m.id)}
                className={`glass-panel p-5 cursor-pointer transition-all duration-200 ${
                    selectedModel === m.id 
                    ? 'border-primary/50 shadow-[0_0_15px_rgba(88,166,255,0.15)] bg-primary/5 -translate-y-1' 
                    : 'hover:border-gray-600 opacity-80 hover:opacity-100'
                } ${training ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-gray-200">{m.name}</h3>
                     {selectedModel === m.id && <CheckCircle2 className="text-primary" size={20} />}
                  </div>
                  <p className="text-sm text-gray-400">{m.desc}</p>
              </div>
           ))}
        </div>

        {/* Training Environment Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="glass-panel p-6 flex items-center justify-between">
              <div>
                 <h3 className="font-bold text-xl mb-1 flex items-center gap-2">
                    <Server className="text-accent" size={20}/> Target Runtime
                 </h3>
                 <p className="text-sm text-gray-400">Local Backend (127.0.0.1:5000)</p>
              </div>
              <button
                onClick={startTraining}
                disabled={training}
                className={`px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  training ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-accent to-purple-600 text-white hover:shadow-[0_0_20px_rgba(137,87,229,0.3)] hover:-translate-y-0.5'
                }`}
              >
                 {training ? <><Loader2 className="animate-spin" size={20} /> Training...</> : <><Play size={20} /> Deploy Training Job</>}
              </button>
           </div>

           <div className="glass-panel border-gray-700 bg-gray-900 overflow-hidden flex-1 flex flex-col min-h-[400px]">
              <div className="bg-[#161b22] px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                 <Terminal className="text-gray-500" size={16} />
                 <span className="text-xs text-gray-400 font-mono">Console Output</span>
              </div>
              <div className="p-4 font-mono text-xs text-gray-300 flex-1 overflow-y-auto space-y-2">
                 {logs.length === 0 ? (
                    <div className="opacity-50 italic">Awaiting training execution...</div>
                 ) : (
                    logs.map((log, i) => (
                       <div key={i} className="flex gap-4">
                          <span className="text-gray-600 shrink-0 select-none">$&gt;</span>
                          <span className={`${log.includes('Error') ? 'text-red-400' : log.includes('Complete') ? 'text-green-400' : ''}`}>{log}</span>
                       </div>
                    ))
                 )}

                 {metrics && (
                     <div className="mt-6 border border-green-500/30 bg-green-500/5 p-4 rounded-md text-green-300">
                        <p className="font-bold border-b border-green-500/30 pb-2 mb-2">Final Evaluation Metrics:</p>
                        <p>Accuracy: {(metrics.accuracy * 100).toFixed(2)}%</p>
                        <p>Precision: {(metrics.precision * 100).toFixed(2)}%</p>
                        <p>Recall: {(metrics.recall * 100).toFixed(2)}%</p>
                        <p>F1 Score: {(metrics.f1_score * 100).toFixed(2)}%</p>
                     </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ModelTraining;
