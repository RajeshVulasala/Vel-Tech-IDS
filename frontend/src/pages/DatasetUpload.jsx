import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, Loader2, Database } from 'lucide-react';
import api from '../api';

const DatasetUpload = () => {
  const [file, setFile] = useState(() => {
    const savedName = sessionStorage.getItem('datasetFile');
    const savedSize = sessionStorage.getItem('datasetSize');
    return savedName ? { name: savedName, size: Number(savedSize) || 0 } : null;
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(() => {
    const savedStats = sessionStorage.getItem('datasetStats');
    return savedStats ? JSON.parse(savedStats) : null;
  });
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStats(null);
      setError(null);
      sessionStorage.removeItem('datasetFile');
      sessionStorage.removeItem('datasetSize');
      sessionStorage.removeItem('datasetStats');
      sessionStorage.removeItem('preprocessStatus');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/dataset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStats(response.data.stats);
      sessionStorage.setItem('datasetStats', JSON.stringify(response.data.stats));
      sessionStorage.setItem('datasetFile', file.name);
      sessionStorage.setItem('datasetSize', file.size.toString());
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to backend API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dataset Management</h1>
        <p className="text-gray-400">Upload CSV or PCAP files to train and evaluate models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 flex flex-col items-center justify-center border-dashed border-2 border-gray-700 hover:border-primary/50 transition-colors relative">
          <UploadCloud size={64} className="text-gray-500 mb-6" />
          <h3 className="text-xl font-medium mb-2">Drag & Drop Dataset</h3>
          <p className="text-sm text-gray-400 mb-6 text-center">Support for .csv, .pcap formats up to 5GB in size. KDDCup99 and CICIDS-2017 schemas are optimized.</p>
          
          <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/30 text-blue-300 py-3 px-6 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(88,166,255,0.15)] flex items-center gap-2">
            Browse Files
            <input type="file" className="hidden" accept=".csv,.pcap" onChange={handleFileChange} />
          </label>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Database className="text-accent" />
              Dataset Ready Status
            </h3>
            
            {file ? (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4 flex items-start gap-4 border border-gray-700">
                <FileText className="text-blue-400 shrink-0" size={32} />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 italic">No file selected yet.</div>
            )}

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-red-400 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            
            {stats && (
               <div className="mb-4 animate-in slide-in-from-bottom-2 fade-in">
                  <p className="flex items-center gap-2 text-green-400 font-medium mb-3">
                    <CheckCircle2 size={18} /> Processed Successfully
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-3">
                       <p className="text-xs text-gray-400">Total Rows</p>
                       <p className="text-lg font-bold">{stats.rows.toLocaleString()}</p>
                    </div>
                    <div className="glass-card p-3">
                       <p className="text-xs text-gray-400">Total Features</p>
                       <p className="text-lg font-bold">{stats.columns}</p>
                    </div>
                  </div>
               </div>
            )}
          </div>
          
          <button 
            disabled={!file || loading}
            onClick={handleUpload}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              !file || (file && stats) ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-primary/20'
            }`}
          >
            {loading ? <><Loader2 className="animate-spin" /> Uploading...</> : (stats ? 'Upload Completed' : 'Upload to Backend')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetUpload;
