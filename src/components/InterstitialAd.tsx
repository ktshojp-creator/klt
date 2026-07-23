import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Volume2, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  onBecomeSupporter: () => void;
}

const AD_TEMPLATES = [
  {
    title: '韓国旅行に必須の高速eSIM 10%OFF',
    sponsor: '韓通モバイル',
    description: 'データ無制限、韓国3大キャリア回線でどこでもサクサク繋がる！QRコードですぐ設定可能。',
    cta: '特別クーポンを獲得',
    imageBg: 'from-blue-600 to-indigo-900',
    tag: '通信eSIM [PR]'
  },
  {
    title: 'ソウル・釜山ホテルが最大30%OFF',
    sponsor: 'K-Travels',
    description: '明洞や東大門の人気ホテルがシークレット価格。日本語サポート付きで初めての渡韓も安心！',
    cta: '今すぐホテルを探す',
    imageBg: 'from-amber-600 to-red-800',
    tag: '格安ホテル [PR]'
  },
  {
    title: '仁川空港からソウル市内への直通列車(AREX)',
    sponsor: 'AREXオフィシャル予約',
    description: '最速43分でソウル駅へ！混雑する窓口に並ばず、スマホで即時乗車券を発行できます。',
    cta: 'オンライン割引で購入',
    imageBg: 'from-sky-500 to-indigo-900',
    tag: '交通割引券 [PR]'
  }
];

export default function InterstitialAd({ isOpen, onClose, onBecomeSupporter }: InterstitialAdProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [ad, setAd] = useState(AD_TEMPLATES[0]);

  useEffect(() => {
    if (isOpen) {
      // 毎回異なる広告をランダムに選択
      const randomIndex = Math.floor(Math.random() * AD_TEMPLATES.length);
      setAd(AD_TEMPLATES[randomIndex]);
      setTimeLeft(5);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-sm bg-[#faf8f5] rounded-3xl overflow-hidden shadow-2xl border border-[#e3ded5]/40 flex flex-col relative"
      >
        {/* Header Ad Label & Timer */}
        <div className="bg-[#f5f2eb] px-4 py-3 flex items-center justify-between border-b border-[#e3ded5]/40">
          <span className="text-[10px] bg-[#e3ded5] text-gray-600 px-2 py-0.5 rounded-md font-bold tracking-wider uppercase">
            Sponsored Ad
          </span>
          
          {timeLeft > 0 ? (
            <span className="text-xs text-[#736c64] font-medium flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-rose-400 text-white rounded-full text-[10px] font-bold animate-pulse">
                {timeLeft}
              </span>
              秒後にスキップ可能
            </span>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 py-1 px-2.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>広告を閉じる</span>
            </button>
          )}
        </div>

        {/* Ad Poster Visual Space */}
        <div className={`p-6 bg-gradient-to-br ${ad.imageBg} text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="text-[9px] bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block mb-3">
              {ad.tag}
            </span>
            <h3 className="text-xl font-black tracking-tight leading-snug">
              {ad.title}
            </h3>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4">
            <span className="text-xs font-semibold text-white/80">{ad.sponsor}</span>
            <div className="flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-1 rounded-md">
              <span>詳細を見る</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Ad Text Context */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {ad.description}
          </p>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('これはシミュレーション用のデモ広告です。実際には公式サイトへリダイレクトされます。');
            }}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-center text-xs hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            {ad.cta}
          </a>

          {/* Supporter Conversion Area */}
          <div className="pt-4 border-t border-dashed border-[#e3ded5] text-center">
            <p className="text-[10px] text-gray-400 mb-2">
              広告を永久に非表示にしませんか？
            </p>
            <button
              onClick={() => {
                onClose();
                onBecomeSupporter();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-amber-700" />
              <span>サポーター特典で広告を消す</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
