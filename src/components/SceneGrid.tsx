import React from 'react';
import { motion } from 'motion/react';
import { Scene } from '../types';
import { INFEED_ADS } from '../data/affiliateAds';
import A8AdCard from './A8AdCard';
import * as Icons from 'lucide-react';

interface SceneGridProps {
  scenes: Scene[];
  onSelectScene: (sceneId: string) => void;
  favoritesCount: number;
  isSupporter?: boolean;
  onBecomeSupporter?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function SceneGrid({ 
  scenes, 
  onSelectScene, 
  favoritesCount,
  isSupporter = false,
  onBecomeSupporter
}: SceneGridProps) {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-gradient-to-br from-rose-50/90 via-white to-blue-50/90 border border-[#ecdcd0] rounded-3xl p-6 text-gray-800 shadow-[0_4px_24px_-2px_rgba(222,130,167,0.06),0_4px_24px_-2px_rgba(96,130,164,0.06)] relative overflow-hidden"
      >
        {/* Soft elegant pink and blue glow spots matching the app icon colors */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-200/15 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-10 left-10 w-36 h-36 bg-blue-200/15 rounded-full blur-2xl pointer-events-none z-0"></div>

        {/* Waves & Plane decoration matching the App Icon */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.25]">
          <svg className="w-full h-full" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant background wave curves from the icon */}
            <path 
              d="M-20 120 C 100 80, 200 160, 420 100" 
              stroke="url(#icon-wave-grad-1)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            <path 
              d="M-20 60 C 120 140, 240 40, 420 110" 
              stroke="url(#icon-wave-grad-2)" 
              strokeWidth="1.5" 
            />
            <defs>
              <linearGradient id="icon-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#de82a7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6082a4" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="icon-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6082a4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#de82a7" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-20 flex flex-col items-center text-center">
          
          {/* Minimalist book & plane design to respect height and branding colors */}
          <div className="flex items-center gap-1.5 mb-2.5 bg-white border border-[#dfd7d1] rounded-full px-3 py-1 text-gray-700 shadow-3xs select-none">
            <Icons.BookOpen className="w-3.5 h-3.5 text-rose-500 stroke-[2.5px]" />
            <div className="h-2 w-[1px] bg-gray-200" />
            <Icons.Plane className="w-3.5 h-3.5 text-blue-500 stroke-[2.5px] transform rotate-[-15deg]" />
          </div>

          <h2 className="text-2xl font-black mb-1.5 tracking-wide text-gray-900 flex items-center gap-1.5 justify-center">
            <span className="text-rose-500">안녕</span>
            <span className="text-blue-500">하세요!</span>
          </h2>
          <p className="text-gray-500 text-xs font-semibold mb-6 tracking-wider">シーン別の対話で旅行会話をマスターしましょう</p>
          
          <div className="flex gap-4 w-full max-w-xs">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl px-4 py-2.5 text-center flex-1 border border-blue-50 shadow-2xs">
              <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">全フレーズ</div>
              <div className="text-xl font-black mt-0.5 text-blue-600">
                {scenes.reduce((acc, scene) => acc + scene.dialogues.length, 0)}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl px-4 py-2.5 text-center flex-1 border border-rose-100/40 shadow-2xs">
              <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">お気に入り</div>
              <div className="text-xl font-black mt-0.5 text-rose-500">{favoritesCount}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          シーンを選択
        </h3>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {scenes.map((scene, idx) => {
            // Dynamically resolve icon or use emoji as fallback
            const IconComponent = (Icons as any)[scene.iconName] || Icons.HelpCircle;
            const isPinkTheme = idx % 2 === 0;
            const cardElement = (
              <motion.button
                key={scene.id}
                id={`scene-card-${scene.id}`}
                onClick={() => onSelectScene(scene.id)}
                variants={itemVariants}
                whileHover={{ 
                  y: -3, 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01)', 
                  borderColor: isPinkTheme ? '#FECDD3' : '#93C5FD' 
                }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-2xl text-left shadow-xs transition-colors duration-200 group cursor-pointer`}
                style={{ minHeight: '88px' }}
              >
                <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                  isPinkTheme 
                    ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-100' 
                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                }`}>
                  <IconComponent className="w-6 h-6 stroke-[2px]" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-base">{scene.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {scene.description}
                  </p>
                  <div className={`text-[10px] font-bold inline-block px-2.5 py-0.5 rounded-full ${
                    isPinkTheme 
                      ? 'bg-rose-50 text-rose-500' 
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {scene.dialogues.length}フレーズ
                  </div>
                </div>
              </motion.button>
            );

            // If not supporter, inject an in-feed ad card at specified locations using A8.net config
            if (!isSupporter && scene.id === 'restaurant') {
              const adElement = (
                <A8AdCard 
                  key="infeed-ad-gourmet"
                  ad={INFEED_ADS.gourmet}
                  category="gourmet"
                  onBecomeSupporter={onBecomeSupporter}
                />
              );
              return [cardElement, adElement];
            }

            if (!isSupporter && scene.id === 'beauty') {
              const adElement = (
                <A8AdCard 
                  key="infeed-ad-beauty"
                  ad={INFEED_ADS.beauty}
                  category="beauty"
                  onBecomeSupporter={onBecomeSupporter}
                />
              );
              return [cardElement, adElement];
            }

            return [cardElement];
          }).flat()}
        </motion.div>
      </div>
    </div>
  );
}
