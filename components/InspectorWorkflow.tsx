
import React, { useState, useEffect } from 'react';
import { PropertyRecord, PropertyReport, RoomType } from '../types';
import RiskBadge from './RiskBadge';
import { crossCheckFindings } from '../services/geminiService';
import { PropertyStorage } from '../services/storageService';

const InspectorWorkflow: React.FC = () => {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyRecord | null>(null);
  const [manualReport, setManualReport] = useState('');
  const [crossChecking, setCrossChecking] = useState(false);
  const [crossCheckResult, setCrossCheckResult] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newPropData, setNewPropData] = useState({ houseNumber: '', address: '' });

  useEffect(() => {
    setProperties(PropertyStorage.getAllProperties());
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user = PropertyStorage.getCurrentUser();
    PropertyStorage.registerProperty({
      ...newPropData,
      ownerId: user?.id || 'SYSTEM',
      status: 'UNAUDITED'
    });
    setProperties(PropertyStorage.getAllProperties());
    setIsRegistering(false);
    setNewPropData({ houseNumber: '', address: '' });
  };

  const handleFinalize = () => {
    if (!selectedProperty) return;
    const user = PropertyStorage.getCurrentUser();
    
    const finalReport: PropertyReport = {
      id: `RELEASE-${Math.floor(Math.random() * 99999)}`,
      propertyId: selectedProperty.id,
      houseNumber: selectedProperty.houseNumber,
      address: selectedProperty.address,
      totalRiskScore: 45, // Simulating a fixed result for demo
      summary: crossCheckResult || "Audit complete. No critical structural flaws found.",
      rooms: [],
      inspectedBy: user?.fullName || 'Professional Inspector',
      inspectionDate: new Date().toLocaleDateString(),
      isPublic: true
    };

    PropertyStorage.saveReport(finalReport);
    setProperties(PropertyStorage.getAllProperties());
    setSelectedProperty(null);
    setCrossCheckResult(null);
    setManualReport('');
    alert("Audit finalized and synced to Snowflake Ledger.");
  };

  if (selectedProperty) {
    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        <button onClick={() => setSelectedProperty(null)} className="flex items-center text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">
          <i className="fas fa-arrow-left mr-2"></i> Back to Queue
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden">
          <div className="p-12 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Audit: House #{selectedProperty.houseNumber}</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{selectedProperty.address}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 border border-slate-700`}>
              Status: {selectedProperty.status}
            </div>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <i className="fas fa-clipboard-check text-blue-500 mr-2"></i> Field Observations
              </h3>
              <textarea
                value={manualReport}
                onChange={(e) => setManualReport(e.target.value)}
                placeholder="ENTER FORMAL OBSERVATIONS..."
                className="w-full h-64 p-8 bg-slate-950 border border-slate-800 rounded-[2rem] text-white font-bold text-sm uppercase placeholder:text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={async () => {
                  setCrossChecking(true);
                  const res = await crossCheckFindings(manualReport, []);
                  setCrossCheckResult(res);
                  setCrossChecking(false);
                }}
                disabled={!manualReport || crossChecking}
                className="w-full py-6 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition-all uppercase italic text-xs tracking-widest"
              >
                {crossChecking ? "Analyzing..." : "Validate with Cortex Edge"}
              </button>
            </div>

            {crossCheckResult && (
              <div className="bg-blue-600/5 border border-blue-600/20 rounded-[2.5rem] p-10 space-y-6 animate-slide-up">
                <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">Cortex Validation Report</h3>
                <p className="text-slate-300 italic text-lg leading-relaxed">"{crossCheckResult}"</p>
                <button 
                  onClick={handleFinalize}
                  className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase italic text-sm"
                >
                  Release to Public Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase">Auditor Portal</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Managing SNOWFLAKE.LEDGER.PROPERTIES</p>
        </div>
        <button 
          onClick={() => setIsRegistering(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all"
        >
          <i className="fas fa-plus mr-2"></i> Register Property
        </button>
      </div>

      {isRegistering && (
        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-blue-500/30 animate-slide-up">
           <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
             <div>
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">House Number</label>
               <input 
                type="text" 
                required
                value={newPropData.houseNumber}
                onChange={e => setNewPropData({...newPropData, houseNumber: e.target.value})}
                className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm"
               />
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Full Address</label>
               <input 
                type="text" 
                required
                value={newPropData.address}
                onChange={e => setNewPropData({...newPropData, address: e.target.value})}
                className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm"
               />
             </div>
             <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 py-4 rounded-xl text-white font-black uppercase text-[10px]">Commit</button>
              <button type="button" onClick={() => setIsRegistering(false)} className="px-6 py-4 bg-slate-800 rounded-xl text-slate-500 font-black uppercase text-[10px]">Cancel</button>
             </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((prop) => (
          <div 
            key={prop.id}
            onClick={() => setSelectedProperty(prop)}
            className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-blue-600 transition-colors">
                <i className="fas fa-building text-slate-500 group-hover:text-white"></i>
              </div>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${prop.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                {prop.status}
              </span>
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">House #{prop.houseNumber}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{prop.address}</p>
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
              <span>Added: {prop.registeredDate}</span>
              <span className="text-blue-500 group-hover:translate-x-1 transition-transform">Audit <i className="fas fa-chevron-right ml-1"></i></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspectorWorkflow;
