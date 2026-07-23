import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Coffee, ShieldCheck, Sparkles, X, Check, CreditCard } from 'lucide-react';

interface SupporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupporter: boolean;
  onToggleSupporter: (status: boolean) => void;
}

export default function SupporterModal({ isOpen, onClose, isSupporter, onToggleSupporter }: SupporterModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSupport = () => {
    setIsProcessing(true);
    // 決済シミュレーション
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      onToggleSupporter(true);
    }, 2000);
  };

  const handleCancelSupport = () => {
    if (confirm('サポーター登録を解除し、広告表示モードに戻しますか？')) {
      onToggleSupporter(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="modal-main"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-[#faf8f5] rounded-3xl overflow-hidden shadow-2xl border border-[#e3ded5]/40 flex flex-col relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#f5f2eb] hover:bg-[#e3ded5] text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Header */}
            <div className="p-6 text-center space-y-2 border-b border-[#e3ded5]/30">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-1">
                <Heart className="w-6 h-6 fill-amber-500 stroke-amber-500" />
              </div>
              <h3 className="text-lg font-black text-gray-900">サポーター（寄付）募集 ☕</h3>
              <p className="text-xs text-gray-500">
                本アプリは個人開発のPWA（プログレッシブウェブアプリ）です。
              </p>
            </div>

            {/* Description Body */}
            <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto text-sm">
              <p className="text-xs text-gray-600 leading-relaxed">
                App Store等の高い手数料（30%）を介さないPWAだからこそ、ユーザー様からの温かい直接サポートが開発・サーバー運営に直接繋がります！
              </p>

              {/* Supporter Merits */}
              <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-200/30 space-y-2.5">
                <h4 className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>サポーター（寄付）の特典</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span><strong>広告を永久に非表示</strong>（インフィード・全画面）</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>クイズ等すべての機能をいつでも快適に</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>開発者の韓国旅行と学習の応援</span>
                  </li>
                </ul>
              </div>

              {isSupporter ? (
                <div className="bg-amber-500/10 border border-amber-200 text-amber-900 rounded-xl p-3 text-center text-xs font-bold space-y-1">
                  <div>🎉 現在サポーター登録済みです！</div>
                  <div className="text-[10px] text-amber-700 font-normal">温かいご支援を本当にありがとうございます！</div>
                </div>
              ) : (
                <div className="text-center bg-[#f5f2eb] rounded-xl py-3 border border-[#e3ded5]/40">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest">おやつ寄付プラン</span>
                  <span className="text-xl font-black text-gray-800">¥500 <span className="text-xs font-normal">/ 1回のみ</span></span>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-[#f5f2eb]/60 border-t border-[#e3ded5]/30">
              {isProcessing ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>セキュア接続中...</span>
                </button>
              ) : isSupporter ? (
                <button
                  onClick={handleCancelSupport}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  サポーター登録を解除する（デモ戻し）
                </button>
              ) : (
                <button
                  onClick={handleSupport}
                  className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>サポーターとして寄付する (デモ決済)</span>
                </button>
              )}
              <p className="text-[9px] text-gray-400 text-center mt-2.5">
                ※この決済はデモシミュレーションです。実際の課金は発生しません。
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="modal-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-[#faf8f5] rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-[#e3ded5]/40"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 animate-bounce text-rose-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">감사합니다! (ありがとうございます！)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                サポーター登録（寄付）が完了しました！アプリのすべての広告が永久に非表示になりました。温かいご支援を今後のアプリの機能追加・改善に役立たせていただきます。
              </p>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full py-3 bg-[#2d2a26] text-white font-bold rounded-xl text-xs hover:bg-black transition-colors cursor-pointer"
            >
              広告なしでアプリを楽しむ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
