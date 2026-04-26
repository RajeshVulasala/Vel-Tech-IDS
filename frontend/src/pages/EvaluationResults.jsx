import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultData = [
  { name: 'CNN-LSTM', accuracy: 0, precision: 0, recall: 0 },
  { name: 'Random Forest', accuracy: 0, precision: 0, recall: 0 },
  { name: 'Decision Tree', accuracy: 0, precision: 0, recall: 0 },
  { name: 'Logistic Reg', accuracy: 0, precision: 0, recall: 0 },
  { name: 'Baseline NN', accuracy: 0, precision: 0, recall: 0 },
];

const EvaluationResults = () => {
    const [chartData, setChartData] = useState(defaultData);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/metrics');
                const raw = res.data;
                const formatted = [
                    { name: 'CNN-LSTM', accuracy: (raw['CNN-LSTM']?.accuracy || 0) * 100, precision: (raw['CNN-LSTM']?.precision || 0) * 100, recall: (raw['CNN-LSTM']?.recall || 0) * 100 },
                    { name: 'Random Forest', accuracy: (raw['Random Forest']?.accuracy || 0) * 100, precision: (raw['Random Forest']?.precision || 0) * 100, recall: (raw['Random Forest']?.recall || 0) * 100 },
                    { name: 'Decision Tree', accuracy: (raw['Decision Tree']?.accuracy || 0) * 100, precision: (raw['Decision Tree']?.precision || 0) * 100, recall: (raw['Decision Tree']?.recall || 0) * 100 },
                    { name: 'Logistic Reg', accuracy: (raw['Logistic Regression']?.accuracy || 0) * 100, precision: (raw['Logistic Regression']?.precision || 0) * 100, recall: (raw['Logistic Regression']?.recall || 0) * 100 },
                    { name: 'Baseline NN', accuracy: (raw['Neural Networks']?.accuracy || 0) * 100, precision: (raw['Neural Networks']?.precision || 0) * 100, recall: (raw['Neural Networks']?.recall || 0) * 100 },
                ];
                setChartData(formatted);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMetrics();
    }, []);
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div>
            <h1 className="text-3xl font-bold mb-2">Evaluation & Results</h1>
            <p className="text-gray-400">Compare ML and Deep Learning architectures based on common metrics.</p>
          </div>
          
          <div className="glass-panel p-6 h-[500px]">
            <h2 className="text-xl font-bold mb-6">Algorithm Benchmark Comparison</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis dataKey="name" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" domain={[0, 100]} />
                    <RechartsTooltip cursor={{fill: '#2d3748', opacity: 0.4}} contentStyle={{ backgroundColor: 'var(--color-dark-panel)', borderColor: 'var(--color-dark-border)', borderRadius: '8px' }}/>
                    <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="accuracy" name="Accuracy (%)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" name="Precision (%)" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" name="Recall (%)" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    );
};
export default EvaluationResults;
