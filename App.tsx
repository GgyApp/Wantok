
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavBar } from './components/NavBar';
import { FeedCard } from './components/FeedCard';
import { ProfileView } from './components/ProfileView';
import { AdManager } from './components/AdManager';
import { CreatePost } from './components/CreatePost';
import { WantokAssistant } from './components/WantokAssistant';
import { SearchView } from './components/SearchView';
import { TapaBorder } from './components/ui/TapaPattern';
import { Post, User, Tab } from './types';
import { generateInitialFeed } from './services/geminiService';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Virtualization State
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // User State - Initialized as unverified to demonstrate flow
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u_curr',
    name: 'Josephine K',
    handle: 'josie_png',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=josie',
    isVerified: false, 
    earnings: 1450.50,
    accountType: 'personal'
  });

  const handleUserVerification = () => {
      setCurrentUser(prev => ({ ...prev, isVerified: true }));
  };

  useEffect(() => {
    // Load initial feed
    const loadFeed = async () => {
      try {
        const feed = await generateInitialFeed();
        // Duplicate feed to demonstrate scrolling performance
        const extendedFeed = [
            ...feed, 
            ...feed.map(p => ({...p, id: p.id + '_2'})), 
            ...feed.map(p => ({...p, id: p.id + '_3'})),
            ...feed.map(p => ({...p, id: p.id + '_4'}))
        ];
        setPosts(extendedFeed);
      } catch (e) {
        console.error("Feed load failed", e);
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const handlePostCreated = (newPost: Post) => {
      setPosts(prev => [newPost, ...prev]);
      setCurrentTab('home');
      // Reset scroll to top
      if (feedContainerRef.current) {
          feedContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveFeedIndex(0);
      }
  };

  // Scroll Handler for Virtualization
  const handleFeedScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      // Calculate current index based on scroll position and container height
      const index = Math.round(container.scrollTop / container.clientHeight);
      
      if (index !== activeFeedIndex) {
          setActiveFeedIndex(index);
      }
  }, [activeFeedIndex]);

  return (
    <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-0 sm:p-6 font-sans">
      
      {/* Mobile Shell Constraint */}
      <div className="w-full h-[100vh] sm:h-[850px] sm:w-[420px] bg-black sm:rounded-[3rem] overflow-hidden relative shadow-2xl border-0 sm:border-8 border-neutral-900 ring-4 ring-black/50">
        
        {/* Dynamic Header (Only visible on home for branding) */}
        {currentTab === 'home' && (
           <div className="absolute top-0 left-0 right-0 z-40 pt-4 sm:pt-10 pb-4 px-4 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center pointer-events-none">
             <div className="flex items-center gap-1 pointer-events-auto">
                <span className="material-symbols-rounded text-png-red text-3xl drop-shadow-lg">auto_awesome_mosaic</span>
                <span className="text-white font-bold tracking-tight text-xl drop-shadow-md">Wantok</span>
             </div>
             <div className="flex gap-6 text-white/80 text-sm font-semibold pointer-events-auto">
                <span className="opacity-50 hover:opacity-100 transition cursor-pointer">Following</span>
                <span className="text-white border-b-2 border-png-yellow pb-1 cursor-pointer">For You</span>
             </div>
             <button 
                onClick={() => setCurrentTab('search')}
                className="material-symbols-rounded text-white text-2xl drop-shadow-md pointer-events-auto cursor-pointer hover:scale-110 transition"
             >
                search
             </button>
           </div>
        )}

        {/* Top Status Bar Decoration (Mobile Simulation) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 z-50">
             <TapaBorder />
        </div>

        {/* Wantok AI Assistant Overlay */}
        {(currentTab === 'home' || currentTab === 'search') && <WantokAssistant />}

        {/* Content Area */}
        <main className="h-full w-full bg-black relative">
          
          {/* HOME FEED */}
          {currentTab === 'home' && (
            <div 
                ref={feedContainerRef}
                onScroll={handleFeedScroll}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-20"
            >
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-white gap-6">
                   <div className="w-12 h-12 border-4 border-png-red border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-xs tracking-widest uppercase animate-pulse text-png-yellow">Connecting to Wantok...</p>
                </div>
              ) : (
                posts.map((post, index) => {
                    // Windowing Logic: Only render +/- 1 index from active
                    const shouldRender = Math.abs(index - activeFeedIndex) <= 1;
                    
                    return (
                        <div key={post.id} className="h-full w-full snap-start relative">
                            {shouldRender ? (
                                <FeedCard post={post} />
                            ) : (
                                // Placeholder to maintain scroll height/physics
                                <div className={`w-full h-full bg-gradient-to-br ${post.backgroundGradient} opacity-20`} />
                            )}
                        </div>
                    );
                })
              )}
            </div>
          )}

          {/* SEARCH SCREEN */}
          {currentTab === 'search' && (
             <SearchView posts={posts} />
          )}

          {/* CREATE SCREEN */}
          {currentTab === 'create' && (
            <CreatePost 
                onPostCreated={handlePostCreated} 
                onCancel={() => setCurrentTab('home')}
            />
          )}

          {/* PROFILE SCREEN */}
          {currentTab === 'profile' && (
            <div className="h-full pb-20 animate-fade-in bg-gray-50">
              <ProfileView 
                user={currentUser} 
                onSwitchToBusiness={() => setCurrentTab('business')} 
                onVerify={handleUserVerification}
              />
            </div>
          )}

          {/* AD MANAGER SCREEN */}
          {currentTab === 'business' && (
             <div className="h-full bg-gray-50 pb-20 animate-fade-in">
                 <AdManager onBack={() => setCurrentTab('profile')} />
             </div>
          )}

        </main>

        {/* Bottom Nav */}
        <NavBar currentTab={currentTab} setTab={setCurrentTab} />
      
      </div>
    </div>
  );
};

export default App;
