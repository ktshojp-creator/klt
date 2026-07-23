import React from 'react';
import { Grid, Search, Heart, BookOpen, FileText } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'scenes', label: 'シーン', icon: Grid },
    { id: 'search', label: '検索', icon: Search },
    { id: 'favorites', label: 'お気に入り', icon: Heart },
    { id: 'quiz', label: 'クイズ', icon: BookOpen },
    { id: 'legal', label: '規約・情報', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#faf8f5] border-t border-gray-200 shadow-lg z-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'scenes' && currentView.startsWith('scene-'));
          
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-all relative ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[2px]'} transition-transform duration-200`} />
              <span className="text-[10px] mt-0.5 font-bold">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
