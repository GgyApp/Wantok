
import React, { useState, useMemo } from 'react';
import { Post } from '../types';

interface SearchViewProps {
  posts: Post[];
}

export const SearchView: React.FC<SearchViewProps> = ({ posts }) => {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    // If no query, we could show trending. For now, show all.
    const lowerQuery = query.toLowerCase();
    return posts.filter(p => 
      p.content.toLowerCase().includes(lowerQuery) || 
      p.username.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, posts]);

  const trendingTags = ['#PNGPride', '#Culture', '#Education', '#Music', 'Lae', 'Port Moresby'];

  return (
    <div className="h-full bg-black flex flex-col animate-fade-in w-full">
       {/* Header with Search Bar */}
       <div className="pt-14 pb-4 px-4 bg-black sticky top-0 z-20 w-full">
          <div className="relative w-full">
             <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
             <input 
                type="text" 
                autoFocus
                placeholder="Search posts, tags, or users..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-neutral-900 text-white rounded-2xl py-3 pl-12 pr-10 focus:outline-none focus:ring-1 focus:ring-[#CE1126] placeholder-gray-500 text-sm"
             />
             {query && (
                 <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1">
                     <span className="material-symbols-rounded text-lg">cancel</span>
                 </button>
             )}
          </div>
          
          {/* Tags / Categories Suggestion */}
          {!query && (
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar w-full">
                  {trendingTags.map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setQuery(tag)} 
                        className="px-4 py-1.5 bg-neutral-900 rounded-full text-xs font-medium text-gray-300 whitespace-nowrap border border-neutral-800 hover:border-[#FAD201] transition"
                      >
                          {tag}
                      </button>
                  ))}
              </div>
          )}
       </div>

       {/* Results Grid */}
       <div className="flex-1 overflow-y-auto pb-24 px-2 no-scrollbar w-full">
           {query && filteredPosts.length === 0 ? (
               <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                   <span className="material-symbols-rounded text-5xl mb-3 opacity-30">search_off</span>
                   <p className="text-sm font-medium">No results found for "{query}"</p>
               </div>
           ) : (
               <div className="grid grid-cols-2 gap-2 pb-6">
                   {filteredPosts.map(post => (
                       <div key={post.id} className={`aspect-[3/4] relative bg-gradient-to-br ${post.backgroundGradient} rounded-xl overflow-hidden group border border-white/5`}>
                            {post.videoUrl ? (
                                <video src={post.videoUrl} className="w-full h-full object-cover opacity-90" muted playsInline />
                            ) : post.imageUrl ? (
                                <img src={post.imageUrl} className="w-full h-full object-cover opacity-90" alt="Post" />
                            ) : (
                                // Text only post visualization (Abstract)
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                     <p className="text-white text-[8px] font-bold text-center opacity-30 scale-[2] blur-[1px] select-none leading-relaxed line-clamp-6">
                                        {post.content} {post.content}
                                     </p>
                                </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            
                            {/* Post Info */}
                            <div className="absolute bottom-3 left-3 right-3 z-10">
                                 <p className="text-white text-xs font-bold line-clamp-2 mb-2 leading-snug shadow-black drop-shadow-md">{post.content}</p>
                                 <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                                    <img src={post.userAvatar} className="w-4 h-4 rounded-full bg-gray-800 border border-white/20" alt="Avatar" />
                                    <span className="truncate font-medium max-w-[60px]">{post.username}</span>
                                    <div className="flex items-center gap-0.5 ml-auto opacity-80">
                                        <span className="material-symbols-rounded text-[10px]">favorite</span>
                                        <span>{post.likes > 999 ? (post.likes/1000).toFixed(1) + 'k' : post.likes}</span>
                                    </div>
                                 </div>
                            </div>
                       </div>
                   ))}
               </div>
           )}
       </div>
    </div>
  );
};
