
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import NormalUserWorkflow from './components/NormalUserWorkflow';
import InspectorWorkflow from './components/InspectorWorkflow';
import { PropertyStorage } from './services/storageService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [formData, setFormData] = useState({ 
    email: '', 
    username: '', 
    password: '', 
    fullName: '', 
    phoneNumber: '',
    role: UserRole.NORMAL 
  });

  useEffect(() => {
    const user = PropertyStorage.getCurrentUser();
    if (user) setCurrentUser(user);
    
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    PropertyStorage.logout();
    setCurrentUser(null);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'SIGNUP') {
      const newUser = PropertyStorage.signup({
        ...formData,
        username: formData.email.split('@')[0], // Internal username fallback
      });
      if (newUser) {
        setAuthMode('LOGIN');
        alert("Account provisioned successfully. Please log in.");
      }
    } else {
      const user = PropertyStorage.login(formData.email, formData.password);
      if (user) {
        setCurrentUser(user);
      } else {
        alert("Authentication Failed. Check your email and password.");
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-6 animate-pulse">
           <div className="bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/20">
              <i className="fas fa-bolt-lightning text-4xl"></i>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">BYTECODE</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-1">Snowflake Handshake Protocol</p>
            </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Left Column: Branding & Info */}
          <div className="hidden lg:block space-y-12">
            <div className="flex items-center space-x-4">
               <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-[1.25rem] shadow-2xl shadow-blue-500/40">
                  <i className="fas fa-shield-halved text-2xl"></i>
               </div>
               <span className="font-black text-4xl tracking-tighter uppercase italic text-white">Bytecode</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-7xl font-black text-white leading-[1.05] tracking-tight italic">
                Cortex <br/>
                <span className="text-blue-500">Identity</span> <br/>
                Warehouse.
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-lg">
                The secure bridge between physical infrastructure and the Snowflake Cortex intelligence ledger. Join our network of safety-first residents and professional auditors.
              </p>
            </div>
            <div className="flex items-center space-x-8 pt-4">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white italic">100%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Local Privacy</span>
               </div>
               <div className="w-px h-10 bg-slate-800"></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-white italic">SQL</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">DML/DDL Powered</span>
               </div>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              
              {/* Form Toggle Header */}
              <div className="flex mb-10 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button 
                  onClick={() => setAuthMode('LOGIN')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMode === 'LOGIN' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setAuthMode('SIGNUP')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMode === 'SIGNUP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">
                  {authMode === 'LOGIN' ? 'Welcome Back' : 'Join Bytecode'}
                </h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Snowflake Handshake Protocol v2.5</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'SIGNUP' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-bold text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phoneNumber}
                        onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-bold text-sm transition-all"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email ID</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-bold text-sm transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Access Password</label>
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white font-bold text-sm transition-all"
                  />
                </div>

                {authMode === 'SIGNUP' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Select Identity Tier</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, role: UserRole.NORMAL})}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === UserRole.NORMAL ? 'bg-blue-600/10 border-blue-600 text-blue-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                      >
                        <i className="fas fa-house-user mr-2"></i> Normal
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, role: UserRole.INSPECTOR})}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === UserRole.INSPECTOR ? 'bg-amber-600/10 border-amber-600 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                      >
                        <i className="fas fa-user-shield mr-2"></i> Inspector
                      </button>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.25rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[11px] mt-6"
                >
                  {authMode === 'LOGIN' ? 'Initiate Session' : 'Provision Account'}
                </button>
              </form>
              
              <p className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Data persistence via Snowflake Local Edge Simulation
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <Layout 
      userRole={currentUser.role} 
      onLogout={handleLogout}
      onNavigateHome={() => {}}
    >
      {currentUser.role === UserRole.NORMAL ? (
        <NormalUserWorkflow />
      ) : (
        <InspectorWorkflow />
      )}
    </Layout>
  );
};

export default App;
