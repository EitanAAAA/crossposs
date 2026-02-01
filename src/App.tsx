import React, { useState, useEffect } from 'react';
import Header from './components/ui/Header';
import LandingPage from './components/ui/LandingPage';
import Auth from './components/ui/Auth';
import Settings from './components/ui/Settings';
import VideoPreview from './components/ui/VideoPreview';
import MetadataForm from './components/ui/MetadataForm';
import PlatformSelector from './components/ui/PlatformSelector';
import PlatformPreview from './components/ui/PlatformPreview';
import Dashboard from './components/ui/Dashboard';
import Home from './components/ui/Home';
import PlatformManager from './components/ui/PlatformManager';
import VideoEditor from './components/ui/VideoEditor';
import ProjectTypeSelector from './components/ui/ProjectTypeSelector';
import InstagramBackgroundAnimations from './components/animations/InstagramBackgroundAnimations';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarRail, SidebarInset, SidebarTrigger, useSidebar } from './components/ui/Sidebar';
import { Platform, VideoRecord, UploadFormData, PlatformStatus, PublishStatus, User, ProjectType, Project } from './types';
import { Film, Sparkles, Music, Mic, Type, Plus, Layers } from 'lucide-react';
import { publishVideo } from './services/publishService';
import { db } from './services/db';
import { PLATFORM_CONFIGS } from './constants';

