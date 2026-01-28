
import React, { useEffect, useState, useRef } from 'react';

interface LogEntry {
  id: string;
  query: string;
  status: 'SUCCESS' | 'PENDING';
  timestamp: string;
}

const SqlLedger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (query: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      status: 'SUCCESS',
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  // Expose this to window for simulation
  useEffect(() => {
    (window as any).logSql = addLog;
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-[10px] overflow-hidden">
      <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
        <span className="text-blue-500 font-bold uppercase tracking-widest flex items-center">
          <i className="fas fa-database mr-2"></i> Snowflake SQL Ledger
        </span>
        <span className="text-slate-600">CONNECTED: US-EAST-1</span>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto" ref={scrollRef}>
        {logs.length === 0 && <div className="text-slate-700 italic">Awaiting transactions...</div>}
        {logs.map(log => (
          <div key={log.id} className="animate-slide-in flex items-start space-x-2">
            <span className="text-green-500 font-bold">[{log.status}]</span>
            <span className="text-slate-400">[{log.timestamp}]</span>
            <span className="text-slate-200 truncate flex-1">{log.query}</span>
          </div>
        ))}
      </div>
      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SqlLedger;
