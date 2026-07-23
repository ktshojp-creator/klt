import React, { useState, useMemo } from 'react';
import { Scene, Dialogue } from '../types';
import * as Icons from 'lucide-react';
import { speakKorean } from '../lib/tts';

interface SearchPhrasesProps {
  scenes: Scene[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function SearchPhrases({ scenes, favorites, onToggleFavorite }: SearchPhrasesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState<string>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  interface DialoguePair {
    id: string;
    sceneId: string;
    dialogueA: Dialogue;
    dialogueB: Dialogue;
  }

  // Construct dialogue pairs from scenes
  const allPairs = useMemo(() => {
    const pairs: DialoguePair[] = [];
    scenes.forEach((scene) => {
      const dialogues = scene.dialogues;
      for (let i = 0; i < dialogues.length; i += 2) {
        if (i + 1 < dialogues.length) {
          pairs.push({
            id: `${scene.id}-pair-${i / 2}`,
            sceneId: scene.id,
            dialogueA: dialogues[i],
            dialogueB: dialogues[i + 1],
          });
        }
      }
    });
    return pairs;
  }, [scenes]);

  // Filter pairs based on search query and scene filter
  const filteredPairs = useMemo(() => {
    return allPairs.filter((pair) => {
      const matchScene = selectedSceneId === 'all' || pair.sceneId === selectedSceneId;
      const query = searchQuery.toLowerCase().trim();
      
      if (!query) return matchScene;
      
      const matchA = 
        pair.dialogueA.japanese.toLowerCase().includes(query) ||
        pair.dialogueA.korean.toLowerCase().includes(query) ||
        pair.dialogueA.romanized.toLowerCase().includes(query);
        
      const matchB = 
        pair.dialogueB.japanese.toLowerCase().includes(query) ||
        pair.dialogueB.korean.toLowerCase().includes(query) ||
        pair.dialogueB.romanized.toLowerCase().includes(query);
        
      return matchScene && (matchA || matchB);
    });
  }, [allPairs, searchQuery, selectedSceneId]);

  const handlePlay = (id: string, text: string) => {
    setSpeakingId(id);
    speakKorean(
      text,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handleCopyText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
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
        <h2 className="text-xl font-bold text-gray-900">フレーズ検索</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          日本語、韓国語、または読み方カタカナでアプリ内のすべてのフレーズを検索できます。
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="何名様、お会計、도와주세요 など..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-xs"
          id="search-input-field"
        />
        <Icons.Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Scene Filters (Elegant Grid Choice) */}
      <div className="space-y-2" id="scene-filter-category-section">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">カテゴリで絞り込み</span>
        
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <button
            onClick={() => setSelectedSceneId('all')}
            className={`col-span-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-2xs cursor-pointer ${
              selectedSceneId === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-rose-500 text-white border-transparent shadow-xs'
                : 'bg-white border-gray-200/60 text-gray-700 hover:bg-gray-50'
            }`}
            id="filter-scene-all"
          >
            <Icons.Globe className={`w-4 h-4 shrink-0 ${selectedSceneId === 'all' ? 'text-white' : 'text-blue-500'}`} />
            <span>すべてのカテゴリを表示</span>
          </button>
          {scenes.map((scene, idx) => {
            const isSelected = selectedSceneId === scene.id;
            const isRoseButton = idx % 2 === 0;
            const IconComponent = getSceneIcon(scene.id);
            return (
              <button
                key={scene.id}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border truncate cursor-pointer ${
                  isSelected
                    ? isRoseButton
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-blue-500 text-white border-blue-500 shadow-xs'
                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                }`}
                id={`filter-scene-${scene.id}`}
              >
                <IconComponent className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected 
                    ? 'text-white' 
                    : isRoseButton 
                      ? 'text-rose-500' 
                      : 'text-blue-500'
                }`} />
                <span className="truncate">{scene.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Results count */}
      <div className="text-xs font-semibold text-gray-400 flex justify-between items-center px-1">
        <span>検索結果 ({selectedSceneId === 'all' ? '全カテゴリ' : getSceneName(selectedSceneId)})</span>
        <span>{filteredPairs.length} 組の対話</span>
      </div>

      {/* List of matching phrase pairs */}
      <div className="space-y-4">
        {filteredPairs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 p-6 space-y-2">
            <div className="text-3xl">🔍</div>
            <p className="text-sm font-medium text-gray-500">一致するフレーズが見つかりませんでした。</p>
            <p className="text-xs text-gray-400">キーワードを変えるか、カテゴリフィルターを解除してください。</p>
          </div>
        ) : (
          filteredPairs.map((pair) => {
            const IconComponent = getSceneIcon(pair.sceneId);
            
            const isSpeakingA = speakingId === pair.dialogueA.id;
            const isSpeakingB = speakingId === pair.dialogueB.id;
            
            const isFavA = favorites.includes(pair.dialogueA.id);
            const isFavB = favorites.includes(pair.dialogueB.id);

            const isDialogueARose = pair.dialogueA.role === 'self';
            const isDialogueBRose = pair.dialogueB.role === 'self';

            return (
              <div
                key={pair.id}
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
              >
                {/* Scene tag / Header */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 bg-blue-50 text-blue-500 rounded-lg">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-gray-700 font-extrabold">
                      {getSceneName(pair.sceneId)}
                    </span>
                  </div>
                  <span className="text-[9px] bg-rose-50 text-rose-500 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    対話セット
                  </span>
                </div>

                {/* Sub-Dialogue Bubble layout */}
                <div className="space-y-4 relative pl-3.5 border-l-2 border-blue-100/70">
                  {/* Dialogue A (First speaker) */}
                  <div className={`space-y-1 rounded-xl p-2.5 transition-colors ${
                    isSpeakingA 
                      ? isDialogueARose ? 'bg-rose-50/40' : 'bg-blue-50/40'
                      : 'hover:bg-gray-50/40'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isDialogueARose
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {isDialogueARose ? '自分' : '店員・相手'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed pt-0.5">
                      {pair.dialogueA.japanese}
                    </p>
                    <div className="flex items-start justify-between gap-2.5 pt-1">
                      <div className="cursor-pointer group flex-1" onClick={() => handlePlay(pair.dialogueA.id, pair.dialogueA.korean)}>
                        <h4 className={`text-base font-extrabold text-gray-900 transition-colors ${
                          isDialogueARose ? 'group-hover:text-rose-500' : 'group-hover:text-blue-500'
                        }`}>
                          {pair.dialogueA.korean}
                        </h4>
                        <p className={`text-[10px] font-mono font-semibold mt-0.5 ${
                          isDialogueARose ? 'text-rose-500/90' : 'text-blue-500/90'
                        }`}>
                          [ {pair.dialogueA.romanized} ]
                        </p>
                      </div>

                      {/* Dialogue A Action row */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyText(pair.dialogueA.id, pair.dialogueA.korean)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
                          title="韓国語をコピー"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          {copiedId === pair.dialogueA.id ? (
                            <Icons.Check className={`w-3.5 h-3.5 ${isDialogueARose ? 'text-rose-500' : 'text-blue-500'}`} />
                          ) : (
                            <Icons.Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        
                        {/* Play button */}
                        <button
                          onClick={() => handlePlay(pair.dialogueA.id, pair.dialogueA.korean)}
                          className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                            isSpeakingA
                              ? isDialogueARose ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                          title="音声を再生"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          {isSpeakingA ? (
                            <span className="flex gap-0.5 h-3 w-3 items-center justify-center">
                              <span className={`animate-bounce inline-block w-0.5 h-2 rounded ${isDialogueARose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                              <span className={`animate-bounce inline-block w-0.5 h-3 rounded [animation-delay:0.15s] ${isDialogueARose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                              <span className={`animate-bounce inline-block w-0.5 h-1.5 rounded [animation-delay:0.3s] ${isDialogueARose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                            </span>
                          ) : (
                            <Icons.Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Favorite button */}
                        <button
                          onClick={() => onToggleFavorite(pair.dialogueA.id)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-rose-500 transition-colors flex items-center justify-center"
                          title="お気に入りに追加"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          <Icons.Heart className={`w-3.5 h-3.5 ${isFavA ? 'fill-rose-500 stroke-rose-500' : 'stroke-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Connecting bubble thread element */}
                  <div className="absolute left-[3px] top-[45%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-rose-400 to-blue-400 z-10"></div>

                  {/* Dialogue B (Second speaker) */}
                  <div className={`space-y-1 rounded-xl p-2.5 transition-colors ${
                    isSpeakingB 
                      ? isDialogueBRose ? 'bg-rose-50/40' : 'bg-blue-50/40'
                      : 'hover:bg-gray-50/40'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isDialogueBRose
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {isDialogueBRose ? '自分' : '店員・相手'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed pt-0.5">
                      {pair.dialogueB.japanese}
                    </p>
                    <div className="flex items-start justify-between gap-2.5 pt-1">
                      <div className="cursor-pointer group flex-1" onClick={() => handlePlay(pair.dialogueB.id, pair.dialogueB.korean)}>
                        <h4 className={`text-base font-extrabold text-gray-900 transition-colors ${
                          isDialogueBRose ? 'group-hover:text-rose-500' : 'group-hover:text-blue-500'
                        }`}>
                          {pair.dialogueB.korean}
                        </h4>
                        <p className={`text-[10px] font-mono font-semibold mt-0.5 ${
                          isDialogueBRose ? 'text-rose-500/90' : 'text-blue-500/90'
                        }`}>
                          [ {pair.dialogueB.romanized} ]
                        </p>
                      </div>

                      {/* Dialogue B Action row */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyText(pair.dialogueB.id, pair.dialogueB.korean)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
                          title="韓国語をコピー"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          {copiedId === pair.dialogueB.id ? (
                            <Icons.Check className={`w-3.5 h-3.5 ${isDialogueBRose ? 'text-rose-500' : 'text-blue-500'}`} />
                          ) : (
                            <Icons.Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        
                        {/* Play button */}
                        <button
                          onClick={() => handlePlay(pair.dialogueB.id, pair.dialogueB.korean)}
                          className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                            isSpeakingB
                              ? isDialogueBRose ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}
                          title="音声を再生"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          {isSpeakingB ? (
                            <span className="flex gap-0.5 h-3 w-3 items-center justify-center">
                              <span className={`animate-bounce inline-block w-0.5 h-2 rounded ${isDialogueBRose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                              <span className={`animate-bounce inline-block w-0.5 h-3 rounded [animation-delay:0.15s] ${isDialogueBRose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                              <span className={`animate-bounce inline-block w-0.5 h-1.5 rounded [animation-delay:0.3s] ${isDialogueBRose ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                            </span>
                          ) : (
                            <Icons.Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Favorite button */}
                        <button
                          onClick={() => onToggleFavorite(pair.dialogueB.id)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-rose-500 transition-colors flex items-center justify-center"
                          title="お気に入りに追加"
                          style={{ minWidth: '28px', minHeight: '28px' }}
                        >
                          <Icons.Heart className={`w-3.5 h-3.5 ${isFavB ? 'fill-rose-500 stroke-rose-500' : 'stroke-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
