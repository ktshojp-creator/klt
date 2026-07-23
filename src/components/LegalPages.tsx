import React, { useState } from 'react';
import { ShieldCheck, Scale, Info, Globe, Heart, BookOpen, Plane, Mail, ChevronDown } from 'lucide-react';

export default function LegalPages() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'info'>('privacy');
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">規約・アプリ情報</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          アプリ利用規約、プライバシーポリシー、および製品のバージョン情報をご確認いただけます。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 text-xs font-bold transition-all ${
            activeTab === 'privacy'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="btn-legal-tab-privacy"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>プライバシー</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 text-xs font-bold transition-all ${
            activeTab === 'terms'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="btn-legal-tab-terms"
        >
          <Scale className="w-4 h-4" />
          <span>利用規約</span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 border-b-2 text-xs font-bold transition-all ${
            activeTab === 'info'
              ? 'border-rose-400 text-rose-500'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
          id="btn-legal-tab-info"
        >
          <Info className="w-4 h-4" />
          <span>アプリ情報</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 text-xs text-gray-600 leading-relaxed max-h-[60vh] overflow-y-auto">
        
        {/* Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              プライバシーポリシー（個人情報保護方針）
            </h3>
            
            <p className="text-gray-500">
              「韓国旅行 これだけ！会話集」（以下、「当アプリ」といいます）は、ユーザーのプライバシーの重要性を深く認識し、個人情報の保護に最大限の配慮を行っています。
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">1. 個人情報の収集について</h4>
              <p>
                当アプリは、氏名、メールアドレス、電話番号、位置情報、クレジットカード情報などの<strong>個人情報を一切収集いたしません。</strong>また、ログイン登録やアカウント作成の必要なくご利用いただけます。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">2. データの保存と永続化について</h4>
              <p>
                ユーザーのお気に入り設定やクイズ成績などの学習進捗データは、ユーザーがご利用中のデバイス内部（Webブラウザの「ローカルストレージ」機能）にのみ保存されます。これらのデータが外部のサーバーに送信されることはありません。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">3. 音声発話機能（TTS）について</h4>
              <p>
                当アプリの音声再生機能は、デバイスに標準搭載されている「Web Speech API」（音声合成エンジン）を利用しています。音声発話処理はすべてオフラインかつデバイスのローカル処理で行われ、外部のクラウドサーバーなどに音声が送信・録音されることはありません。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">4. Cookieやアクセス解析について</h4>
              <p>
                当アプリは、外部サービスへの追跡Cookieや広告トラッキング用のCookieを使用していません。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">5. お問い合わせ</h4>
              <p>
                プライバシーポリシーやご意見・ご要望に関するお問い合わせは、下記のお問い合わせフォームより受け付けております。
              </p>
              
              {/* Contact Form Section inside Privacy */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-lg transition-colors border border-gray-200/60"
                  id="btn-privacy-contact-form-toggle"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>{showContactForm ? 'お問い合わせフォームを閉じる' : 'お問い合わせフォームを開く'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showContactForm ? 'rotate-180' : ''}`} />
                </button>

                {showContactForm && (
                  <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-1 flex justify-center">
                    <iframe
                      src="https://docs.google.com/forms/d/e/1FAIpQLSc3lpJT2Pdvk_2doGACaSiy3BvdPMU7tirKxXOk6vMaOOLBKA/viewform?embedded=true"
                      width="400"
                      height="1029"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      className="max-w-full rounded-lg bg-white"
                      loading="lazy"
                      title="お問い合わせフォーム"
                    >
                      読み込んでいます…
                    </iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Terms of Service */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b pb-2">
              <Scale className="w-4 h-4 text-blue-500" />
              利用規約
            </h3>
            
            <p className="text-gray-500">
              この利用規約（以下、「本規約」といいます）は、「韓国旅行 これだけ！会話集」（以下、「当アプリ」といいます）の利用条件を定めるものです。
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">1. 利用許諾</h4>
              <p>
                ユーザーは、本規約に従って当アプリを非営利かつ個人的な目的でのみ、ご自身のデバイスにダウンロードして利用することができます。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">2. 知的財産権</h4>
              <p>
                当アプリに含まれるすべてのテキスト、会話フレーズ、画像、アイコン、プログラムコード、その他の素材に関する著作権、商標権、知的財産権は、当アプリの制作者またはライセンス提供者に帰属します。無断での二次配布や複製を禁止します。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">3. 禁止事項</h4>
              <p>ユーザーは、当アプリの利用にあたり、以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>当アプリの解析、改変、リバースエンジニアリング行為</li>
                <li>当アプリ内のコンテンツを抽出し、他サービスへ無断転載・配布する行為</li>
                <li>当アプリの運営やサーバー通信を妨害するおそれのある不当なアクセス行為</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">4. 免責事項</h4>
              <p>
                当アプリの会話コンテンツの正確性については細心の注意を払っておりますが、実際の渡航先でのすべての対話や取引の成功を保証するものではありません。当アプリの利用によって生じた直接的、間接的損害（トラブル、事故、通信費用の発生など）について、制作者は一切の責任を負いません。
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-800">5. 規約の変更・準拠法</h4>
              <p>
                制作者は、必要に応じてユーザーに事前の通知をすることなく本規約を変更することができます。本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
            </div>
          </div>
        )}

        {/* About App Info */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b pb-2">
              <Info className="w-4 h-4 text-rose-500" />
              アプリについて
            </h3>

            <div className="text-center py-4 space-y-3 flex flex-col items-center select-none">
              <div className="flex items-center gap-2 bg-[#fdfaf8] border border-rose-200/60 rounded-full px-4 py-2 text-gray-700 shadow-3xs">
                <BookOpen className="w-5 h-5 text-rose-500 stroke-[2.5px]" />
                <div className="h-3 w-[1px] bg-gray-200" />
                <Plane className="w-5 h-5 text-blue-500 stroke-[2.5px] transform rotate-[-15deg]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">韓国旅行 これだけ！会話集</h4>
                <p className="text-[10px] text-gray-400 font-semibold">Version 1.0.0 (Vite PWA Edition)</p>
              </div>
            </div>

            <p>
              本アプリは、旅行中にスマートフォンで手軽に開いて、すぐに使える韓国語フレーズをシーン別でまとめた学習アプリケーションです。
            </p>

            <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between border-b border-gray-200/50 pb-1.5 mb-1.5">
                <span className="font-bold text-gray-500">プラットフォーム:</span>
                <span className="font-semibold text-gray-800">PWA & Capacitor Hybrid</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/50 pb-1.5 mb-1.5">
                <span className="font-bold text-gray-500">開発環境:</span>
                <span className="font-semibold text-gray-800">Vite 7 + React 19</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-500">オフライン動作:</span>
                <span className="font-semibold text-rose-500">対応 (Service Worker)</span>
              </div>
            </div>

            {/* Supporter Notice Banner */}
            <div className="bg-amber-500/5 rounded-2xl border border-amber-500/15 p-4 space-y-2 mt-4">
              <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                <span>アプリをご愛用いただく皆様へ</span>
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                当アプリは高いストア手数料の発生しない「PWA」方式で提供しており、ユーザー様の温かいご直接支援のみで運営費を賄っています。
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                画面右上にある<strong>「サポーター募集」</strong>ボタンより、いつでもコーヒー1杯分（500円）からおやつ寄付をすることが可能です。サポーターになると、御礼として<strong>すべてのアプリ内広告（全画面・インフィード）が永久に非表示</strong>になります。
              </p>
            </div>

            {/* Contact Form Collapsible */}
            <div className="pt-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-xl border border-gray-200/80 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-bold text-xs text-gray-800">お問い合わせ・ご要望</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-3xs flex items-center gap-1 transition-colors"
                    id="btn-info-contact-form-toggle"
                  >
                    <span>{showContactForm ? 'フォームを閉じる' : 'フォームを表示'}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showContactForm ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                <p className="text-[11px] text-gray-500">
                  アプリに関するご不具合、コンテンツの修正ご要望、その他お問い合わせはこちらから送信いただけます。
                </p>

                {showContactForm && (
                  <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden bg-white p-1 flex justify-center">
                    <iframe
                      src="https://docs.google.com/forms/d/e/1FAIpQLSc3lpJT2Pdvk_2doGACaSiy3BvdPMU7tirKxXOk6vMaOOLBKA/viewform?embedded=true"
                      width="400"
                      height="1029"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      className="max-w-full rounded-lg bg-white"
                      loading="lazy"
                      title="お問い合わせフォーム"
                    >
                      読み込んでいます…
                    </iframe>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-6 pt-4 border-t">
              © 2026 Korean Travel Learning App. All rights reserved.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

