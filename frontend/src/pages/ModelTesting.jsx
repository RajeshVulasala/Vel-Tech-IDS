import React, { useState } from 'react';
import { Activity, Play, ShieldAlert, ShieldCheck } from 'lucide-react';
import api from '../api';

const models = [
  { id: 'CNN-LSTM', name: 'CNN-LSTM Hybrid' },
  { id: 'Logistic Regression', name: 'Logistic Regression' },
  { id: 'Decision Tree', name: 'Decision Tree' },
  { id: 'Random Forest', name: 'Random Forest' },
  { id: 'Neural Networks', name: 'Baseline NN' },
];

const ModelTesting = () => {
    const [selectedModel, setSelectedModel] = useState('CNN-LSTM');
    const [features, setFeatures] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        if (!features.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // parse the user input (comma-separated list, or array of features)
            // support simple list or 2D array
            let payload = [];
            try {
                // Try to parse array first (e.g. [[1,2,3]])
                const parsed = JSON.parse(features);
                payload = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                // Otherwise treat as comma-separated string
                payload = [features.split(',').map(n => Number(n.trim()))];
            }

            const response = await api.post('/predict', { 
                features: payload,
                model_type: selectedModel
            });
            setResult(response.data.predictions[0]);
        } catch (err) {
            setError(err.response?.data?.error || "Inference failed");
        } finally {
            setLoading(false);
        }
    };

    const isNormal = result && result.class && result.class.toLowerCase() === 'normal';

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div>
            <h1 className="text-3xl font-bold mb-2">Model Testing Sandbox</h1>
            <p className="text-gray-400">Run manual inference checks against the locally deployed best model.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel p-6 flex flex-col gap-4">
                  <h3 className="text-xl font-bold border-b border-gray-700 pb-3 flex items-center gap-2">
                      <Activity className="text-accent" />
                      Feature Input
                  </h3>
                  <p className="text-sm text-gray-400">
                      Enter raw network features extracted. Supply them as a comma-separated list or a JSON array. 
                  </p>
                  
                  <div className="mb-2">
                      <label className="text-xs text-gray-400 mb-1 block uppercase font-bold tracking-wider">Select Architecture</label>
                      <select 
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-primary/50 outline-none cursor-pointer"
                      >
                          {models.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                      </select>
                  </div>

                  <textarea 
                      className="w-full h-40 bg-gray-900/50 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                      placeholder="e.g. 0.12, 0, 0, 45, 120, ..."
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                  ></textarea>

                  <button 
                      onClick={handlePredict}
                      disabled={loading || !features.trim()}
                      className="w-full bg-gradient-to-r from-accent to-blue-600 hover:from-blue-500 hover:to-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {loading ? 'Running Inference...' : <><Play fill="currentColor" size={18} /> Test Inference</>}
                  </button>

                  {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
              </div>

              <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px]">
                  {result ? (
                      <div className="text-center animate-in zoom-in-95 duration-300">
                          <p className="text-gray-400 font-bold tracking-wider uppercase text-sm mb-4">Classification Result</p>
                          <div className={`p-8 rounded-full mb-6 inline-flex shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isNormal ? 'bg-success/10 text-success shadow-success/20' : 'bg-danger/10 text-danger shadow-danger/20'}`}>
                              {isNormal ? <ShieldCheck size={80} /> : <ShieldAlert size={80} />}
                          </div>
                          
                          <h2 className={`text-4xl font-extrabold ${isNormal ? 'text-success' : 'glow-text text-danger'}`}>
                              {result.class}
                          </h2>
                          <div className="mt-4 flex items-center justify-center gap-2">
                              <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                      className={`h-full ${isNormal ? 'bg-success' : 'bg-danger'}`} 
                                      style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}
                                  ></div>
                              </div>
                              <span className="text-xs font-mono text-gray-400">Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <p className="text-gray-500 text-sm mt-6">Calculated in near real-time via the Inference Engine.</p>
                      </div>
                  ) : (
                      <div className="text-gray-600 italic text-center">
                          <Activity size={48} className="mx-auto mb-4 opacity-20" />
                          <p>Run a test to see the classification output.</p>
                      </div>
                  )}
              </div>
          </div>
        </div>
    );
};
export default ModelTesting;
