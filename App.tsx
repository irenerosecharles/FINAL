
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
  const [formData, setFormData] = useState({ username: '', fullName: '', role: UserRole.NORMAL });

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
      const newUser = PropertyStorage.signup(formData);
      setCurrentUser(newUser);
      PropertyStorage.login(newUser.username);
    } else {
      const user = PropertyStorage.login(formData.username);
      if (user) {
        setCurrentUser(user);
      } else {
        alert("User not found. Check credentials or Sign Up.");
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
              <h1 className="text-4xl font-black tracking-tighter">BYTECODE</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-1">Snowflake Handshake Protocol</p>
            </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-10">
            <div className="flex items-center space-x-3 text-white">
               <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-500/20">
                  <i className="fas fa-bolt-lightning text-lg"></i>
               </div>
               <span className="font-black text-2xl tracking-tighter uppercase italic">Bytecode</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tight">
                Secure <br/>
                <span className="text-blue-500">Infrastructure</span> <br/>
                Ledger.
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                Authenticate with the Snowflake Identity Provider to access local Cortex Edge intelligence.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white mb-2">{authMode === 'LOGIN' ? 'System Login' : 'Register Account'}</h2>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Snowflake Cortex Access Point</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'SIGNUP' && (
                <input 
                  type="text" 
                  placeholder="FULL NAME"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-bold text-sm"
                />
              )}
              <input 
                type="text" 
                placeholder="USERNAME"
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-bold text-sm"
              />
              {authMode === 'SIGNUP' && (
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white font-bold text-sm"
                >
                  <option value={UserRole.NORMAL}>Resident / Buyer</option>
                  <option value={UserRole.INSPECTOR}>Professional Inspector</option>
                </select>
              )}
              
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs"
              >
                {authMode === 'LOGIN' ? 'Initiate Handshake' : 'Provision Account'}
              </button>
            </form>

            <button 
              onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
              className="w-full text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]"
            >
              {authMode === 'LOGIN' ? 'Need an account? Sign Up' : 'Already registered? Log In'}
            </button>
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
