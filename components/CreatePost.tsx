
import React, { useState, useRef } from 'react';
import { analyzeImageForCaption, generateVeoVideo } from '../services/geminiService';
import { Post } from '../types';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  onCancel: () => void;
}

const CATEGORIES = ['Education', 'Culture', 'Development', 'Business', 'AI Art'] as const;

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onCancel }) => {
  const [mode, setMode] = useState<'upload' | 'veo'>('upload');
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [veoPrompt, setVeoPrompt] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Culture');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setSelectedImage(base64);
      
      // Auto-analyze with Gemini 3 Pro
      setAnalyzing(true);
      const mimeType = file.type;
      const data = base64.split(',')[1]; // Remove header
      const suggestedCaption = await analyzeImageForCaption(data, mimeType);
      setCaption(suggestedCaption);
      setAnalyzing(false);
    }
  };

  const handleVeoGenerate = async () => {
    if (!veoPrompt) return;
    
    // Check for Paid Key Selection Requirement for Veo
    if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
            alert("Veo requires a paid API key. Please select one in the dialog.");
            await (window as any).aistudio.openSelectKey();
            // Race condition mitigation: retry after short delay or assume success if user proceeds
        }
    }

    setGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    try {
        const videoUrl = await generateVeoVideo(veoPrompt);
        if (videoUrl) {
            setGeneratedVideoUrl(videoUrl);
            setCaption(`AI Generated: ${veoPrompt} #Veo #WantokAI`);
            setCategory('AI Art'); // Auto-select AI Art for convenience
        }
    } catch (e) {
        alert("Video generation failed. Ensure you have a paid key selected.");
    } finally {
        setGeneratingVideo(false);
    }
  };

  const handlePublish = () => {
    const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: 'u_curr',
        username: 'josie_png',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=josie',
        content: caption,
        category: category,
        likes: 0,
        comments: 0,
        shares: 0,
        isVerified: true,
        backgroundGradient: 'from-gray-900 to-black',
        imageUrl: selectedImage || undefined,
        videoUrl: generatedVideoUrl || undefined
    };
    onPostCreated(newPost);
  };

  return (
    <div className="h-full bg-black flex flex-col items-center p-6 animate-fade-in relative">
      <div className="w-full flex justify-between items-center mb-6 text-white">
        <button onClick={onCancel} className="text-sm">Cancel</button>
        <h2 className="font-bold text-lg">Create</h2>
        <button 
            onClick={handlePublish}
            disabled={!caption && !selectedImage && !generatedVideoUrl}
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${(!caption && !selectedImage && !generatedVideoUrl) ? 'bg-gray-800 text-gray-500' : 'bg-[#CE1126] text-white'}`}
        >
            Post
        </button>
      </div>

      {/* Toggle */}
      <div className="flex bg-gray-900 rounded-lg p-1 mb-6 w-full max-w-xs">
          <button 
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${mode === 'upload' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}
          >
            Photo Upload
          </button>
          <button 
            onClick={() => setMode('veo')}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition ${mode === 'veo' ? 'bg-[#FAD201] text-black' : 'text-gray-500'}`}
          >
            AI Video (Veo)
          </button>
      </div>

      {/* UPLOAD MODE */}
      {mode === 'upload' && (
          <div className="w-full max-w-xs flex flex-col gap-4">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full aspect-square bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#FAD201] transition relative"
             >
                {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <span className="material-symbols-rounded text-4xl mb-2">add_a_photo</span>
                        <span className="text-xs">Tap to upload</span>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageSelect}
                />
             </div>

             <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                <div className="mb-3">
                    <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-black/40 text-white text-sm border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-[#FAD201]"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-400">Caption</label>
                    {analyzing && <span className="text-[10px] text-[#FAD201] animate-pulse">Gemini 3 Pro thinking...</span>}
                </div>
                <textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-transparent text-white text-sm focus:outline-none"
                    placeholder="Write something..."
                    rows={3}
                />
             </div>
          </div>
      )}

      {/* VEO VIDEO MODE */}
      {mode === 'veo' && (
          <div className="w-full max-w-xs flex flex-col gap-4">
             <div className="w-full aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800 flex items-center justify-center">
                 {generatingVideo ? (
                     <div className="text-center p-6">
                         <div className="w-12 h-12 border-4 border-[#FAD201] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                         <p className="text-white font-bold text-sm">Veo is dreaming...</p>
                         <p className="text-xs text-gray-500 mt-2">Generating 720p Video. This takes a moment.</p>
                     </div>
                 ) : generatedVideoUrl ? (
                     <video src={generatedVideoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                 ) : (
                     <div className="text-center text-gray-600 p-6">
                         <span className="material-symbols-rounded text-5xl mb-2">movie_filter</span>
                         <p className="text-xs">Enter a prompt to generate a unique video.</p>
                     </div>
                 )}
             </div>

             <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                 <textarea 
                    value={veoPrompt}
                    onChange={(e) => setVeoPrompt(e.target.value)}
                    placeholder="Ex: A futuristic Port Moresby skyline at sunset, cyberpunk style..."
                    className="w-full bg-transparent text-white text-sm focus:outline-none mb-2"
                    rows={2}
                 />
                 
                 <div className="mb-2">
                    <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-black/40 text-white text-sm border border-gray-700 rounded-lg p-2 focus:outline-none focus:border-[#FAD201]"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>

                 <button 
                    onClick={handleVeoGenerate}
                    disabled={!veoPrompt || generatingVideo}
                    className={`w-full py-3 rounded-lg font-bold text-xs ${!veoPrompt || generatingVideo ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-[#CE1126] to-[#FAD201] text-black shadow-lg shadow-orange-900/40'}`}
                 >
                    {generatingVideo ? 'Generating...' : 'Generate with Veo'}
                 </button>
             </div>
          </div>
      )}

    </div>
  );
};