type View = 'landing' | 'home' | 'upload' | 'dashboard' | 'manager' | 'settings' | 'auth-login' | 'auth-signup' | 'ide' | 'post_type';
type Step = 'SELECT' | 'DETAILS' | 'REVIEW';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<View>('landing');
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('SELECT');
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    hashtags: '',
    selectedPlatforms: [Platform.TikTok],
    file: null
  });
  const [history, setHistory] = useState<VideoRecord[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<PlatformStatus[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const { isOpen } = useSidebar();

  // Initial View & OAuth Setup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get('google_auth');
    const userId = params.get('user_id');
    const viewParam = params.get('view');

    const path = window.location.pathname;
    const viewFromPath = path === '/' ? 'landing' : path.substring(1);
    const validViews: View[] = ['landing', 'home', 'upload', 'dashboard', 'manager', 'settings', 'auth-login', 'auth-signup', 'ide', 'post_type'];
    
    // Handle Google Auth Callback
    if (googleAuth === 'true' && userId) {
      setIsLoadingAuth(true);
      const fetchUser = async () => {
        try {
          // @ts-ignore
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const response = await fetch(`${API_URL}/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            updateView('home');
          }
        } catch (error) {
          console.error('Failed to fetch user after Google auth:', error);
        } finally {
          setIsLoadingAuth(false);
        }
      };
      fetchUser();
      return;
    }

    if (viewParam && validViews.includes(viewParam as View)) {
      setActiveView(viewParam as View);
    } else if (validViews.includes(viewFromPath as View)) {
      setActiveView(viewFromPath as View);
    }
    
    const savedUser = localStorage.getItem('crosspost_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        if (activeView === 'landing' || viewFromPath === 'landing') {
          setActiveView('home');
        }
      } catch (e) {
        localStorage.removeItem('crosspost_user');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('crosspost_user', JSON.stringify(user));
      db.getVideos(user.id).then(setHistory).catch(console.error);
      setConnectedPlatforms(user.connectedPlatforms || []);
    } else {
      localStorage.removeItem('crosspost_user');
      setConnectedPlatforms([]);
    }
  }, [user]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const viewFromPath = path === '/' ? 'landing' : path.substring(1);
      const validViews: View[] = ['landing', 'home', 'upload', 'dashboard', 'manager', 'settings', 'auth-login', 'auth-signup', 'ide', 'post_type'];
      if (validViews.includes(viewFromPath as View)) {
        setActiveView(viewFromPath as View);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateView = (newView: View) => {
    setActiveView(newView);
    const path = newView === 'landing' ? '/' : `/${newView}`;
    // Clear search parameters when navigating
    window.history.pushState({ view: newView }, '', path);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crosspost_user');
    updateView('landing');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf0]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#4a9082] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <span className="text-white font-semibold text-2xl">C</span>
          </div>
          <p className="text-lg font-bold text-gray-700">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative flex flex-col">
        <InstagramBackgroundAnimations />
        <Header currentTab={activeView} onTabChange={updateView} user={user} />
        <main className={`max-w-[90rem] mx-auto mt-4 flex-grow w-full relative z-10 ${activeView === 'landing' ? 'px-1' : 'px-6'}`}>
          {activeView === 'landing' && <LandingPage onStart={() => updateView('auth-signup')} />}
          {(activeView === 'auth-login' || activeView === 'auth-signup') && (
            <Auth 
              key={activeView}
              mode={activeView === 'auth-login' ? 'login' : 'signup'} 
              onLogin={handleLogin} 
              onSwitchMode={(mode) => updateView(mode === 'login' ? 'auth-login' : 'auth-signup')}
            />
          )}
        </main>
      </div>
    );
  }

  if (activeView === 'post_type') {
    return (
      <div className="min-h-screen bg-[#fffcf0] flex items-center justify-center">
        <ProjectTypeSelector 
          onSelect={(type, name) => {
            setSelectedProjectType(type);
            setCurrentProjectName(name);
            updateView('ide');
          }} 
          onBack={() => updateView('home')}
        />
      </div>
    );
  }

  if (activeView === 'ide') {
    return (
      <div className="w-screen h-screen bg-white">
        <VideoEditor 
          projectType={selectedProjectType || ProjectType.Video} 
          projectName={currentProjectName}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#fffcf0] overflow-hidden">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100/50">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] rounded-2xl flex items-center justify-center text-white font-semibold text-2xl shadow-lg border-b-4 border-black/10 flex-shrink-0 cursor-pointer" onClick={() => updateView('home')}>C</div>
            <div className="flex flex-col -space-y-1 overflow-hidden">
              <span className="font-semibold text-xl text-[#2d3436] tracking-tight">Studio</span>
              <span className="text-[10px] font-bold text-[#f8d902] uppercase tracking-widest">Editor</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="px-4 py-4 space-y-4">
            {/* 1. New Project Button */}
            <button 
              onClick={() => updateView('post_type')}
              className={`w-full flex items-center justify-center bg-[#4a9082] text-white rounded-xl font-bold shadow-lg shadow-[#4a9082]/20 hover:bg-[#3d7a6e] transition-all active:scale-95 ${isOpen ? 'gap-2 py-3' : 'py-4'}`}
            >
              <Plus className="w-5 h-5" />
              {isOpen && <span className="text-sm uppercase tracking-widest">New Project</span>}
            </button>

            <SidebarMenu>
              {/* 2. Home */}
              <SidebarMenuItem 
                active={activeView === 'landing'} 
                onClick={() => updateView('landing')}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              >
                Home
              </SidebarMenuItem>

              {/* 3. Dashboard */}
              <SidebarMenuItem 
                active={activeView === 'home'} 
                onClick={() => updateView('home')}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              >
                Dashboard
              </SidebarMenuItem>

              {/* 4. Post (with dropdown) */}
              <div className="space-y-1">
                <button 
                  onClick={() => {
                    setIsProjectsOpen(!isProjectsOpen);
                    updateView('dashboard');
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-[#4a9082]/10 text-[#4a9082]' : 'hover:bg-gray-100 text-gray-700'} ${isOpen ? 'justify-between' : 'justify-center'}`}
                  title={!isOpen ? "Post" : undefined}
                >
                  <div className={`flex items-center ${isOpen ? 'gap-3' : ''}`}>
                    <Layers className={`w-6 h-6 ${activeView === 'dashboard' ? 'text-[#4a9082]' : 'text-gray-400 group-hover:text-[#4a9082]'}`} />
                    {isOpen && <span className="font-medium">Post</span>}
                  </div>
                  {isOpen && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isProjectsOpen ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {isOpen && (
                  <div className={`overflow-hidden transition-all duration-300 ${isProjectsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-11 pr-2 py-2 space-y-1">
                      {projects.slice(0, 3).map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            setSelectedProjectType(p.type);
                            updateView('ide');
                          }}
                          className="w-full text-left py-2 text-sm text-gray-500 hover:text-gray-900 truncate transition-colors"
                        >
                          {p.name}
                        </button>
                      ))}
                      {projects.length === 0 && (
                        <p className="text-xs text-gray-400 italic py-2">No recent posts</p>
                      )}
                      
                      {/* New Post button inside dropdown */}
                      <button 
                        onClick={() => updateView('post_type')}
                        className="w-full flex items-center gap-2 py-2 text-[#4a9082] text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform mt-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add New Post
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. History */}
              <SidebarMenuItem 
                active={activeView === 'dashboard'} 
                onClick={() => updateView('dashboard')}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              >
                History
              </SidebarMenuItem>

              {/* 6. Platforms */}
              <SidebarMenuItem 
                active={activeView === 'manager'} 
                onClick={() => updateView('manager')}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              >
                Platforms
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem 
              active={activeView === 'settings'} 
              onClick={() => updateView('settings')}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            >
              Settings
            </SidebarMenuItem>
            <SidebarMenuItem 
              variant="danger"
              onClick={handleLogout}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}
            >
              Log Out
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <main className="flex-grow p-0 overflow-hidden h-screen flex flex-col bg-white">
          <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl shadow-sm">
            <div className="max-w-[90rem] mx-auto px-6 py-4 flex items-center justify-between gap-8">
              <div className="flex items-center gap-4 flex-shrink-0">
                <SidebarTrigger />
                <div className="h-6 w-px bg-gray-200/50 mx-2"></div>
                {activeView === 'home' ? (
                  <h2 className="text-xl font-semibold text-black tracking-tight">Home</h2>
                ) : (
                  <h2 className="text-xl font-semibold text-black tracking-tight capitalize">{activeView}</h2>
                )}
              </div>

              <div className="flex-1 max-w-md relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search projects & assets..."
                  className="w-full px-4 py-2 pl-10 bg-white/40 backdrop-blur-sm border border-gray-200/50 rounded-xl font-medium focus:bg-white/60 focus:ring-2 focus:ring-[#4a9082]/20 outline-none text-sm transition-all"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-6 flex-shrink-0">
                {activeView === 'home' && (
                  <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
                    <button className="bg-[#4a9082] hover:bg-[#3d7a6e] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-[#4a9082]/20 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Export Render
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm">
                  <button className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-all shadow-sm group">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-all shadow-sm group">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-all shadow-sm group"
                  >
                    {isDarkMode ? (
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l-2 border-gray-200/30">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-black">{user?.name || 'User'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{user?.email || 'Creator'}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-[#4a9082] border-2 border-white shadow-xl flex items-center justify-center text-white font-semibold text-lg">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {activeView === 'home' && user && (
              <div className="flex-1 overflow-y-auto p-8 h-full">
                <Home 
                  records={history}
                  connectedPlatforms={connectedPlatforms}
                  user={user || undefined}
                  onNavigateToUpload={() => { updateView('post_type'); }}
                  onNavigateToDashboard={() => updateView('dashboard')}
                  onNavigateToManager={() => updateView('manager')}
                />
              </div>
            )}
            {activeView !== 'home' && activeView !== 'ide' && (
              <div className="flex-1 overflow-y-auto p-8 h-full">
            {activeView === 'dashboard' && (
              <div className="max-w-[100rem] mx-auto">
                <Dashboard 
                  records={history}
                  connectedPlatforms={connectedPlatforms}
                  user={user || undefined}
                  onOptimizeVideo={(record) => {
                    console.log('Optimizing video:', record.id);
                  }}
                  onNavigateToUpload={() => { setCurrentStep('SELECT'); updateView('upload'); }}
                  onNavigateToManager={() => updateView('manager')}
                />
              </div>
            )}
            {activeView === 'manager' && (
              <div className="max-w-7xl mx-auto">
                <PlatformManager 
                  connectedPlatforms={connectedPlatforms}
                  userId={user?.id}
                  onUpdatePlatforms={(platforms) => {
                    setConnectedPlatforms(platforms);
                    if (user) {
                      db.updateUser(user.id, { connectedPlatforms: platforms }).catch(console.error);
                    }
                  }}
                />
              </div>
            )}
                {activeView === 'settings' && user && <Settings onLogout={handleLogout} userEmail={user.email || ''} />}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppContent />
    </SidebarProvider>
  );
};

export default App;
