import React, { useState } from 'react';
import { PaymentProvider } from '../types';

interface CashOutModalProps {
  balance: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CashOutModal: React.FC<CashOutModalProps> = ({ balance, onClose, onConfirm }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [accountNumber, setAccountNumber] = useState('');

  const providers: { id: PaymentProvider; name: string; color: string; icon: string }[] = [
    { id: 'BSP', name: 'Bank South Pacific', color: 'bg-green-700', icon: 'account_balance' },
    { id: 'Kina Bank', name: 'Kina Bank', color: 'bg-blue-900', icon: 'currency_exchange' },
    { id: 'CellMoni', name: 'Digicel CellMoni', color: 'bg-red-600', icon: 'smartphone' },
    { id: 'MiBank', name: 'MiBank', color: 'bg-orange-600', icon: 'savings' },
  ];

  const handleWithdraw = () => {
    if (!selectedProvider || !accountNumber) return;
    setStep(2); // Processing
    setTimeout(() => {
      setStep(3); // Success
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden animate-slide-up shadow-2xl">
        
        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
              <button onClick={onClose} className="p-1 bg-gray-100 rounded-full text-gray-500">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Available to Cash Out</p>
              <p className="text-3xl font-bold text-gray-900">K {balance.toFixed(2)}</p>
            </div>

            <p className="text-sm font-medium text-gray-700">Select Payout Method</p>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    selectedProvider === p.id 
                    ? 'border-[#CE1126] bg-red-50 text-[#CE1126]' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${p.color} text-white flex items-center justify-center`}>
                    <span className="material-symbols-rounded text-sm">{p.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-center">{p.name}</span>
                </button>
              ))}
            </div>

            {selectedProvider && (
              <div className="animate-fade-in mt-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  {selectedProvider === 'CellMoni' ? 'Mobile Number' : 'Account Number'}
                </label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={selectedProvider === 'CellMoni' ? '7xxxxxxx' : '100xxxxxxx'}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-mono focus:outline-none focus:border-[#CE1126]"
                />
              </div>
            )}

            <button 
              onClick={handleWithdraw}
              disabled={!selectedProvider || !accountNumber}
              className={`w-full py-4 mt-2 rounded-xl font-bold text-white shadow-lg transition-all ${
                !selectedProvider || !accountNumber 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#CE1126] hover:bg-red-700 shadow-red-900/30 active:scale-95'
              }`}
            >
              Confirm Withdrawal
            </button>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-12 gap-6">
            <div className="w-16 h-16 border-4 border-[#CE1126] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Processing...</h3>
              <p className="text-sm text-gray-500">Connecting to {selectedProvider} Gateway</p>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="flex flex-col items-center py-8 gap-4 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-rounded text-5xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transfer Successful!</h2>
              <p className="text-gray-500 mt-2 text-sm">
                <span className="font-bold text-gray-900">K {balance.toFixed(2)}</span> has been sent to your {selectedProvider} account.
              </p>
            </div>
            <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-left mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-900">WTK-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <button 
              onClick={onConfirm}
              className="w-full py-3 mt-4 bg-gray-900 text-white font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
