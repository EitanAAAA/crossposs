import React, { useMemo, useState } from 'react';
import { VideoRecord, PublishStatus, Platform } from '../../types/index';
import { PLATFORM_CONFIGS } from '../../constants/index';
import VideoOptimizer from './VideoOptimizer';
import PlatformDisplay from './PlatformDisplay';
import StatCard from './StatCard';
import InsightCard from './InsightCard';

interface DashboardProps {
  records: VideoRecord[];
  connectedPlatforms?: Platform[];
  user?: { name?: string; email?: string };
  onOptimizeVideo?: (record: VideoRecord) => void;
  onNavigateToUpload?: () => void;
  onNavigateToManager?: () => void;
}

const StatusBadge: React.FC<{ status: PublishStatus }> = ({ status }) => {
  const styles = {
    [PublishStatus.Pending]: 'text-gray-500 bg-gray-100 border-gray-200',
    [PublishStatus.Uploading]: 'text-[#4a9082] bg-[#f0f8f6] border-[#4a9082]/20 animate-pulse',
    [PublishStatus.Success]: 'text-[#4a9082] bg-[#f0f8f6] border-[#4a9082]/30',
    [PublishStatus.Failed]: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  records, 
  connectedPlatforms = [],
  user,
  onOptimizeVideo,
  onNavigateToUpload,
  onNavigateToManager
}) => {
  const [selectedRecord, setSelectedRecord] = useState<VideoRecord | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PublishStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'videos' | 'platforms' | 'analytics'>('videos');

  const displayName = useMemo(() => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  }, [user]);

  const stats = useMemo(() => {
    const total = records.length;
    const successCount = records.reduce((acc, r) => 
      acc + (r.platformStatuses || []).filter(ps => ps.status === PublishStatus.Success).length, 0
    );
    const totalPlatforms = records.reduce((acc, r) => acc + (r.platformStatuses || []).length, 0);
    const successRate = totalPlatforms > 0 ? Math.round((successCount / totalPlatforms) * 100) : 0;
    const pendingCount = records.reduce((acc, r) => 
      acc + (r.platformStatuses || []).filter(ps => ps.status === PublishStatus.Pending || ps.status === PublishStatus.Uploading).length, 0
    );
    const totalViews = Math.floor(Math.random() * 100000) + 50000;
    const avgEngagement = Math.floor(Math.random() * 10) + 5;

    const platformStats = Object.values(Platform).map(platform => {
      const platformRecords = records.filter(r => 
        (r.platformStatuses || []).some(ps => ps.platform === platform)
      );
      const successPlatformCount = platformRecords.reduce((acc, r) => 
        acc + (r.platformStatuses || []).filter(ps => ps.platform === platform && ps.status === PublishStatus.Success).length, 0
      );
      return {
        platform,
        count: platformRecords.length,
        successCount: successPlatformCount
      };
    });

    const bestPlatform = platformStats.length
      ? platformStats.reduce((best, current) =>
          current.successCount > best.successCount ? current : best
        )
      : { platform: Platform.YouTube, successCount: 0 };

    return { 
      total, 
      successCount, 
      successRate, 
      pendingCount,
      totalViews,
      avgEngagement,
      platformStats,
      bestPlatform
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const platformStatuses = record.platformStatuses || [];
      const matchesPlatform = filterPlatform === 'all' || 
        platformStatuses.some(ps => ps.platform === filterPlatform);
      const matchesStatus = filterStatus === 'all' || 
        platformStatuses.some(ps => ps.status === filterStatus);
      const matchesSearch = searchQuery === '' || 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPlatform && matchesStatus && matchesSearch;
    });
  }, [records, filterPlatform, filterStatus, searchQuery]);

  const insights = useMemo(() => {
    const insights = [];
    
    if (stats.successRate >= 90) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Performance',
        description: `Your ${stats.successRate}% success rate is outstanding! Keep up the great work.`
      });
    } else if (stats.successRate < 70) {
      insights.push({
        type: 'warning' as const,
        title: 'Optimization Needed',
        description: `Your success rate is ${stats.successRate}%. Consider optimizing your videos for better results.`
      });
    }

    if (stats.bestPlatform) {
      insights.push({
        type: 'info' as const,
        title: 'Top Platform',
        description: `${stats.bestPlatform.platform} is performing best with ${stats.bestPlatform.successCount} successful uploads.`
      });
    }

    if (stats.pendingCount > 0) {
      insights.push({
        type: 'info' as const,
        title: 'Uploads in Progress',
        description: `${stats.pendingCount} video${stats.pendingCount > 1 ? 's' : ''} ${stats.pendingCount > 1 ? 'are' : 'is'} currently uploading.`
      });
    }

    return insights;
  }, [stats]);

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter mb-2">
            Welcome <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-[#4a9082] bg-[length:200%_auto]" style={{ animation: 'pulse 3s ease-in-out infinite' }}>{displayName}</span>
          </h1>
          <p className="text-gray-600 font-medium">Manage, optimize, and track your content</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-[#4a9082] transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </button>
          <select className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-[#4a9082] transition-all focus:outline-none">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <button className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-[#4a9082] transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button 
            onClick={onNavigateToUpload}
            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-[#4a9082] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-2 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-[#4a9082] to-[#3d7a6e] text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Videos
            </div>
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'platforms'
                ? 'bg-gradient-to-r from-[#4a9082] to-[#3d7a6e] text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Platforms
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#4a9082] to-[#3d7a6e] text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'videos' && (
        <>
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white/60 backdrop-blur-xl rounded-[40px] border-2 border-dashed border-gray-200/50 relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-[#4a9082]/5"></div>
        <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-[#4a9082] rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Your Vault is Empty</h3>
          <p className="text-gray-500 text-sm font-medium max-w-md text-center">
            Start uploading your first video to see it appear here
          </p>
        </div>
      </div>
          ) : (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Videos"
          value={stats.total}
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
          color="green"
          index={0}
        />
        <StatCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          trend={stats.successRate >= 90 ? "↑ Excellent" : stats.successRate >= 70 ? "↑ Good" : "→ Fair"}
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="purple"
          index={1}
        />
        <StatCard
          label="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          color="purple"
          index={2}
        />
        <StatCard
          label="Avg Engagement"
          value={`${stats.avgEngagement}%`}
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="gray"
          index={3}
        />
      </div>

      {insights.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border-2 border-gray-200/50 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-[#4a9082]/5"></div>
          <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2 relative z-10">
            <svg className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-[#4a9082] bg-clip-text text-transparent">AI Insights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {insights.map((insight, idx) => (
              <InsightCard
                key={idx}
                title={insight.title}
                description={insight.description}
                type={insight.type}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 border-2 border-gray-200/50 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-[#4a9082]/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl font-medium focus:border-purple-500 focus:outline-none transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
            className="px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl font-bold text-sm focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="all">All Platforms</option>
            {Object.values(Platform).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PublishStatus | 'all')}
            className="px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl font-bold text-sm focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            {Object.values(PublishStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.map((record, index) => (
          <div
            key={record.id}
              className="bg-white/60 backdrop-blur-xl rounded-[32px] border-2 border-gray-200/50 p-6 hover:shadow-2xl hover:border-purple-500 transition-all group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-[#4a9082]/20 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex gap-6">
                  <div className="w-32 h-48 bg-gray-100 flex-shrink-0 relative rounded-2xl overflow-hidden border-2 border-gray-200 group-hover:border-[#4a9082] transition-colors">
                  <video src={record.thumbnail} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowOptimizer(true);
                        }}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-all"
                        title="Optimize video"
                      >
                        <svg className="w-4 h-4 text-[#4a9082]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                  </div>
                </div>
                
                <div className="flex-grow space-y-3 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-xl text-black tracking-tight leading-tight mb-1 line-clamp-2 group-hover:text-[#4a9082] transition-colors">
                        {record.title || 'Untitled Archive'}
                      </h3>
                      <p className="text-[10px] font-bold text-[#4a9082] uppercase tracking-widest">
                        {new Date(record.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium line-clamp-2 leading-relaxed">
                    {record.description || 'No caption saved for this archive record.'}
                  </p>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {Math.floor(Math.random() * 10000).toLocaleString()} views
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {Math.floor(Math.random() * 500)} likes
                      </div>
                    </div>
                  </div>
              </div>
              
                <div className="pt-4 border-t-2 border-gray-100">
                <div className="flex flex-wrap gap-4">
                  {(record.platformStatuses || []).map((ps, idx) => {
                    const platformColors = [
                      { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]' },
                      { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]' },
                      { bg: 'bg-[#4a9082]', border: 'border-[#4a9082]' },
                      { bg: 'bg-[#f8d902]', border: 'border-[#f8d902]' },
                    ];
                    const pColor = platformColors[idx % platformColors.length];
                    return (
                      <div key={ps.platform} className="flex items-center gap-3 group/platform">
                          <div className={`w-12 h-12 ${pColor.bg} rounded-xl flex items-center justify-center border-2 ${pColor.border} group-hover/platform:scale-110 transition-transform`}>
                            <svg className={`w-6 h-6 ${idx % 2 === 0 ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor">
                            {PLATFORM_CONFIGS[ps.platform].icon}
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                            {ps.platform?.split(' ')[0] || ps.platform || 'Unknown'}
                          </span>
                          <StatusBadge status={ps.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-500">No videos found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
          </div>
        </div>
        </div>
          )}
        </>
      )}

      {activeTab === 'platforms' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border-2 border-gray-200/50 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-[#4a9082]/5"></div>
            <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-black tracking-tight mb-2">Connected Platforms</h2>
              <p className="text-gray-600 font-medium">
                {connectedPlatforms.length > 0 
                  ? `${connectedPlatforms.length} platform${connectedPlatforms.length > 1 ? 's' : ''} connected`
                  : 'No platforms connected yet'}
              </p>
            </div>
            {onNavigateToManager && (
              <button 
                onClick={onNavigateToManager}
                className="px-6 py-3 bg-[#4a9082] text-white rounded-xl font-bold hover:bg-[#3d7a6e] transition-all shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Platforms
              </button>
            )}
          </div>
          <PlatformDisplay
            platforms={Object.values(Platform)}
            connectedPlatforms={connectedPlatforms}
            variant="list"
            showConnectButton={true}
            onConnect={(platform) => {
              onNavigateToManager?.();
            }}
          />
            </div>
          </div>
        )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-[32px] p-8 border-2 border-gray-200 shadow-xl">
          <h2 className="text-4xl font-black text-black tracking-tight mb-8">Analytics & Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#4a9082]/10 to-transparent rounded-2xl p-6 border-2 border-[#4a9082]/20">
              <h3 className="text-xl font-black text-black mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Best Performing Platform</span>
                  <span className="text-lg font-black text-black">{stats.bestPlatform?.platform || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Total Reach</span>
                  <span className="text-lg font-black text-black">{stats.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Average Engagement</span>
                  <span className="text-lg font-black text-black">{stats.avgEngagement}%</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f8d902]/10 to-transparent rounded-2xl p-6 border-2 border-[#f8d902]/20">
              <h3 className="text-xl font-black text-black mb-4">Platform Distribution</h3>
              <div className="space-y-3">
                {stats.platformStats.map((ps, idx) => {
                  const percentage = stats.total > 0 ? Math.round((ps.count / stats.total) * 100) : 0;
                  return (
                    <div key={ps.platform}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">{ps.platform}</span>
                        <span className="text-sm font-black text-black">{ps.count} videos</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#4a9082] to-[#3d7a6e] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showOptimizer && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-black">Optimize Video</h2>
              <button
                onClick={() => {
                  setShowOptimizer(false);
                  setSelectedRecord(null);
                }}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VideoOptimizer
              videoFile={null}
              selectedPlatforms={selectedRecord.platformStatuses.map(ps => ps.platform)}
              onOptimize={(file, platform) => {
                console.log('Optimized:', file, platform);
                onOptimizeVideo?.(selectedRecord);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
