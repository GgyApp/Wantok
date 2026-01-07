
import React from 'react';
import { Tab } from '../types';

interface NavBarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentTab, setTab }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-around border-t border-gray-800 z-50 px-2">
      <button 
        onClick={() => setTab('home')}
        className={`flex flex-col items-center gap-1 w-12 ${currentTab === 'home' ? 'text-white' : 'text-gray-500'}`}
      >
        <span className={`material-symbols-rounded text-2xl ${currentTab === 'home' ? 'font-bold' : ''}`}>home</span>
        <span className="text-[10px]">Home</span>
      </button>

      <button 
        onClick={() => setTab('search')}
        className={`flex flex-col items-center gap-1 w-12 ${currentTab === 'search' ? 'text-white' : 'text-gray-500'}`}
      >
        <span className={`material-symbols-rounded text-2xl ${currentTab === 'search' ? 'font-bold' : ''}`}>search</span>
        <span className="text-[10px]">Discover</span>
      </button>

      {/* Center Create Button (TikTok Style) */}
      <button 
        onClick={() => setTab('create')}
        className="relative -top-4 mx-2"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#CE1126] to-[#FAD201] flex items-center justify-center shadow-lg shadow-red-900/50 border-2 border-black transform transition active:scale-95">
           <span className="material-symbols-rounded text-black font-bold text-2xl">add</span>
        </div>
      </button>

      <button 
        onClick={() => setTab('profile')}
        className={`flex flex-col items-center gap-1 w-12 ${currentTab === 'profile' ? 'text-white' : 'text-gray-500'}`}
      >
        <span className={`material-symbols-rounded text-2xl ${currentTab === 'profile' ? 'font-bold' : ''}`}>person</span>
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};
