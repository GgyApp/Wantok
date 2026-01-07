
import React, { useState, useRef } from 'react';
import { TapaBorder } from './ui/TapaPattern';
import { AdCampaign } from '../types';

interface AdManagerProps {
  onBack: () => void;
}

export const AdManager: React.FC<AdManagerProps> = ({ onBack }) => {
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'create'>('dashboard');
  
  // Create Ad State
  const [adContent, setAdContent] = useState('');
  const [adBudget, setAdBudget] = useState<string>('');
  const [adMedia, setAdMedia] = useState<string | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<AdCampaign['status']>('draft');
  const [scanStep, setScanStep] = useState(0);
  
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

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic size check (5MB limit for prototype)
      if (file.size > 5 * 1024 * 1024) {
          alert("File too large. Please upload under 5MB.");
          return;
      }
      const base64 = await fileToBase64(file);
      setAdMedia(base64);
    }
  };

  const startAiScan = () => {
    setCampaignStatus('scanning');
    setScanStep(0);
    
    // Simulate multi-step AI Compliance Check
    const steps = [
        "Scanning for banned languages (Only English/Tok Pisin/Motu allowed)...",
        "Checking against PNG Cybercrime Act 2016...",
        "Verifying image compliance (No nudity, gambling)...",
        "Checking for political misinformation...",
        "Calculating Creator Revenue Share..."
    ];

    let current = 0;
    const interval = setInterval(() => {
        current++;
        setScanStep(current);
        if (current >= steps.length) {
            clearInterval(interval);
            // Simple logic: if content contains "scam", reject it.
            if (adContent.toLowerCase().includes('scam') || adContent.toLowerCase().includes('bet')) {
                setCampaignStatus('rejected');
            } else {
                setCampaignStatus('approved');
            }
        }
    }, 1200);
  };

  const handleLaunch = () => {
    setCampaignStatus('active');
    setTimeout(() => {
        alert("Campaign Live! Check your dashboard.");
        setActiveScreen('dashboard');
        // Reset form for next time
        setCampaignStatus('draft');
        setAdContent('');
        setAdBudget('');
        setAdMedia(null);
    }, 1500);
  };

  const calculatedCreatorShare = adBudget ? (parseFloat(adBudget) * 0.60).toFixed(2) : '0.00';
  const calculatedPlatformShare = adBudget ? (parseFloat(adBudget) * 0.40).toFixed(2) : '0.00';

  const isVideo = (media: string) => typeof media === 'string' && media.startsWith('data:video');

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-y-auto relative no-scrollbar">
      
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white pb-6 pt-12 px-6 shadow-md relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 right-0">
            <TapaBorder />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
             <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Wantok Ad Manager
              <span className="px-2 py-0.5 bg-[#FAD201] text-black text-[10px] font-bold rounded uppercase">Beta</span>
            </h2>
            <p className="text-gray-400 text-xs">AI-Powered. PNG Law Compliant.</p>
          </div>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {activeScreen === 'dashboard' && (
          <div className="p-6">
             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Active Campaigns</h3>
                <div className="flex justify-between items-end">
                    <span className="text-3xl font-bold text-gray-900">0</span>
                    <button 
                        onClick={() => setActiveScreen('create')}
                        className="bg-[#CE1126] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg shadow-red-900/20"
                    >
                        <span className="material-symbols-rounded text-sm">add</span>
                        New Ad
                    </button>
                </div>
             </div>

             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-rounded text-blue-600">info</span>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Why Advertise on Wantok?</h4>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            Support the local digital economy. 
                            <span className="font-bold"> 60% of your ad spend goes directly to PNG content creators.</span>
                        </p>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* CREATE AD VIEW */}
      {activeScreen === 'create' && (
          <div className="p-6 pb-24 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Create New Campaign</h3>
              
              {/* Step 1: Content & Media */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">Ad Content (English, Tok Pisin, or Motu)</label>
                    <textarea 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:border-[#CE1126] focus:outline-none"
                        rows={3}
                        placeholder="Type your ad copy here..."
                        value={adContent}
                        onChange={(e) => setAdContent(e.target.value)}
                        disabled={campaignStatus !== 'draft'}
                    />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-2">Ad Visual (Image/Video)</label>
                     <div 
                       onClick={() => campaignStatus === 'draft' && fileInputRef.current?.click()}
                       className={`w-full aspect-[16/9] bg-gray-50 border-2 border-dashed ${adMedia ? 'border-[#CE1126]' : 'border-gray-200'} rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:bg-gray-50 transition`}
                     >
                        {adMedia ? (
                            isVideo(adMedia) ? (
                                <video src={adMedia} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                            ) : (
                                <img src={adMedia} alt="Ad Preview" className="w-full h-full object-cover" />
                            )
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <span className="material-symbols-rounded text-3xl">add_photo_alternate</span>
                                <span className="text-xs mt-1">Tap to upload</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*,video/*"
                            onChange={handleMediaSelect}
                            disabled={campaignStatus !== 'draft'}
                        />
                     </div>
                  </div>
              </div>

              {/* Step 2: Budget */}
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 mb-2">Total Budget (PGK)</label>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-bold">K</span>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-lg font-bold focus:border-[#CE1126] focus:outline-none"
                        placeholder="0.00"
                        value={adBudget}
                        onChange={(e) => setAdBudget(e.target.value)}
                        disabled={campaignStatus !== 'draft'}
                      />
                  </div>

                  {/* Revenue Split Transparency */}
                  {adBudget && (
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200 grid grid-cols-2 gap-2">
                         <div className="bg-green-50 p-2 rounded text-center">
                             <div className="text-[10px] text-green-700 font-medium">Creator Pool (60%)</div>
                             <div className="text-sm font-bold text-green-800">K {calculatedCreatorShare}</div>
                         </div>
                         <div className="bg-gray-50 p-2 rounded text-center">
                             <div className="text-[10px] text-gray-500 font-medium">Wantok Platform (40%)</div>
                             <div className="text-sm font-bold text-gray-700">K {calculatedPlatformShare}</div>
                         </div>
                      </div>
                  )}
              </div>

              {/* Step 3: Live Preview */}
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-rounded text-sm text-gray-500">visibility</span>
                      <span className="text-xs font-bold text-gray-500 uppercase">Live Feed Preview</span>
                  </div>
                  
                  {/* Mock Feed Card */}
                  <div className="w-full aspect-[3/5] bg-black rounded-lg relative overflow-hidden shadow-2xl mx-auto max-w-[280px] ring-1 ring-gray-900/10">
                        {/* Background */}
                        {adMedia ? (
                            isVideo(adMedia) ? (
                                <video src={adMedia} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
                            ) : (
                                <img src={adMedia} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Background" />
                            )
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80" />
                        )}
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                        {/* Right Sidebar */}
                        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 z-20 opacity-90">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200">
                                <span className="material-symbols-rounded text-black text-xs">storefront</span>
                            </div>
                            <div className="flex flex-col items-center text-white">
                                <span className="material-symbols-rounded text-xl shadow-sm">favorite</span>
                                <span className="text-[8px] font-bold">1.2k</span>
                            </div>
                            <div className="flex flex-col items-center text-white">
                                <span className="material-symbols-rounded text-xl shadow-sm">chat_bubble</span>
                                <span className="text-[8px] font-bold">45</span>
                            </div>
                             <div className="flex flex-col items-center text-white">
                                <span className="material-symbols-rounded text-xl shadow-sm">share</span>
                                <span className="text-[8px] font-bold">12</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10 text-left">
                            <div className="flex items-center gap-1.5 mb-2">
                                <h3 className="text-white font-bold text-sm shadow-black drop-shadow-md">@YourBusiness</h3>
                                <span className="material-symbols-rounded text-[#FAD201] text-sm" title="Verified">verified</span>
                            </div>
                            
                            <div className="inline-block px-1.5 py-0.5 bg-[#FAD201] text-black text-[8px] font-bold rounded mb-2 uppercase tracking-wide">
                                Sponsored
                            </div>

                            <p className="text-white text-xs leading-snug mb-3 line-clamp-3 shadow-black drop-shadow-md pr-8">
                                {adContent || "Your ad caption will appear here..."}
                            </p>

                            <div className="w-full bg-[#CE1126] text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-between shadow-lg shadow-red-900/40">
                                <span>Learn More</span>
                                <span className="material-symbols-rounded text-sm">arrow_forward</span>
                            </div>
                        </div>
                  </div>
              </div>

              {/* Step 4: AI Scan / Results */}
              {campaignStatus !== 'draft' && (
                  <div className="bg-gray-900 text-white p-4 rounded-xl border border-gray-800 shadow-xl">
                      <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                          <span className="material-symbols-rounded text-[#FAD201]">smart_toy</span>
                          <span className="text-sm font-bold">AI Compliance System</span>
                      </div>
                      
                      {campaignStatus === 'scanning' && (
                          <div className="space-y-3">
                              {[0, 1, 2, 3, 4].map((i) => (
                                  <div key={i} className={`flex items-center gap-3 text-xs transition-opacity duration-500 ${i <= scanStep ? 'opacity-100' : 'opacity-20'}`}>
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < scanStep ? 'bg-green-500 text-black' : 'bg-gray-700'}`}>
                                          {i < scanStep && <span className="material-symbols-rounded text-[10px]">check</span>}
                                      </div>
                                      <span>
                                        {i === 0 && "Checking languages..."}
                                        {i === 1 && "Scanning for Cybercrime Act violations..."}
                                        {i === 2 && "Verifying content decency..."}
                                        {i === 3 && "Checking political neutrality..."}
                                        {i === 4 && "Allocating Creator Revenue..."}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      )}

                      {campaignStatus === 'approved' && (
                          <div className="text-center py-4 animate-scale-in">
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-black">
                                  <span className="material-symbols-rounded text-2xl">check</span>
                              </div>
                              <h4 className="font-bold text-green-400">Compliance Check Passed</h4>
                              <p className="text-xs text-gray-400 mt-1">Your ad is ready to go live.</p>
                          </div>
                      )}

                      {campaignStatus === 'active' && (
                          <div className="text-center py-4 animate-scale-in">
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white animate-pulse">
                                  <span className="material-symbols-rounded text-2xl">rocket_launch</span>
                              </div>
                              <h4 className="font-bold text-blue-400">Campaign Launching...</h4>
                              <p className="text-xs text-gray-400 mt-1">Broadcasting to Wantok Network</p>
                          </div>
                      )}

                      {campaignStatus === 'rejected' && (
                          <div className="text-center py-4 animate-shake">
                              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                                  <span className="material-symbols-rounded text-2xl">block</span>
                              </div>
                              <h4 className="font-bold text-red-400">Ad Rejected</h4>
                              <p className="text-xs text-gray-400 mt-1">Violation: Content Policy (Gambling/Scam suspicion).</p>
                          </div>
                      )}
                  </div>
              )}

              {/* Action Bar (Fixed at bottom of scroll or container) */}
              <div className="pt-4">
                  {campaignStatus === 'draft' ? (
                      <button 
                        onClick={startAiScan}
                        disabled={!adContent || !adBudget}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${!adContent || !adBudget ? 'bg-gray-300 text-gray-500' : 'bg-[#1a1a1a] text-white'}`}
                      >
                          <span className="material-symbols-rounded">search_check</span>
                          Run AI Compliance Check
                      </button>
                  ) : campaignStatus === 'approved' ? (
                      <button 
                        onClick={handleLaunch}
                        className="w-full py-3 bg-[#CE1126] text-white rounded-xl font-bold shadow-lg shadow-red-900/30"
                      >
                          Launch Campaign
                      </button>
                  ) : campaignStatus === 'rejected' ? (
                      <button onClick={() => setCampaignStatus('draft')} className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">
                          Edit Content
                      </button>
                  ) : null}
              </div>
          </div>
      )}

    </div>
  );
};
    