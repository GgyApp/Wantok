import React, { useState } from 'react';
import { User } from '../types';
import { TapaBorder } from './ui/TapaPattern';
import { CashOutModal } from './CashOutModal';
import { VerificationModal } from './VerificationModal';
import { ComplianceModal } from './ComplianceModal';

interface ProfileViewProps {
  user: User;
  onSwitchToBusiness: () => void;
  onVerify: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onSwitchToBusiness, onVerify }) => {
  const [showCashOut, setShowCashOut] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [balance, setBalance] = useState(user.earnings);

  // Reverse calculate the Total Revenue based on the 60% user share
  const userSharePercentage = 0.60;
  const platformSharePercentage = 0.40;
  
  const totalRevenue = balance / userSharePercentage;
  const platformFee = totalRevenue * platformSharePercentage;

  const handleCashOutConfirm = () => {
    setBalance(0);
    setShowCashOut(false);
  };

  const handleVerifySuccess = () => {
      onVerify();
      setShowVerification(false);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-y-auto pb-20">
      
      {/* Modals */}
      {showCashOut && (
        <CashOutModal 
          balance={balance} 
          onClose={() => setShowCashOut(false)} 
          onConfirm={handleCashOutConfirm}
        />
      )}

      {showVerification && (
          <VerificationModal 
            onClose={() => setShowVerification(false)}
            onSuccess={handleVerifySuccess}
          />
      )}

      {showCompliance && (
          <ComplianceModal onClose={() => setShowCompliance(false)} />
      )}

      {/* Header */}
      <div className="bg-white pb-6 pt-12 px-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0">
            <TapaBorder />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <img src={user.avatarUrl} alt="Me" className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-200" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-1">
              {user.name}
              {user.isVerified && <span className="material-symbols-rounded text-[#CE1126] text-xl" title="Verified">verified</span>}
            </h2>
            <p className="text-gray-500">@{user.handle}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                    Content Creator
                </span>
                {user.isVerified ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-200 flex items-center gap-1">
                        <span className="material-symbols-rounded text-[10px]">gavel</span> 
                        Compliance: 100%
                    </span>
                ) : (
                    <button 
                        onClick={() => setShowVerification(true)}
                        className="px-2 py-0.5 bg-red-50 text-[#CE1126] text-xs rounded border border-red-200 flex items-center gap-1 hover:bg-red-100 transition animate-pulse"
                    >
                        <span className="material-symbols-rounded text-[10px]">verified</span> 
                        Verify Identity
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
           <div className="absolute right-0 top-0 w-40 h-40 bg-[#FAD201] rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition duration-700"></div>
           <div className="absolute left-0 bottom-0 w-32 h-32 bg-[#CE1126] rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 transition duration-700"></div>
           
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                        <span className="material-symbols-rounded text-sm">wallet</span>
                        Available Balance
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#FAD201]">PGK</span>
                        <span className="text-5xl font-bold tracking-tight">{balance.toFixed(2)}</span>
                    </div>
                </div>
             </div>

             <button 
               onClick={() => setShowCashOut(true)}
               disabled={balance <= 0 || !user.isVerified}
               className={`mt-6 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                 balance > 0 && user.isVerified
                 ? 'bg-[#CE1126] text-white shadow-lg shadow-red-900/40 hover:scale-[1.02] active:scale-95' 
                 : 'bg-gray-800 text-gray-500 cursor-not-allowed'
               }`}
             >
                <span className="material-symbols-rounded">payments</span>
                {user.isVerified ? 'Withdraw Funds' : 'Verify ID to Withdraw'}
             </button>
           </div>
        </div>

        {/* Action Buttons Container */}
        <div className="space-y-3">
            {/* Business Center Link */}
            <button 
                onClick={onSwitchToBusiness}
                className="w-full bg-white border-2 border-gray-100 hover:border-[#FAD201] rounded-2xl p-4 flex items-center justify-between group transition-all shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">storefront</span>
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-gray-900">Wantok Business Center</div>
                        <div className="text-xs text-gray-500">Create ads & manage campaigns</div>
                    </div>
                </div>
                <span className="material-symbols-rounded text-gray-400 group-hover:text-[#FAD201]">arrow_forward</span>
            </button>

            {/* Compliance Link */}
            <button 
                onClick={() => setShowCompliance(true)}
                className="w-full bg-white border border-gray-100 hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between group transition-all shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                        <span className="material-symbols-rounded">policy</span>
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-gray-900">Compliance & Guidelines</div>
                        <div className="text-xs text-gray-500">Community standards & Education</div>
                    </div>
                </div>
                <span className="material-symbols-rounded text-gray-400 group-hover:text-[#CE1126]">chevron_right</span>
            </button>
        </div>

        {/* Revenue Transparency Card (60/40 Split) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-rounded text-[#CE1126]">pie_chart</span>
                Revenue Breakdown
            </h3>
            
            <div className="space-y-4">
                {/* Gross */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Ad Revenue Generated</span>
                    <span className="font-bold text-gray-900">K {totalRevenue.toFixed(2)}</span>
                </div>

                {/* Platform Fee */}
                <div className="relative pl-4 border-l-2 border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                        <span>Wantok Platform Fee (40%)</span>
                        <span className="text-red-500">- K {platformFee.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                        Used for server costs, AI moderation, and development.
                    </div>
                </div>

                {/* Net */}
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                    <span className="text-sm font-bold text-gray-900">Your Net Earnings (60%)</span>
                    <span className="text-lg font-bold text-[#00A651]">+ K {balance.toFixed(2)}</span>
                </div>
            </div>

            {/* Visual Bar */}
            <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#00A651] w-[60%]"></div> {/* 60% User */}
                <div className="h-full bg-gray-300 w-[40%]"></div> {/* 40% Platform */}
            </div>
            <div className="flex justify-between text-[10px] mt-1 font-medium">
                <span className="text-[#00A651]">You (60%)</span>
                <span className="text-gray-400">Wantok (40%)</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">12.5K</div>
                <div className="text-xs text-gray-500">Profile Views</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">480</div>
                <div className="text-xs text-gray-500">Likes</div>
            </div>
        </div>
        
        {/* Support Section */}
        <div className="text-center mt-2">
            <p className="text-xs text-gray-400">
                Payments processed via <span className="font-bold text-gray-500">BSP, Kina Bank & CellMoni</span>.
                <br/>
                Regulated by Bank of PNG.
            </p>
        </div>

      </div>
    </div>
  );
};