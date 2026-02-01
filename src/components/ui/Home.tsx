import React, { useMemo } from 'react';
import { VideoRecord, Platform } from '../../types';
import StatCard from './StatCard';
import InsightCard from './InsightCard';
import { Sparkles, TrendingUp, Users, Video, Globe } from 'lucide-react';

interface HomeProps {
  records: VideoRecord[];
  connectedPlatforms: Platform[];
  user?: { name?: string; email?: string };
  onNavigateToUpload: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToManager: () => void;
}

const Home: React.FC<HomeProps> = ({ records, connectedPlatforms, user, onNavigateToUpload, onNavigateToDashboard, onNavigateToManager }) => {
  const stats = useMemo(() => {
    const totalVideos = records.length;
    const totalViews = records.reduce((sum, r) => sum + (r.totalViews || 0), 0);
    const totalLikes = records.reduce((sum, r) => sum + (r.totalLikes || 0), 0);
    const activePlatforms = connectedPlatforms.length;
    
    return {
      totalVideos,
      totalViews,
      totalLikes,
      activePlatforms
    };
  }, [records, connectedPlatforms]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-xl flex items-center justify-center shadow-lg shadow-[#4a9082]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Studio Home</h1>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 rounded-[2rem] border border-white shadow-xl shadow-gray-200/50">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
              </div>
            ))}
          </div>
          <div className="pr-4 py-1">
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Community</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">1.2k Creators Online</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Production"
          value={stats.totalVideos.toString()}
          icon={<Video className="w-5 h-5" />}
          trend="+12% Volume"
        />
        <StatCard
          title="Global Reach"
          value={stats.totalViews.toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+24% Traffic"
        />
        <StatCard
          title="Engagement"
          value={stats.totalLikes.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="+18% Pulse"
        />
        <StatCard
          title="Platforms"
          value={stats.activePlatforms.toString()}
          icon={<Globe className="w-5 h-5" />}
          trend="Active Hubs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group">
          <InsightCard
            title="Recent Sequences"
            insights={records.slice(0, 5).map(r => ({
              label: r.title || 'Untitled Video',
              value: `${r.totalViews || 0} views`,
              trend: r.totalLikes ? `+${r.totalLikes} likes` : undefined
            }))}
          />
        </div>
        <div className="group">
          <InsightCard
            title="Platform Distribution"
            insights={connectedPlatforms.map(p => ({
              label: p,
              value: `${records.filter(r => r.platforms?.includes(p)).length} clips`,
              trend: 'Live Status'
            }))}
          />
        </div>
      </div>

      {/* AI Suggestion Banner for Home */}
      <div className="relative p-10 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#4a9082]/10 to-purple-500/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-gray-200/50">
                <Sparkles className="w-6 h-6 text-[#4a9082]" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ready to go Viral?</h3>
            </div>
            <p className="text-gray-500 font-bold leading-relaxed max-w-lg">Our AI model suggests that your next 9:16 vertical video could increase engagement by 40% on TikTok compared to your previous posts.</p>
          </div>
          <button 
            onClick={() => onNavigateToUpload()}
            className="px-10 py-5 bg-[#4a9082] text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#4a9082]/30 hover:scale-105 active:scale-95 transition-all"
          >
            New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
