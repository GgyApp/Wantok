import React from 'react';
import { TapaBorder } from './ui/TapaPattern';

interface ComplianceModalProps {
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up shadow-2xl h-[85vh] flex flex-col">
         <div className="absolute top-0 left-0 right-0 z-10">
            <TapaBorder />
        </div>
        
        <div className="p-4 pt-8 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
             <h2 className="text-lg font-bold text-gray-900">Compliance & Safety</h2>
             <button onClick={onClose} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                <span className="material-symbols-rounded text-gray-500">close</span>
             </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 text-gray-700 text-sm leading-relaxed">
            
            <section>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                    <span className="material-symbols-rounded text-[#CE1126]">policy</span>
                    1. Introduction
                </h3>
                <p>
                    Welcome to the Wantok social media application compliance framework. This document establishes the governing principles, community standards, and legal obligations for all users, creators, and advertisers on the platform. It is designed to ensure alignment with the <strong>PNG Cybercrime Code Act 2016</strong> and international digital safety standards.
                </p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                    <span className="material-symbols-rounded text-[#FAD201]">school</span>
                    2. Purpose of the App
                </h3>
                <p className="mb-3">
                    The Wantok platform is founded on three pillars, with a primary focus on <strong>Education</strong>:
                </p>
                <ul className="space-y-4">
                    <li className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block mb-1">Educational Empowerment</strong> 
                        To serve as a digital classroom for Papua New Guinea, facilitating the sharing of knowledge, skills, and literacy across all provinces.
                    </li>
                    <li className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block mb-1">Cultural Preservation</strong> 
                        To document and celebrate our 800+ languages and customs in a respectful digital format.
                    </li>
                    <li className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block mb-1">Economic Development</strong> 
                        To provide a compliant marketplace for SMEs and creators to monetize their work legitimately.
                    </li>
                </ul>
            </section>

            <section>
                 <h3 className="font-bold text-gray-900 mb-3 text-base">3. User Obligations</h3>
                 <p>
                    Users must respect the "Haus Man/Haus Meri" protocols of mutual respect. Hate speech, misinformation, and illicit content are strictly prohibited and detected by our AI moderation systems.
                 </p>
            </section>

             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500 text-center">
                Last Updated: {new Date().toLocaleDateString()}
                <br/>
                Approved by: Wantok Compliance Board
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <button onClick={onClose} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">
                Acknowledge & Close
            </button>
        </div>

      </div>
    </div>
  );
};