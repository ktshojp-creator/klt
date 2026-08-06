import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Sparkles, ExternalLink } from 'lucide-react';
import { AffiliateAd } from '../data/affiliateAds';

interface A8AdCardProps {
  key?: string;
  ad: AffiliateAd;
  category: 'gourmet' | 'beauty' | string;
  onBecomeSupporter?: () => void;
}

export default function A8AdCard({ ad, category, onBecomeSupporter }: A8AdCardProps) {
  const isGourmet = category === 'gourmet';

  // 1. A8.net の HTML広告コード（<a href="..."><img ...></a>等）が直接指定されている場合
  if (ad.htmlCode && ad.htmlCode.trim().length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 md:col-span-2 bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-2xs overflow-hidden"
      >
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            スポンサー広告 [PR]
          </span>
          {onBecomeSupporter && (
            <button
              onClick={onBecomeSupporter}
              className="text-[10px] text-gray-400 hover:text-rose-500 underline font-semibold cursor-pointer"
            >
              広告を非表示にする
            </button>
          )}
        </div>

        {/* A8.net HTMLタグの埋め込み */}
        <div
          className="a8-ad-container flex items-center justify-center my-1 overflow-x-auto max-w-full"
          dangerouslySetInnerHTML={{ __html: ad.htmlCode }}
        />
      </motion.div>
    );
  }

  // 2. カスタムカードデザイン（アフィリエイトリンクURLを使用）
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50/40 via-white to-rose-50/30 border border-blue-100/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xs"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 ${isGourmet ? 'bg-rose-500' : 'bg-rose-400'} text-white rounded-xl shrink-0 flex items-center justify-center`}>
          {isGourmet ? <Utensils className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-gray-800 text-sm">
              {ad.title || (isGourmet ? '【ソウルグルメ】人気焼肉・伝統料理の日本語予約' : '【K-Beauty】話題の美容皮膚科・サロン予約')}
            </span>
            <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider scale-90">
              PR
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {ad.description || '現地のおすすめサービス情報をチェック！お得なプラン多数掲載中。'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        {onBecomeSupporter && (
          <button
            onClick={onBecomeSupporter}
            className="text-[10px] text-gray-400 hover:text-rose-500 underline font-semibold cursor-pointer"
          >
            広告を消す
          </button>
        )}
        <a
          href={ad.linkUrl || '#'}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="px-3.5 py-1.5 bg-gradient-to-r from-blue-500 to-rose-400 hover:from-blue-600 hover:to-rose-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{ad.ctaText || '詳細を見る'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* インプレッション計測用画像の読み込み（もしあれば） */}
      {ad.impressionTrackUrl && (
        <img
          src={ad.impressionTrackUrl}
          width="1"
          height="1"
          alt=""
          className="hidden"
        />
      )}
    </motion.div>
  );
}
