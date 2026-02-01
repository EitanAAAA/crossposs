
import React from 'react';
import { Platform } from '../types';
import { PLATFORM_CONFIGS } from '../constants';

interface SettingsProps {
  onLogout: () => void;
  userEmail: string;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, userEmail }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-5xl font-extrabold text-black tracking-tighter">Settings</h2>
      </div>

      <div className="bg-white rounded-[40px] border border-yellow-100 p-10 shadow-xl shadow-yellow-900/5 space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connected Accounts</h3>
          <p className="text-gray-400 font-medium">Manage your social media permissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(PLATFORM_CONFIGS) as Platform[]).map(p => (
            <div key={p} className="flex items-center justify-between p-6 bg-[#fdfbf5] rounded-3xl border border-yellow-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4a9082] shadow-sm">
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    {PLATFORM_CONFIGS[p].icon}
                   </svg>
                </div>
                <span className="font-bold text-gray-800">{p}</span>
              </div>
              <button className="text-xs font-black uppercase tracking-widest text-[#4a9082] py-2 px-4 bg-white border border-yellow-100 rounded-xl hover:bg-yellow-50 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-yellow-100 p-10 shadow-xl shadow-yellow-900/5 flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold text-gray-900 mb-1">Account Management</h3>
           <p className="text-gray-400 font-medium">{userEmail}</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-red-500 font-bold hover:underline transition-opacity"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
