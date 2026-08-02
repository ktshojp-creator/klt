import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, Sparkles, X, Check, CreditCard, LogIn, LogOut, Mail, User as UserIcon, Lock, AlertCircle } from 'lucide-react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  doc, 
  onSnapshot, 
  User 
} from '../lib/firebase';

interface SupporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupporter: boolean;
  onToggleSupporter: (status: boolean) => void;
}

export default function SupporterModal({ isOpen, onClose, isSupporter, onToggleSupporter }: SupporterModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(isSupporter);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Monitor Firebase Auth & Firestore user doc
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const premiumStatus = !!data?.is_premium;
            setIsPremium(premiumStatus);
            onToggleSupporter(premiumStatus);
          } else {
            setIsPremium(false);
          }
        }, (err) => {
          console.error('Firestore snapshot listener error:', err);
        });
        return () => unsubscribeDoc();
      } else {
        setIsPremium(false);
      }
    });

    return () => unsubscribeAuth();
  }, [onToggleSupporter]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    if (!auth) {
      setErrorMsg('Firebaseの設定を読み込めませんでした。');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setErrorMsg(err.message || 'Googleログインに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setErrorMsg('Firebaseの設定を読み込めませんでした。');
      return;
    }
    if (!email || !password) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Email Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('メールアドレスまたはパスワードが正しくありません。');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('このメールアドレスは既に登録されています。ログインをお試しください。');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('パスワードは6文字以上で設定してください。');
      } else {
        setErrorMsg(err.message || '認証エラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signOut(auth);
      setErrorMsg(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Stripe Checkout via Payment Link
  const handleStripeCheckout = async () => {
    if (!currentUser) {
      setErrorMsg('広告非表示版を購入するにはログインが必要です。');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const baseUrl = 'https://buy.stripe.com/8x2fZj1PXfgTbOAbey4gg00';
      const checkoutUrl = new URL(baseUrl);
      
      // Pass logged-in User UID and Email to Stripe for tracking
      checkoutUrl.searchParams.set('client_reference_id', currentUser.uid);
      if (currentUser.email) {
        checkoutUrl.searchParams.set('prefilled_email', currentUser.email);
      }

      window.location.href = checkoutUrl.toString();
    } catch (err: any) {
      console.error('Stripe Checkout error:', err);
      setErrorMsg(err.message || '決済画面への遷移時にエラーが発生しました。');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key="modal-main"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-sm bg-[#faf8f5] rounded-3xl overflow-hidden shadow-2xl border border-[#e3ded5]/40 flex flex-col relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#f5f2eb] hover:bg-[#e3ded5] text-gray-500 transition-colors cursor-pointer z-10"
            id="btn-close-supporter-modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content Header */}
          <div className="p-6 text-center space-y-2 border-b border-[#e3ded5]/30">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-1">
              <Sparkles className="w-6 h-6 fill-rose-500 stroke-rose-500" />
            </div>
            <h3 className="text-lg font-black text-gray-900">広告非表示プラン（買い切り）</h3>
            <p className="text-xs text-gray-500">
              一度のご購入で、すべての広告が永久に非表示になります。
            </p>
          </div>

          {/* Description Body */}
          <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto text-sm">
            
            {/* Supporter Merits */}
            <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-200/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>買い切り 480円（月額料金なし）</span>
                </h4>
                <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">¥480</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span><strong>全広告を永久削除</strong>（全画面・インフィード）</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>ログインで複数端末や機種変更後も自動復元</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>安全な Stripe オンライン決済で即時反映</span>
                </li>
              </ul>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* User Login / Auth Status Section */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
              <h4 className="text-xs font-bold text-gray-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span>アカウント状態</span>
                </span>
                {currentUser && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                    ログイン中
                  </span>
                )}
              </h4>

              {currentUser ? (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="truncate">
                      <p className="font-bold text-gray-800 truncate">{currentUser.displayName || 'ユーザー'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="text-[11px] text-gray-500 hover:text-gray-800 underline ml-2 shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>ログアウト</span>
                    </button>
                  </div>

                  {isPremium ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 text-emerald-800">
                      <div className="font-bold flex items-center justify-center gap-1 text-xs">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>広告非表示版（480円）有効化済み</span>
                      </div>
                      <p className="text-[10px] text-emerald-700">すべての広告は非表示になっています。</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500 text-center">
                      未購入アカウントです。下のボタンから決済へ進めます。
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    購入情報の紐付けと端末間復元のため、ログインしてください。
                  </p>

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Googleアカウントでログイン</span>
                  </button>

                  <div className="relative flex items-center my-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-gray-400">またはメールアドレス</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-2">
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        placeholder="パスワード（6文字以上）"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 bg-gray-800 hover:bg-black text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{authMode === 'login' ? 'メールでログイン' : '新規アカウント登録'}</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode(authMode === 'login' ? 'signup' : 'login');
                          setErrorMsg(null);
                        }}
                        className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                      >
                        {authMode === 'login' ? '新規アカウント作成はこちら' : '登録済みの方（ログイン）はこちら'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-[#f5f2eb]/60 border-t border-[#e3ded5]/30">
            {isLoading ? (
              <button
                disabled
                className="w-full py-3 bg-gray-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>処理中...</span>
              </button>
            ) : isPremium ? (
              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>広告なしでアプリを利用する</span>
              </button>
            ) : (
              <button
                onClick={handleStripeCheckout}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="btn-stripe-checkout"
              >
                <CreditCard className="w-4 h-4" />
                <span>{currentUser ? '広告なし版を購入 (480円)' : 'ログインして購入に進む (480円)'}</span>
              </button>
            )}
            <p className="text-[9px] text-gray-400 text-center mt-2.5">
              Stripe の暗号化決済システムを使用しています。カード情報は安全に処理されます。
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
