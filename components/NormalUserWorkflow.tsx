
import React, { useState, useRef } from 'react';
import { RoomType, PropertyReport, UserRole } from '../types';
import RiskBadge from './RiskBadge';
import { analyzeInfrastructure } from '../services/geminiService';
import { PropertyStorage } from '../services/storageService';

const NormalUserWorkflow: React.FC = () => {
  const [mode, setMode] = useState<'CHOOSING' | 'SEARCH' | 'SELF_INSPECTION' | 'HISTORY'>('CHOOSING');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState<PropertyReport | null>(null);
  const [history, setHistory] = useState<PropertyReport[]>([]);
  
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(RoomType.KITCHEN);
  const [textDescription, setTextDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const property = PropertyStorage.getPropertyByHouseNumber(searchQuery);
    if (property) {
      const reports = PropertyStorage.getReportsByProperty(property.id);
      if (reports.length > 0) {
        setActiveReport(reports[reports.length - 1]);
        setHistory(reports);
      } else {
        alert("Property exists but has no completed audits yet.");
      }
    } else {
      alert("Property not found in the Snowflake Ledger. Check house number.");
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 4, 98));
    }, 80);

    try {
      const result = await analyzeInfrastructure(selectedRoom, textDescription, selectedImage || undefined);
      clearInterval(interval);
      setAnalysisProgress(100);
      
      const user = PropertyStorage.getCurrentUser();
      
      const newReport: PropertyReport = {
        id: `REPORT-${Math.floor(Math.random() * 10000)}`,
        propertyId: 'LOCAL-SESSION', // In a real app we'd link to a property ID
        houseNumber: 'Self-Submitted',
        address: 'Current Property Analysis',
        totalRiskScore: result.riskScore,
        summary: result.summary,
        isPublic: false,
        inspectedBy: user?.fullName || 'Resident',
        inspectionDate: new Date().toLocaleDateString(),
        groundingSources: result.groundingSources,
        rooms: [
          {
            roomType: selectedRoom,
            findings: result.findings,
            riskScore: result.riskScore,
            summary: result.summary,
            completed: true,
            images: selectedImage ? [selectedImage] : [],
            groundingSources: result.groundingSources
          }
        ]
      };
      
      // We don't save self-scans to the official ledger yet, just view them
      setActiveReport(newReport);
      setIsAnalyzing(false);
    } catch (error) {
      clearInterval(interval);
      setIsAnalyzing(false);
      alert("Local evaluation failed.");
    }
  };

  if (activeReport) {
    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        <button 
          onClick={() => { setActiveReport(null); setMode('CHOOSING'); setSelectedImage(null); setTextDescription(''); }}
          className="flex items-center text-slate-500 hover:text-white transition-colors font-black text-xs uppercase tracking-widest"
        >
          <i className="fas fa-chevron-left mr-2"></i> Return to Dashboard
        </button>

        <div className="bg-slate-900/50 rounded-[3rem] shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-md">
          <div className="p-12 bg-blue-600/5 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-amber-500 bg-amber-500/10 border border-amber-500/20 font-black tracking-widest text-[10px] uppercase px-3 py-1 rounded">
                   OFFICIAL AUDIT REPORT
                </span>
                <span className="text-slate-600 text-[10px] uppercase font-black font-mono">HASH: {activeReport.id}</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Inspection Analysis</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">{activeReport.address}</p>
            </div>
            <div className="text-right">
              <RiskBadge score={activeReport.totalRiskScore} size="lg" />
            </div>
          </div>

          <div className="p-12 space-y-16">
            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                <i className="fas fa-brain text-blue-500 mr-3"></i> Heuristic Reasoning
              </h3>
              <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800/50 text-slate-300 text-lg italic leading-relaxed font-serif shadow-inner">
                "{activeReport.summary}"
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                <i className="fas fa-microscope text-blue-500 mr-3"></i> Anomalies Detected
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeReport.rooms.flatMap(r => r.findings).map(finding => (
                  <div key={finding.id} className="p-8 bg-slate-800/20 border border-slate-800/50 rounded-3xl">
                    <div className="flex items-start justify-between mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${finding.severity === 'critical' || finding.severity === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {finding.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">{finding.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      <div className="text-center space-y-6">
        <h2 className="text-7xl font-black text-white tracking-tighter italic uppercase">Resident Dashboard</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
          Access the <span className="text-blue-500">Property Ledger</span> to review audits and safety records.
        </p>
      </div>

      {mode === 'CHOOSING' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <button 
            onClick={() => setMode('SELF_INSPECTION')}
            className="group p-12 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-blue-500/50 transition-all text-left"
          >
            <div className="bg-blue-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
              <i className="fas fa-camera text-xl text-white"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Self-Scan</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Run local Cortex heuristics</p>
          </button>

          <button 
            onClick={() => setMode('SEARCH')}
            className="group p-12 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-slate-400/30 transition-all text-left"
          >
            <div className="bg-slate-800 w-14 h-14 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
              <i className="fas fa-search text-xl text-slate-400"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Audit Query</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Query history by House #</p>
          </button>
          
          <button 
            onClick={() => setMode('HISTORY')}
            className="group p-12 bg-slate-900 border border-slate-800 rounded-[3rem] hover:border-amber-500/30 transition-all text-left"
          >
            <div className="bg-amber-500/10 w-14 h-14 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform text-amber-500">
              <i className="fas fa-clock-rotate-left text-xl"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">My History</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Your persistent vault</p>
          </button>
        </div>
      )}

      {mode === 'SEARCH' && (
        <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 animate-slide-up shadow-2xl">
          <button onClick={() => setMode('CHOOSING')} className="text-slate-600 hover:text-white mb-12 flex items-center text-[10px] font-black uppercase tracking-[0.3em]">
            <i className="fas fa-chevron-left mr-3"></i> Return
          </button>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ENTER HOUSE NUMBER" 
              className="flex-1 px-10 py-8 bg-slate-950 border border-slate-800 rounded-3xl text-white font-black text-2xl uppercase"
            />
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white font-black px-16 rounded-3xl hover:bg-blue-700 transition-all uppercase italic tracking-tighter"
            >
              QUERY
            </button>
          </div>
        </div>
      )}

      {mode === 'SELF_INSPECTION' && (
        <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 animate-slide-up space-y-12">
           <button onClick={() => setMode('CHOOSING')} className="text-slate-600 hover:text-white mb-4 flex items-center text-[10px] font-black uppercase tracking-[0.3em]">
            <i className="fas fa-chevron-left mr-3"></i> Return
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <textarea 
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                placeholder="DESCRIBE OBSERVATIONS..."
                className="w-full h-40 p-8 bg-slate-950 border border-slate-800 rounded-[2rem] text-white text-sm font-bold uppercase placeholder:text-slate-800"
              />
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing || !textDescription}
                className="w-full py-8 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all disabled:bg-slate-800"
              >
                {isAnalyzing ? `Scanning... ${analysisProgress}%` : "Run Local Evaluation"}
              </button>
            </div>
            <div className="bg-slate-950 rounded-[2rem] border border-slate-800 p-12 flex flex-col items-center justify-center text-center">
              <i className="fas fa-bolt-lightning text-4xl text-blue-500 mb-6"></i>
              <h4 className="text-white font-black text-lg uppercase italic mb-2">Edge Cortex Active</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">No API keys or cloud calls required for local inference.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalUserWorkflow;
