
import React from 'react';
import ShineEntrance from './ShineEntrance';
import GlareHover from './GlareHover';

interface HeaderProps {
  currentTab: 'landing' | 'upload' | 'dashboard' | 'settings' | 'auth-login' | 'auth-signup';
  onTabChange: (tab: any) => void;
  user?: any;
}

const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, user }) => {
  return (
    <header className="px-6 py-6 md:py-8 max-w-[90rem] mx-auto flex items-center justify-between relative z-50 w-full">
      {/* Logo - Far Left */}
      <ShineEntrance delay={150} duration={1200}>
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.2}
          glareAngle={-30}
          glareSize={200}
          transitionDuration={800}
          playOnce={false}
        >
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0" 
            onClick={() => user ? onTabChange('upload') : onTabChange('landing')}
          >
            <div className="w-10 h-10 bg-[#4a9082] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-6 border-b-4 border-black/10">
              C
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl text-[#2d3436] tracking-tight hidden sm:block">CrossPost</span>
              <span className="text-[10px] font-bold text-[#f8d902] uppercase tracking-[0.2em] hidden sm:block">Studio</span>
            </div>
          </div>
        </GlareHover>
      </ShineEntrance>
      
      {/* Navigation & Auth - Far Right */}
      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
        {user ? (
          <>
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onTabChange('upload')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentTab === 'upload' ? 'text-[#4a9082]' : 'text-gray-400 hover:text-gray-900'}`}
              >
                Upload
              </button>
              <button 
                onClick={() => onTabChange('dashboard')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentTab === 'dashboard' ? 'text-[#4a9082]' : 'text-gray-400 hover:text-gray-900'}`}
              >
                History
              </button>
              <button 
                onClick={() => onTabChange('settings')}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentTab === 'settings' ? 'text-[#4a9082]' : 'text-gray-400 hover:text-gray-900'}`}
              >
                Settings
              </button>
            </nav>
            <div className="w-10 h-10 rounded-full bg-[#f8d902] border-2 border-white shadow-sm flex items-center justify-center text-black font-bold">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 md:gap-6">
            <ShineEntrance delay={300} duration={1200}>
              <GlareHover
                glareColor="#4a9082"
                glareOpacity={0.15}
                glareAngle={-30}
                glareSize={150}
                transitionDuration={700}
                playOnce={false}
              >
                <button 
                  onClick={() => onTabChange('auth-login')}
                  className="text-gray-700 font-bold px-4 py-2 hover:text-[#4a9082] transition-colors text-sm"
                >
                  Log in
                </button>
              </GlareHover>
            </ShineEntrance>
            <ShineEntrance delay={450} duration={1200}>
              <GlareHover
                glareColor="#ffffff"
                glareOpacity={0.25}
                glareAngle={-30}
                glareSize={200}
                transitionDuration={800}
                playOnce={false}
              >
                <button 
                  onClick={() => onTabChange('auth-signup')}
                  className="summ-button-yellow px-6 py-3 rounded-2xl font-bold text-sm shadow-md"
                >
                  Sign Up
                </button>
              </GlareHover>
            </ShineEntrance>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
