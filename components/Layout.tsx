
import React from 'react';
import { UserRole } from '../types';
import SqlLedger from './SqlLedger';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole | null;
  onLogout: () => void;
  onNavigateHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, onNavigateHome }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100">
      <header className="bg-slate-900/40 backdrop-blur-xl text-white shadow-2xl sticky top-0 z-50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={onNavigateHome}
          >
            <div className="bg-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
              <i className="fas fa-shield-halved text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none italic uppercase">BYTECODE</h1>
              <div className="flex items-center mt-1">
                <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded mr-2">Cortex Active</span>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Infrastructure Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]"></div>
              <span>Warehouse Sync: Stable</span>
            </div>
            {userRole && (
              <div className="flex items-center space-x-6">
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="flex items-center space-x-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${userRole === UserRole.INSPECTOR ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    <i className={`fas ${userRole === UserRole.INSPECTOR ? 'fa-user-shield' : 'fa-house-user'} mr-2`}></i>
                    {userRole}
                  </span>
                  <button 
                    onClick={onLogout}
                    className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      <div className="fixed bottom-6 right-6 w-80 z-50 pointer-events-none md:pointer-events-auto">
        <SqlLedger />
      </div>

      <footer className="bg-slate-900/50 border-t border-slate-800/50 py-12 mt-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
          <p>© 2024 BYTECODE PRO • POWERED BY SNOWFLAKE CORTEX • SECURE LEDGER ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-blue-500 transition-colors">Compliance</a>
            <a href="#" className="hover:text-blue-500 transition-colors">API Documentation</a>
            <a href="#" className="hover:text-blue-500 transition-colors">System Health</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
