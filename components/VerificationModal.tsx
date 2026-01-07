
import React, { useState, useRef } from 'react';
import { TapaBorder } from './ui/TapaPattern';

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'success'>('upload');
  const [docType, setDocType] = useState('NID');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleVerify = () => {
    if (!image) return;
    setStep('scanning');
    
    // Simulate AI Analysis
    setTimeout(() => {
        setStep('success');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="absolute top-0 left-0 right-0 z-10">
            <TapaBorder />
        </div>

        {step === 'upload' && (
            <div className="p-6 pt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
                    <button onClick={onClose}><span className="material-symbols-rounded text-gray-400">close</span></button>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                    Upload your National ID, Passport, or Driver's License to unlock Creator features.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Document Type</label>
                        <select 
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#CE1126]"
                        >
                            <option value="NID">National Identity Card (NID)</option>
                            <option value="Passport">Passport</option>
                            <option value="License">Driver's License</option>
                        </select>
                    </div>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full aspect-[4/3] bg-gray-50 border-2 border-dashed ${image ? 'border-[#CE1126]' : 'border-gray-300'} rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:bg-gray-100 transition`}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="ID" />
                        ) : (
                            <div className="text-center text-gray-400">
                                <span className="material-symbols-rounded text-4xl mb-2">id_card</span>
                                <p className="text-xs">Tap to upload photo of {docType}</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </div>
                </div>

                <button 
                    onClick={handleVerify}
                    disabled={!image}
                    className={`w-full py-3 mt-6 rounded-xl font-bold text-white transition ${!image ? 'bg-gray-300' : 'bg-[#CE1126] shadow-lg shadow-red-900/30'}`}
                >
                    Verify Identity
                </button>
            </div>
        )}

        {step === 'scanning' && (
            <div className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 border-4 border-[#FAD201] border-t-transparent rounded-full animate-spin mb-6 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-rounded text-[#CE1126] animate-pulse">smart_toy</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Verification in Progress</h3>
                <div className="text-xs text-gray-500 space-y-1">
                    <p className="animate-pulse">Scanning security features...</p>
                    <p className="animate-pulse delay-75">Matching biometric data...</p>
                    <p className="animate-pulse delay-150">Checking Government Database...</p>
                </div>
            </div>
        )}

        {step === 'success' && (
            <div className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                    <span className="material-symbols-rounded text-5xl">verified_user</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You are Verified!</h3>
                <p className="text-sm text-gray-500 mb-6">Your identity has been confirmed. You now have the Blue Badge.</p>
                <button 
                    onClick={onSuccess}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold"
                >
                    Done
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
