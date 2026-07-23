import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene, Dialogue } from '../types';
import * as Icons from 'lucide-react';
import { speakKorean } from '../lib/tts';

interface FavoritesListProps {
  scenes: Scene[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function FavoritesList({ scenes, favorites, onToggleFavorite }: FavoritesListProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Flatten all dialogues
  const allDialogues = useMemo(() => {
    return scenes.reduce<Dialogue[]>((acc, scene) => {
      return [...acc, ...scene.dialogues];
    }, []);
  }, [scenes]);

  // Filter only favorites
  const favoriteDialogues = useMemo(() => {
    return allDialogues.filter(item => favorites.includes(item.id));
  }, [allDialogues, favorites]);

  const handlePlay = (id: string, text: string) => {
    setSpeakingId(id);
    speakKorean(
      text,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const getSceneIcon = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene && scene.iconName) {
      return (Icons as any)[scene.iconName] || Icons.HelpCircle;
    }
    return Icons.HelpCircle;
  };

  const getSceneName = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    return scene ? scene.name : '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">お気に入りフレーズ</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          ブックマークした自分だけの実践旅行会話集。オフライン時でもいつでも開いて確認・音声再生が可能です。
        </p>
      </div>

      <div className="space-y-4">
        {favoriteDialogues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 p-6 space-y-4">
            <div className="text-4xl text-gray-300">❤️</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-600">お気に入りはまだありません</p>
              <p className="text-xs text-gray-400">
                会話画面や検索画面でハートアイコンをタップして、重要なフレーズをここに保存しましょう。
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {favoriteDialogues.map((item) => {
              const IconComponent = getSceneIcon(item.sceneId);
              const isSpeaking = speakingId === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -30, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  {/* Scene tag */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {getSceneName(item.sceneId)}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto ${
                      item.role === 'self' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {item.role === 'self' ? '自分' : '店員'}
                    </span>
                  </div>

                  {/* Phrase Text */}
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.japanese}</p>
                    <h4 className="text-lg font-bold text-gray-900">{item.korean}</h4>
                    <p className="text-[10px] font-mono text-gray-400 italic">[ {item.romanized} ]</p>
                  </div>

                  {/* Play and Remove Action buttons */}
                  <div className="flex items-center gap-2 border-t pt-3 border-gray-50">
                    <button
                      onClick={() => handlePlay(item.id, item.korean)}
                      className={`flex items-center gap-1 py-1.5 px-3 rounded-full text-[11px] font-bold transition-all ${
                        isSpeaking
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      id={`fav-play-${item.id}`}
                      style={{ minHeight: '36px' }}
                    >
                      {isSpeaking ? (
                        <>
                          <span className="flex gap-0.5 h-2.5 w-2.5">
                            <span className="animate-bounce inline-block w-0.5 h-1.5 bg-rose-700 rounded"></span>
                            <span className="animate-bounce inline-block w-0.5 h-2.5 bg-rose-700 rounded [animation-delay:0.15s]"></span>
                            <span className="animate-bounce inline-block w-0.5 h-1 bg-rose-700 rounded [animation-delay:0.3s]"></span>
                          </span>
                          <span>再生中</span>
                        </>
                      ) : (
                        <>
                          <Icons.Volume2 className="w-3.5 h-3.5" />
                          <span>発音を聞く</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-2 rounded-full hover:bg-rose-50 text-rose-500 ml-auto transition-colors flex items-center justify-center cursor-pointer"
                      id={`fav-toggle-${item.id}`}
                      style={{ minWidth: '36px', minHeight: '36px' }}
                      title="お気に入りから削除"
                    >
                      <Icons.Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
