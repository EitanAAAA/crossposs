
import React, { useState } from 'react';
import { Platform } from '../../types';
import { PLATFORM_CONFIGS } from '../../constants';
import PlatformDisplay from './PlatformDisplay';

interface PlatformManagerProps {
  connectedPlatforms: Platform[];
  onUpdatePlatforms: (platforms: Platform[]) => void;
  userId?: string;
}

const PlatformCard: React.FC<{
  platform: Platform;
  isConnected: boolean;
  onToggle: () => void;
  index: number;
  userId?: string;
  onError?: (message: string) => void;
}> = ({ platform, isConnected, onToggle, index, userId, onError }) => {
  const config = PLATFORM_CONFIGS[platform];
  const platformColors = [
    { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]', text: 'text-white' },
    { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]', text: 'text-black' },
    { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]', text: 'text-white' },
    { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]', text: 'text-black' },
  ];
  const color = platformColors[index % platformColors.length];
  
  return (
    <div className="dashboard-card bg-white rounded-[28px] p-8 border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity ${
        isConnected ? `${color.bg} opacity-10` : 'bg-gray-100 opacity-0 group-hover:opacity-100'
      }`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all ${
              isConnected 
                ? `${color.bg} ${color.border} shadow-xl` 
                : 'bg-gray-50 border-gray-200 group-hover:border-gray-300'
            }`}>
              <svg className={`w-8 h-8 ${isConnected ? color.text : 'text-gray-400'}`} viewBox="0 0 24 24" fill="currentColor">
                {config.icon}
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-black text-black mb-2">{platform?.split(' ')[0] || platform || 'Unknown'}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{platform}</p>
            </div>
          </div>
          <div className={`w-16 h-9 rounded-full p-1.5 transition-all cursor-pointer ${
            isConnected ? color.bg : 'bg-gray-200'
          }`} onClick={onToggle}>
            <div className={`w-7 h-7 rounded-full bg-white shadow-xl transition-transform ${
              isConnected ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </div>
        </div>

        <div className="space-y-5">
          {isConnected ? (
            <>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color.bg} animate-pulse`} />
                <span className={`font-bold text-lg ${color.bg.replace('bg-', 'text-')}`}>Connected</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">Connection Details</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <span className={`text-sm font-bold ${color.bg.replace('bg-', 'text-')}`}>Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Last Sync</span>
                    <span className="text-sm font-bold text-gray-700">Just now</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
              <p className="text-sm font-bold text-gray-700 mb-4">Connect to start publishing</p>
              <button 
                onClick={async () => {
                  if (platform === 'YouTube Shorts' && userId) {
                    try {
                      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
                      const response = await fetch(`${API_URL}/auth/youtube?userId=${userId}`);
                      if (!response.ok) throw new Error('Failed to get auth URL');
                      const { authUrl } = await response.json();
                      window.location.href = authUrl;
                    } catch (error) {
                      console.error('Failed to initiate YouTube OAuth:', error);
                      if (onError) {
                        onError('Failed to connect YouTube. Please try again.');
                      }
                    }
                  } else {
                    onToggle();
                  }
                }}
                className={`w-full ${color.bg} ${color.text} px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg`}
              >
                Connect Platform
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlatformManager: React.FC<PlatformManagerProps> = ({ connectedPlatforms, onUpdatePlatforms, userId }) => {
  // Always sync with connectedPlatforms from props (which comes from user data)
  const [platforms, setPlatforms] = useState<Platform[]>(connectedPlatforms);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync platforms when connectedPlatforms prop changes (e.g., after YouTube connection)
  React.useEffect(() => {
    setPlatforms(connectedPlatforms);
  }, [connectedPlatforms]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');
    const view = params.get('view');
    
    // Only handle if we're on the manager view
    if (view === 'manager' || window.location.pathname.includes('manager')) {
      if (success === 'youtube_connected') {
        setMessage({ type: 'success', text: 'YouTube connected successfully!' });
        window.history.replaceState({}, '', window.location.pathname);
        setTimeout(() => setMessage(null), 5000);
        // Platforms will be updated automatically via the useEffect above when connectedPlatforms prop updates
      } else if (error) {
        setMessage({ type: 'error', text: `Connection failed: ${decodeURIComponent(error)}` });
        window.history.replaceState({}, '', window.location.pathname);
        setTimeout(() => setMessage(null), 5000);
      }
    }
  }, [connectedPlatforms]);

  const handleTogglePlatform = (platform: Platform) => {
    const newPlatforms = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform];
    setPlatforms(newPlatforms);
    onUpdatePlatforms(newPlatforms);
  };

  const connectedCount = platforms.length;
  const totalPlatforms = Object.values(Platform).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {message && (
        <div className={`rounded-2xl p-4 border-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-bold">{message.text}</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-3">
            <span className="text-black">Platform </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4a9082] via-[#f8d902] to-[#4a9082] bg-[length:200%_auto]" style={{ animation: 'pulse 3s ease-in-out infinite' }}>
              Manager
            </span>
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Connect and manage your social media platforms
          </p>
        </div>
        <div className="bg-white rounded-2xl px-8 py-6 border-2 border-gray-200 shadow-xl">
        <div className="text-center">
            <p className="text-4xl font-black text-black">{connectedCount}/{totalPlatforms}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Connected</p>
        </div>
      </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 border-2 border-gray-200 shadow-lg mb-8">
         <div className="flex items-center gap-4 mb-6">
           <div className="w-12 h-12 bg-[#4a9082] rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
             <h3 className="text-2xl font-black text-black">How It Works</h3>
            <p className="text-sm text-gray-600 font-medium">
              Connect your platforms to enable simultaneous publishing
            </p>
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#4a9082] transition-colors group">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-[#4a9082] rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              1
            </div>
               <h4 className="font-black text-lg text-black">Connect</h4>
            </div>
             <p className="text-sm text-gray-600">Toggle the switch to connect your platform account</p>
          </div>
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#f8d902] transition-colors group">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-[#f8d902] rounded-xl flex items-center justify-center text-black font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              2
            </div>
               <h4 className="font-black text-lg text-black">Authorize</h4>
            </div>
             <p className="text-sm text-gray-600">Grant secure permissions through OAuth</p>
          </div>
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#4a9082] transition-colors group">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-[#4a9082] rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              3
            </div>
               <h4 className="font-black text-lg text-black">Publish</h4>
            </div>
             <p className="text-sm text-gray-600">Start publishing to all connected platforms</p>
          </div>
        </div>
      </div>

      <PlatformDisplay
        platforms={Object.values(Platform)}
        connectedPlatforms={platforms}
        variant="list"
        showConnectButton={true}
        userId={userId}
        onConnect={(platform) => {
          if (platform !== Platform.YouTube) {
            handleTogglePlatform(platform);
          }
        }}
        onPlatformClick={(platform) => {
          if (platforms.includes(platform)) {
            handleTogglePlatform(platform);
          }
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h4 className="text-lg font-black text-black mb-2">OAuth 2.0</h4>
          <p className="text-sm text-gray-600 font-medium">Industry-standard authentication protocol</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f8d902] to-[#e5c800] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-lg font-black text-black mb-2">End-to-End</h4>
          <p className="text-sm text-gray-600 font-medium">Your data encrypted from source to destination</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-black text-black mb-2">256-bit SSL</h4>
          <p className="text-sm text-gray-600 font-medium">Military-grade encryption for all connections</p>
        </div>
      </div>
    </div>
  );
};

export default PlatformManager;

