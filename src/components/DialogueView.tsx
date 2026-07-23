import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Scene, Dialogue } from '../types';
import { 
  ArrowLeft, Volume2, VolumeX, Heart, Play, Square, 
  Copy, Check, Eye, EyeOff, Sparkles, MessageSquare, 
  User, CheckCircle, Flame, Headphones 
} from 'lucide-react';
import { speakKorean, stopSpeaking } from '../lib/tts';

interface DialogueViewProps {
  scene: Scene;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function DialogueView({ scene, onBack, favorites, onToggleFavorite }: DialogueViewProps) {
  // Study preferences (persistent for the session)
  const [showRuby, setShowRuby] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.85); // 0.70 (slow), 0.85 (learner), 1.0 (normal)

  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Continuous autoplay states
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayIdx, setAutoPlayIdx] = useState<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop speaking when leaving the screen or changing scene
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);

  // Handle auto-scroll to the currently active dialogue
  useEffect(() => {
    if (speakingId) {
      const el = document.getElementById(`dialogue-bubble-${speakingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [speakingId]);

  // Handle continuous auto-play sequence
  useEffect(() => {
    if (isAutoPlay && autoPlayIdx !== null) {
      if (autoPlayIdx < scene.dialogues.length) {
        const dialogue = scene.dialogues[autoPlayIdx];
        handlePlay(dialogue.id, dialogue.korean, () => {
          // Callback when this speech ends successfully
          if (autoPlayIdx < scene.dialogues.length - 1) {
            // Wait 1.5 seconds, then move to next
            autoPlayTimerRef.current = setTimeout(() => {
              setAutoPlayIdx(prev => (prev !== null ? prev + 1 : null));
            }, 1200);
          } else {
            // Completed all
            setIsAutoPlay(false);
            setAutoPlayIdx(null);
            setSpeakingId(null);
          }
        });
      }
    } else {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }
  }, [autoPlayIdx, isAutoPlay, speechRate]);

  const handlePlay = (id: string, text: string, onEndCallback?: () => void) => {
    setSpeakingId(id);
    speakKorean(
      text,
      () => {
        setSpeakingId(id);
      },
      () => {
        setSpeakingId(null);
        if (onEndCallback) {
          onEndCallback();
        }
      },
      (err) => {
        setSpeakingId(null);
        console.error(err);
      },
      speechRate
    );
  };

  const handleToggleAutoPlay = () => {
    if (isAutoPlay) {
      setIsAutoPlay(false);
      setAutoPlayIdx(null);
      stopSpeaking();
      setSpeakingId(null);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    } else {
      stopSpeaking();
      setIsAutoPlay(true);
      setAutoPlayIdx(0); // Start from the very first dialogue
    }
  };

  const handleCopyText = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // Group dialogues into pairs (usually 2 items per conversation loop: e.g. question & answer)
  const dialoguePairs = useMemo(() => {
    const pairs: Dialogue[][] = [];
    for (let i = 0; i < scene.dialogues.length; i += 2) {
      const pair = [scene.dialogues[i]];
      if (i + 1 < scene.dialogues.length) {
        pair.push(scene.dialogues[i + 1]);
      }
      pairs.push(pair);
    }
    return pairs;
  }, [scene.dialogues]);

  return (
    <div className="space-y-6 pb-28">
      {/* Top sticky-like Header Bar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-20 py-3 -mx-4 px-4 border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-semibold py-2 px-3 hover:bg-gray-100 rounded-xl transition-all"
          id="btn-dialogue-back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
          <span className="text-sm">一覧へ</span>
        </button>
        <div className="flex items-center gap-1 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-sm">{scene.emoji}</span>
          <span className="text-xs font-extrabold text-blue-800 tracking-wide">{scene.name}</span>
          <span className="text-[10px] bg-rose-400 text-white px-1.5 py-0.5 rounded-full font-bold ml-1 animate-pulse">
            20対話
          </span>
        </div>
      </div>

      {/* Description card */}
      <div className="bg-gradient-to-r from-rose-50/60 to-blue-50/70 rounded-2xl p-4 border border-rose-100/40 shadow-xs animate-fade-in flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-xs text-rose-500 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-rose-600">まずはこれだけ！旅行にすぐ役立つフレーズ</h3>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{scene.description}</p>
        </div>
      </div>

      {/* Learning Study Console (Sticky / Easily Toggled) */}
      <div className="bg-white rounded-2xl p-4 border border-gray-150 shadow-xs space-y-4">
        {/* Playback speed & visual assist switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Assist Switches */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">学習表示オプション</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowRuby(!showRuby)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  showRuby 
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-2xs' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
                title="韓国語の発音カタカナルビを切り替えます"
              >
                {showRuby ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>ルビ {showRuby ? '表示中' : '非表示'}</span>
              </button>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  showTranslation 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-2xs' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
                title="日本語訳の表示を切り替えます"
              >
                {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>和訳 {showTranslation ? '表示中' : '非表示'}</span>
              </button>
            </div>
          </div>

          {/* Speech Rate Controls */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">読み上げスピード</span>
            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {[
                { label: 'ゆっくり', value: 0.70 },
                { label: '標準', value: 0.85 },
                { label: 'ネイティブ', value: 1.0 }
              ].map((rate) => (
                <button
                  key={rate.value}
                  onClick={() => {
                    setSpeechRate(rate.value);
                    if (speakingId) stopSpeaking(); // Reset speaking with new speed
                  }}
                  className={`flex-1 text-[10px] font-extrabold py-1.5 rounded-lg transition-all ${
                    speechRate === rate.value
                      ? 'bg-white text-blue-600 shadow-xs border border-blue-100'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Auto-Play Bar */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Headphones className="w-4 h-4 text-blue-500" />
            <span>20対話を最初から自動で連続再生</span>
          </div>
          <button
            onClick={handleToggleAutoPlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
              isAutoPlay
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-rose-400 to-blue-500 text-white hover:from-rose-500 hover:to-blue-600'
            }`}
            id="btn-dialogue-autoplay"
          >
            {isAutoPlay ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>再生停止</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>会話を自動連続再生</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Conversation Messenger Chat-Flow Arena */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.04
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="space-y-6 relative"
      >
        {dialoguePairs.map((pair, pairIdx) => {
          return (
            <div 
              key={`pair-${pairIdx}`} 
              className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-xs space-y-4 relative pt-10"
            >
              {/* Conversation Group Badge */}
              <div className="absolute top-0 left-0 bg-blue-50/80 border-r border-b border-blue-100/30 text-blue-700 text-[9.5px] font-black tracking-wider px-3 py-1 rounded-tl-2xl rounded-br-xl uppercase">
                対話 {pairIdx + 1}
              </div>

              <div className="space-y-4">
                {pair.map((dialogue) => {
                  const isSpeaking = speakingId === dialogue.id;
                  const isSaved = favorites.includes(dialogue.id);
                  const isSelf = dialogue.role === 'self';

                  return (
                    <motion.div
                      key={dialogue.id}
                      id={`dialogue-bubble-${dialogue.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.96 },
                        show: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: { type: 'spring', stiffness: 260, damping: 20 }
                        }
                      }}
                      layout
                      className={`flex items-start gap-2.5 relative z-10 transition-all duration-300 ${
                        isSelf ? 'flex-row-reverse' : 'flex-row'
                      } ${isSpeaking ? 'scale-[1.015]' : 'scale-100'}`}
                    >
                      {/* Profile Avatar Badge */}
                      <div 
                        onClick={() => handlePlay(dialogue.id, dialogue.korean)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-xs border cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          isSelf 
                            ? 'bg-rose-50 border-rose-200 text-rose-500' 
                            : 'bg-blue-50 border-blue-200 text-blue-500'
                        }`}
                      >
                        {isSelf ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>

                      {/* Chat Bubble Body */}
                      <div className="max-w-[78%] space-y-1">
                        {/* Speaker Name Tag */}
                        <div className={`text-[10px] font-bold tracking-wide px-1 ${
                          isSelf ? 'text-right text-rose-600' : 'text-left text-blue-600'
                        }`}>
                          {isSelf ? '自分 (You)' : '現地の人 (Local)'}
                        </div>

                        {/* Bubble Container */}
                        <div
                          className={`p-4 rounded-2xl shadow-xs transition-all relative border ${
                            isSelf
                              ? 'bg-gradient-to-r from-rose-500 to-rose-400 border-rose-500 text-white rounded-tr-xs'
                              : 'bg-white border-blue-100 text-gray-800 rounded-tl-xs'
                          } ${isSpeaking ? (isSelf ? 'ring-4 ring-rose-400/30 border-rose-400 shadow-md scale-[1.005]' : 'ring-4 ring-blue-400/30 border-blue-400 shadow-md scale-[1.005]') : ''}`}
                        >
                          {/* Speech status indicator dots on active speaking */}
                          {isSpeaking && (
                            <div className={`absolute -top-1.5 -right-1.5 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-xs animate-bounce flex items-center gap-1 ${isSelf ? 'bg-rose-600' : 'bg-blue-600'}`}>
                              <Volume2 className="w-2.5 h-2.5" />
                              <span>再生中</span>
                            </div>
                          )}

                          {/* Japanese Translation (conditional) */}
                          {showTranslation && (
                            <p className={`text-xs font-medium leading-relaxed mb-1.5 ${
                              isSelf ? 'text-rose-100/95' : 'text-gray-500'
                            }`}>
                              {dialogue.japanese}
                            </p>
                          )}

                          {/* Korean Korean Phrase (Tap to speak) */}
                          <div className="group cursor-pointer" onClick={() => handlePlay(dialogue.id, dialogue.korean)}>
                            <h2 className="text-lg font-extrabold tracking-normal leading-tight break-words select-all">
                              {dialogue.korean}
                            </h2>
                          </div>

                          {/* Romanized / Rubies (conditional) */}
                          {showRuby && (
                            <p className={`text-[11px] font-semibold mt-1 font-mono tracking-wide ${
                              isSelf ? 'text-rose-100/95' : 'text-blue-600/90'
                            }`}>
                              [ {dialogue.romanized} ]
                            </p>
                          )}

                          {/* Dialogue Bubble Action Toolbar */}
                          <div className={`flex items-center gap-3 mt-3 pt-2.5 border-t text-xs ${
                            isSelf ? 'border-white/10 text-white/80' : 'border-gray-150 text-gray-400'
                          }`}>
                            {/* Speak Button */}
                            <button
                              onClick={() => handlePlay(dialogue.id, dialogue.korean)}
                              className={`flex items-center gap-1 py-1 px-2.5 rounded-md font-bold transition-all ${
                                isSelf
                                  ? 'hover:bg-white/15 active:bg-white/20 text-white'
                                  : 'hover:bg-blue-50 active:bg-blue-100 text-blue-700 bg-blue-50'
                              }`}
                              title="音声を再生します"
                            >
                              {isSpeaking ? (
                                <>
                                  <span className="flex gap-0.5 items-center justify-center h-3 w-3">
                                    <span className="animate-bounce inline-block w-0.5 h-2 bg-current rounded"></span>
                                    <span className="animate-bounce inline-block w-0.5 h-3 bg-current rounded [animation-delay:0.15s]"></span>
                                    <span className="animate-bounce inline-block w-0.5 h-1.5 bg-current rounded [animation-delay:0.3s]"></span>
                                  </span>
                                  <span>停止</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>きく</span>
                                </>
                              )}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopyText(dialogue.id, dialogue.korean)}
                              className={`flex items-center gap-1 py-1 px-2.5 rounded-md transition-all ${
                                isSelf ? 'hover:bg-white/15' : 'hover:bg-gray-100'
                              }`}
                              title="韓国語テキストをコピー"
                            >
                              {copiedId === dialogue.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-blue-500" />
                                  <span className={isSelf ? 'text-white' : 'text-blue-600 font-bold'}>コピー済</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>コピー</span>
                                </>
                              )}
                            </button>

                            {/* Bookmark Heart Button */}
                            <button
                              onClick={() => onToggleFavorite(dialogue.id)}
                              className={`flex items-center gap-1 py-1 px-2 ml-auto rounded-md transition-all ${
                                isSelf ? 'hover:bg-white/15' : 'hover:bg-gray-100'
                              }`}
                              title="お気に入りに保存"
                            >
                              <Heart
                                className={`w-4 h-4 transition-transform active:scale-125 ${
                                  isSaved
                                    ? 'fill-rose-500 stroke-rose-500'
                                    : isSelf
                                    ? 'stroke-white hover:fill-white/10'
                                    : 'stroke-gray-400 hover:fill-rose-50/60'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Finished / Reset AutoPlay bottom alert */}
      {isAutoPlay && (
        <div className="fixed bottom-20 left-4 right-4 z-30 bg-gradient-to-r from-rose-600/95 to-blue-600/95 text-white py-3 px-4 rounded-xl shadow-xl flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-xs font-bold">会話を自動再生中... (進行度: {autoPlayIdx !== null ? autoPlayIdx + 1 : 0} / 20)</span>
          </div>
          <button
            onClick={handleToggleAutoPlay}
            className="text-xs font-black bg-white/20 hover:bg-white/30 text-white py-1 px-2.5 rounded-lg transition-all"
          >
            停止
          </button>
        </div>
      )}
    </div>
  );
}
