import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scenesData } from './lib/dialogueData';
import { UserData, Scene } from './types';
import BottomNav from './components/BottomNav';
import SceneGrid from './components/SceneGrid';
import DialogueView from './components/DialogueView';
import SearchPhrases from './components/SearchPhrases';
import FavoritesList from './components/FavoritesList';
import QuizMode from './components/QuizMode';
import LegalPages from './components/LegalPages';
import InterstitialAd from './components/InterstitialAd';
import SupporterModal from './components/SupporterModal';
import { Globe, RefreshCw, Heart } from 'lucide-react';
import { trackPageView, trackEvent } from './lib/analytics';

const LOCAL_STORAGE_KEY = 'korean_travel_learning_user_data_v1';

const initialUserData: UserData = {
  favorites: [],
  quizScores: {}
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('scenes');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<UserData['quizScores']>( {});
  const [isSupporter, setIsSupporter] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [pendingView, setPendingView] = useState<string | null>(null);
  const [showSupporterModal, setShowSupporterModal] = useState<boolean>(false);

  // Load user data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserData;
        if (parsed.favorites) setFavorites(parsed.favorites);
        if (parsed.quizScores) setQuizScores(parsed.quizScores);
        if (parsed.isSupporter !== undefined) setIsSupporter(parsed.isSupporter);
      }
    } catch (e) {
      console.error('Failed to load user data from localStorage:', e);
    }
  }, []);

  // Handle Stripe Payment Redirect Verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');

    if (payment === 'success' && sessionId) {
      fetch(`/api/verify-checkout-session?session_id=${sessionId}`)
        .then((res) => {
          const contentType = res.headers.get('content-type');
          if (res.ok && contentType && contentType.includes('application/json')) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data && (data.success || data.is_premium)) {
            handleToggleSupporter(true);
            setShowSupporterModal(true);
          }
        })
        .catch((err) => console.error('Failed to verify session:', err))
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    } else if (payment === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Track page views in Google Analytics when currentView changes
  useEffect(() => {
    let pageTitle = '韓国旅行会話集 - シーン一覧';
    if (currentView.startsWith('scene-')) {
      const id = currentView.replace('scene-', '');
      const scene = scenesData.find(s => s.id === id);
      pageTitle = scene ? `韓国旅行会話集 - ${scene.name}` : '韓国旅行会話集 - シーン詳細';
    } else if (currentView === 'search') {
      pageTitle = '韓国旅行会話集 - 検索';
    } else if (currentView === 'favorites') {
      pageTitle = '韓国旅行会話集 - お気に入り';
    } else if (currentView === 'quiz') {
      pageTitle = '韓国旅行会話集 - クイズモード';
    } else if (currentView === 'legal') {
      pageTitle = '韓国旅行会話集 - 利用規約';
    }
    
    trackPageView(`/${currentView}`, pageTitle);
  }, [currentView]);

  // Save supporter status to localStorage
  const handleToggleSupporter = (status: boolean) => {
    setIsSupporter(status);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ favorites, quizScores, isSupporter: status })
      );
      if (status) {
        trackEvent('become_supporter', { method: 'button_click' });
      }
    } catch (e) {
      console.error('Failed to save supporter status to localStorage:', e);
    }
  };

  // Save favorites to localStorage
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isAdded = !prev.includes(id);
      const updated = isAdded
        ? [...prev, id]
        : prev.filter((item) => item !== id);
      
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ favorites: updated, quizScores, isSupporter })
        );
        trackEvent(isAdded ? 'add_favorite' : 'remove_favorite', { item_id: id });
      } catch (e) {
        console.error('Failed to save favorites to localStorage:', e);
      }
      return updated;
    });
  };

  // Save quiz score to localStorage
  const handleSaveScore = (sceneId: string, correct: number, total: number) => {
    const newEntry = {
      correct,
      total,
      date: new Date().toISOString()
    };

    setQuizScores((prev) => {
      const updatedList = prev[sceneId] ? [...prev[sceneId], newEntry] : [newEntry];
      const updatedScores = {
        ...prev,
        [sceneId]: updatedList
      };

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ favorites, quizScores: updatedScores, isSupporter })
        );
        trackEvent('quiz_completed', {
          scene_id: sceneId,
          score: correct,
          total: total,
          percentage: Math.round((correct / total) * 100)
        });
      } catch (e) {
        console.error('Failed to save quiz scores to localStorage:', e);
      }
      return updatedScores;
    });
  };

  // Helper to change view and scroll to top
  const handleViewChange = (view: string) => {
    // If user is not supporter and navigating to a detailed scene, intercept with interstitial ad
    if (!isSupporter && view.startsWith('scene-')) {
      setPendingView(view);
      setShowAd(true);
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Render active page view
  const renderViewContent = () => {
    if (currentView === 'scenes') {
      return (
        <SceneGrid
          scenes={scenesData}
          onSelectScene={(sceneId) => handleViewChange(`scene-${sceneId}`)}
          favoritesCount={favorites.length}
          isSupporter={isSupporter}
          onBecomeSupporter={() => setShowSupporterModal(true)}
        />
      );
    }

    if (currentView.startsWith('scene-')) {
      const sceneId = currentView.replace('scene-', '');
      const activeScene = scenesData.find((s) => s.id === sceneId);
      if (activeScene) {
        return (
          <DialogueView
            scene={activeScene}
            onBack={() => handleViewChange('scenes')}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      }
    }

    if (currentView === 'search') {
      return (
        <SearchPhrases
          scenes={scenesData}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    if (currentView === 'favorites') {
      return (
        <FavoritesList
          scenes={scenesData}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    if (currentView === 'quiz') {
      return (
        <QuizMode
          scenes={scenesData}
          quizScores={quizScores}
          onSaveScore={handleSaveScore}
          isSupporter={isSupporter}
          onBecomeSupporter={() => setShowSupporterModal(true)}
        />
      );
    }

    if (currentView === 'legal') {
      return <LegalPages />;
    }

    return (
      <div className="text-center py-12">
        <h3 className="font-bold text-gray-800 text-lg">エラー</h3>
        <p className="text-gray-500 mt-2">指定されたページが見つかりませんでした。</p>
        <button
          onClick={() => handleViewChange('scenes')}
          className="mt-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-xl text-sm"
        >
          ホームに戻る
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex justify-center items-start py-0 md:py-10">
      {/* Simulation Mobile Container Frame */}
      <div className="w-full max-w-md min-h-screen md:min-h-[850px] bg-[#faf8f5] md:rounded-3xl md:shadow-2xl border-0 md:border md:border-gray-200 flex flex-col relative overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        
        {/* Top Status Bar Simulator */}
        <header className="sticky top-0 bg-[#faf8f5]/95 backdrop-blur-md z-40 border-b border-[#e3ded5]/60 px-5 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 min-h-[3.5rem] flex items-center justify-between overflow-hidden relative">
          
          {/* App Icon matching background waves & airplane */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] select-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M-20 30 C 120 5, 220 55, 420 15 L 420 60 L -20 60 Z" fill="url(#header-wave-gradient)" />
              <defs>
                <linearGradient id="header-wave-gradient" x1="0" y1="0" x2="400" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#de82a7" />
                  <stop offset="100%" stopColor="#6082a4" />
                  </linearGradient>
              </defs>
            </svg>
            {/* Faint matching airplane flying in the sky */}
            <svg className="absolute right-32 top-[calc(env(safe-area-inset-top,0px)+10px)] w-7 h-7 text-[#6082a4] transform rotate-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z" />
            </svg>
          </div>

          <div className="flex items-center relative z-10 select-none">
            <h1 className="text-xs md:text-sm font-black text-[#2d2a26] tracking-wider flex items-center gap-0.5">
              <span className="text-rose-500">韓</span>
              <span className="text-blue-500">国</span>
              <span className="text-rose-500">旅</span>
              <span className="text-blue-500">行</span>
              <span className="bg-[#cca300] text-white text-[9px] px-1 py-0.5 rounded-xs font-bold leading-none mx-0.5 rotate-[-2deg] shadow-3xs shrink-0">これだけ！</span>
              <span className="text-blue-500">会</span>
              <span className="text-rose-500">話</span>
              <span className="text-blue-500">集</span>
            </h1>
          </div>
          <button
            onClick={() => setShowSupporterModal(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 bg-amber-500/5 hover:bg-amber-500/10 rounded-full text-[11px] font-bold transition-all border border-amber-500/10 cursor-pointer relative z-10"
            id="supporter-header-btn"
            style={{ minHeight: '30px' }}
          >
            <Heart 
              className={`w-3.5 h-3.5 ${
                isSupporter 
                  ? 'fill-amber-500 stroke-amber-500 animate-pulse' 
                  : 'text-amber-600'
              }`} 
            />
            <span className={isSupporter ? 'text-amber-700 font-extrabold' : 'text-amber-700'}>
              {isSupporter ? 'サポーター優待中' : 'サポーター募集'}
            </span>
          </button>
        </header>

        {/* Dynamic Screen Content Wrapper */}
        <main className="flex-1 p-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {renderViewContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Bottom Navigator */}
        <BottomNav currentView={currentView} onViewChange={handleViewChange} />

        {/* Interstitial Ad Simulator */}
        <AnimatePresence>
          {showAd && (
            <InterstitialAd 
              isOpen={showAd} 
              onClose={handleAdClose} 
              onBecomeSupporter={() => setShowSupporterModal(true)} 
            />
          )}
        </AnimatePresence>

        {/* Supporter Modal Simulator */}
        <SupporterModal 
          isOpen={showSupporterModal} 
          onClose={() => setShowSupporterModal(false)} 
          isSupporter={isSupporter} 
          onToggleSupporter={handleToggleSupporter} 
        />
      </div>
    </div>
  );
}
