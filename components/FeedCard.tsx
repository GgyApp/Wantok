
import React, { useState, useRef, useEffect } from 'react';
import { Post } from '../types';
import { generateSpeech } from '../services/geminiService';

interface FeedCardProps {
  post: Post;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        setIsPlaying(false);
      }
      return;
    }

    setLoadingAudio(true);
    try {
      const base64Audio = await generateSpeech(post.content);
      
      if (base64Audio) {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        
        sourceRef.current = source;
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Audio playback error", e);
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className={`relative w-full h-full snap-start bg-gradient-to-br ${post.backgroundGradient} flex flex-col justify-end p-6 overflow-hidden border-b border-white/5`}>
      
      {/* Dynamic Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Video Content Layer */}
      {post.videoUrl && (
        <video 
          src={post.videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />
      )}

      {/* Image Content Layer */}
      {post.imageUrl && !post.videoUrl && (
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        />
      )}

      {/* Right Side Actions (TikTok Style) */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
        
        <div className="relative">
          <img src={post.userAvatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-[#FAD201] bg-white object-cover" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#CE1126] text-white text-[10px] px-1.5 rounded-full font-bold">
            {post.isAd ? 'AD' : '+'}
          </div>
        </div>

        <button className="flex flex-col items-center gap-1 text-white opacity-90 hover:opacity-100 transition">
          <span className="material-symbols-rounded text-3xl shadow-sm filter drop-shadow-md">favorite</span>
          <span className="text-xs font-medium shadow-black drop-shadow-md">{post.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white opacity-90 hover:opacity-100 transition">
          <span className="material-symbols-rounded text-3xl filter drop-shadow-md">chat_bubble</span>
          <span className="text-xs font-medium shadow-black drop-shadow-md">{post.comments}</span>
        </button>

        <button 
          onClick={handlePlayAudio}
          className={`flex flex-col items-center gap-1 transition ${isPlaying ? 'text-[#FAD201] scale-110' : 'text-white opacity-90 hover:opacity-100'}`}
        >
          {loadingAudio ? (
            <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
          ) : (
            <span className="material-symbols-rounded text-3xl filter drop-shadow-md">
              {isPlaying ? 'volume_up' : 'text_to_speech'}
            </span>
          )}
          <span className="text-xs font-medium shadow-black drop-shadow-md">{isPlaying ? 'Playing' : 'Listen'}</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white opacity-90 hover:opacity-100 transition">
          <span className="material-symbols-rounded text-3xl filter drop-shadow-md">share</span>
          <span className="text-xs font-medium shadow-black drop-shadow-md">{post.shares}</span>
        </button>

        {/* Wantok Specific: Support/Tip Button - Only on organic posts */}
        {!post.isAd && (
          <button className="flex flex-col items-center gap-1 text-[#FAD201] hover:scale-110 transition animate-pulse">
             <div className="w-10 h-10 rounded-full bg-black/40 border border-[#FAD201] flex items-center justify-center backdrop-blur-sm">
               <span className="material-symbols-rounded text-2xl">payments</span>
             </div>
             <span className="text-[10px] font-bold text-[#FAD201]">Tip Creator</span>
          </button>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-[85%]">
        {/* Verification Badge */}
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-lg shadow-black drop-shadow-md">@{post.username}</h3>
            {post.isVerified && (
                <span className="material-symbols-rounded text-[#FAD201] text-lg bg-black/20 rounded-full" title="NID Verified">verified</span>
            )}
        </div>

        {/* Content Category Tag */}
        <div className={`inline-block px-2 py-0.5 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider mb-2 border border-white/10 ${post.isAd ? 'bg-[#FAD201]/90 text-black' : 'bg-white/20'}`}>
          {post.category}
        </div>

        {/* Main Text Content */}
        <p className="text-white/90 text-lg leading-snug font-medium shadow-black drop-shadow-lg mb-4">
          {post.content}
        </p>

        {/* Call To Action for Ads */}
        {post.isAd && (
            <button className="w-full bg-[#CE1126] hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between mb-4 shadow-lg shadow-red-900/40 transition">
                <span>{post.ctaText || 'Learn More'}</span>
                <span className="material-symbols-rounded">arrow_forward</span>
            </button>
        )}

        {/* Music / Audio Tag (Organic only) */}
        {!post.isAd && (
            <div className="flex items-center gap-2 text-white/70 text-xs">
                <span className="material-symbols-rounded text-sm animate-spin-slow">music_note</span>
                <span className="truncate w-32">Original Sound - PNG Vibe</span>
            </div>
        )}
        
        {/* Sponsored Label */}
        {post.isAd && (
             <div className="flex items-center gap-1 text-white/60 text-[10px] uppercase font-bold">
                <span className="material-symbols-rounded text-xs">campaign</span>
                Promoted Content
             </div>
        )}
      </div>

    </div>
  );
};
