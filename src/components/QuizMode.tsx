import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene, Dialogue } from '../types';
import { HelpCircle, ChevronRight, CheckCircle2, XCircle, RotateCcw, Volume2, Trophy, BarChart2, Sparkles, Utensils } from 'lucide-react';
import * as Icons from 'lucide-react';
import { speakKorean } from '../lib/tts';

interface QuizModeProps {
  scenes: Scene[];
  quizScores: {
    [sceneId: string]: {
      correct: number;
      total: number;
      date: string;
    }[];
  };
  onSaveScore: (sceneId: string, correct: number, total: number) => void;
  isSupporter?: boolean;
  onBecomeSupporter?: () => void;
}

interface Question {
  dialogue: Dialogue;
  options: string[]; // List of Korean phrases
}

export default function QuizMode({ 
  scenes, 
  quizScores, 
  onSaveScore,
  isSupporter = false,
  onBecomeSupporter
}: QuizModeProps) {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'menu' | 'active' | 'summary'>('menu');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Flatten all dialogues
  const allDialogues = useMemo(() => {
    return scenes.reduce<Dialogue[]>((acc, scene) => [...acc, ...scene.dialogues], []);
  }, [scenes]);

  // Start the quiz
  const handleStartQuiz = (sceneId: string) => {
    // Select relevant dialogues
    const fullPool = sceneId === 'all'
      ? [...allDialogues]
      : scenes.find(s => s.id === sceneId)?.dialogues || [];

    // Practical learning: only query phrases that the user (You / self) says
    let sourceDialogues = fullPool.filter(d => d.role === 'self');

    // Safe fallback if for some reason we don't have enough self dialogues
    if (sourceDialogues.length < 4) {
      sourceDialogues = fullPool;
    }

    if (sourceDialogues.length < 4) {
      alert('クイズに必要なフレーズ数が足りません。');
      return;
    }

    // Shuffle and pick 5 random dialogues
    const shuffled = [...sourceDialogues].sort(() => 0.5 - Math.random());
    const selectedDialogues = shuffled.slice(0, 5);

    // Build questions with 4 options each
    const generatedQuestions: Question[] = selectedDialogues.map((dlg) => {
      // Get incorrect options from the same pool (which consists of 'self' phrases)
      const otherPool = sourceDialogues.filter(d => d.id !== dlg.id);
      const shuffledOthers = [...otherPool].sort(() => 0.5 - Math.random());
      
      const incorrectOptions = shuffledOthers.slice(0, 3).map(o => o.korean);
      const options = [dlg.korean, ...incorrectOptions].sort(() => 0.5 - Math.random());

      return {
        dialogue: dlg,
        options
      };
    });

    setActiveSceneId(sceneId);
    setQuestions(generatedQuestions);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectAnswersCount(0);
    setQuizState('active');
  };

  const handleSelectOption = (option: string) => {
    if (hasAnswered) return;
    
    setSelectedOption(option);
    setHasAnswered(true);
    
    const isCorrect = option === questions[currentQuestionIdx].dialogue.korean;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }

    // Speak the correct pronunciation automatically on answer selection!
    handlePlay(questions[currentQuestionIdx].dialogue.id, questions[currentQuestionIdx].dialogue.korean);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Save quiz results
      if (activeSceneId) {
        onSaveScore(activeSceneId, correctAnswersCount, questions.length);
      }
      setQuizState('summary');
    }
  };

  const handlePlay = (id: string, text: string) => {
    setSpeakingId(id);
    speakKorean(
      text,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handleQuitQuiz = () => {
    setQuizState('menu');
    setActiveSceneId(null);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  // Calculate stats
  const totalCompleted = useMemo(() => {
    return Object.values(quizScores).reduce((acc, scores) => acc + scores.length, 0);
  }, [quizScores]);

  const maxScore = useMemo(() => {
    let best = 0;
    Object.values(quizScores).forEach(scoresList => {
      scoresList.forEach(score => {
        if (score.correct > best) best = score.correct;
      });
    });
    return best;
  }, [quizScores]);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* Quiz Menu View */}
        {quizState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="space-y-6"
          >
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">実践クイズ</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              日本語の意味を見て、正しい韓国語フレーズを選択しましょう。5問出題されます。
            </p>
          </div>

          {/* Quick stats box */}
          {totalCompleted > 0 && (
            <div className="bg-rose-50/40 border border-rose-100/60 rounded-2xl p-4 flex gap-4 items-center">
              <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">学習履歴</div>
                <div className="flex gap-4 text-xs font-semibold text-gray-700">
                  <span>挑戦回数: <strong className="text-gray-900 text-sm">{totalCompleted}</strong> 回</span>
                  <span>自己ベスト: <strong className="text-rose-500 text-sm">{maxScore} / 5</strong> 問</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 block">クイズの対象を選択</span>
            
            <button
              onClick={() => handleStartQuiz('all')}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-rose-400/10 to-blue-500/5 hover:from-rose-400/15 hover:to-blue-500/10 border border-rose-200/40 rounded-2xl text-left hover:border-rose-400/70 transition-all group active:scale-[0.99]"
              id="quiz-start-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl shrink-0">
                  <Icons.Sparkles className="w-5 h-5 stroke-[2px] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-600 text-sm">全シーンからランダム</h4>
                  <p className="text-xs text-rose-500/85 mt-0.5">すべての旅行会話から幅広く出題</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {scenes.map((scene, idx) => {
              const IconComponent = (Icons as any)[scene.iconName] || Icons.HelpCircle;
              const isPinkTheme = idx % 2 === 0;
              const buttonElement = (
                <button
                  key={scene.id}
                  onClick={() => handleStartQuiz(scene.id)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl text-left hover:border-rose-200 hover:shadow-sm transition-all group active:scale-[0.99]"
                  id={`quiz-start-${scene.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isPinkTheme 
                        ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-100' 
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[2px]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{scene.name} のクイズ</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{scene.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              );

              if (!isSupporter && scene.id === 'restaurant') {
                const adElement = (
                  <div
                    key="quiz-ad-gourmet"
                    className="w-full bg-gradient-to-r from-blue-50/40 via-white to-rose-50/30 border border-blue-100/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-rose-500 text-white rounded-xl shrink-0 flex items-center justify-center">
                        <Utensils className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-gray-800 text-xs">【ソウルグルメ】人気焼肉・伝統料理の日本語予約サービス</span>
                          <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider scale-90">PR</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          行列必至のサムギョプサルやタッカンマリの名店を現地からスマホ予約！今なら手数料無料。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => onBecomeSupporter?.()} 
                        className="text-[10px] text-gray-400 hover:text-rose-500 underline font-semibold cursor-pointer"
                      >
                        広告を消す
                      </button>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('これはデモ用のインフィード広告です。実際には提携先のグルメ予約サイトへ遷移します。');
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-rose-400 hover:from-blue-600 hover:to-rose-500 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>予約する</span>
                      </a>
                    </div>
                  </div>
                );
                return [buttonElement, adElement];
              }

              if (!isSupporter && scene.id === 'beauty') {
                const adElement = (
                  <div
                    key="quiz-ad-beauty"
                    className="w-full bg-gradient-to-r from-blue-50/40 via-white to-rose-50/30 border border-blue-100/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-rose-400 text-white rounded-xl shrink-0 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-gray-800 text-xs">【K-Beauty】ソウル話題の美容皮膚科・厳選サロン予約</span>
                          <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider scale-90">PR</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          日本語通訳同行プランで安心の肌管理（ピーリング等）。新規予約で特別10%OFF！
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => onBecomeSupporter?.()} 
                        className="text-[10px] text-gray-400 hover:text-rose-500 underline font-semibold cursor-pointer"
                      >
                        広告を消す
                      </button>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('これはデモ用のインフィード広告です。実際には提携先のビューティー予約サイトへ遷移します。');
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-rose-400 hover:from-blue-600 hover:to-rose-500 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>探す</span>
                      </a>
                    </div>
                  </div>
                );
                return [buttonElement, adElement];
              }

              return [buttonElement];
            }).flat()}
          </div>
        </motion.div>
      )}

      {/* Active Quiz View */}
      {quizState === 'active' && questions.length > 0 && (
        <motion.div
          key="active"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {activeSceneId === 'all' ? 'ランダムクイズ' : scenes.find(s => s.id === activeSceneId)?.name}
            </span>
            <button
              onClick={handleQuitQuiz}
              className="text-xs font-semibold text-red-500 hover:text-red-700 py-1 px-3 bg-red-50 rounded-full"
              id="btn-quiz-quit"
            >
              中断する
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 font-semibold">
              <span>質問 {currentQuestionIdx + 1} / 5</span>
              <span>正解数: {correctAnswersCount}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question & Options container with entry/exit animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* Question Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm space-y-3">
                <span className="text-[10px] text-rose-500 bg-rose-50/60 font-extrabold uppercase px-2.5 py-1 rounded-full inline-block tracking-wider">
                  次の日本語に合う韓国語を選んでください
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 leading-normal pt-2">
                  「 {questions[currentQuestionIdx].dialogue.japanese} 」
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestionIdx].options.map((option, idx) => {
                  const isCorrectAnswer = option === questions[currentQuestionIdx].dialogue.korean;
                  const isSelected = option === selectedOption;
                  
                  let btnClass = 'bg-white border-gray-200 hover:border-rose-200 hover:bg-rose-50/10';
                  let iconElement = null;

                  if (hasAnswered) {
                    if (isCorrectAnswer) {
                      btnClass = 'bg-blue-50 border-blue-400 text-blue-800 font-bold ring-2 ring-blue-100';
                      iconElement = <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />;
                    } else if (isSelected) {
                      btnClass = 'bg-red-50 border-red-500 text-red-800 font-bold ring-2 ring-red-100';
                      iconElement = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
                    } else {
                      btnClass = 'bg-gray-50 border-gray-100 text-gray-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full flex items-center justify-between p-4 border rounded-2xl text-left transition-all text-sm font-semibold active:scale-[0.99] disabled:scale-100 ${btnClass}`}
                      style={{ minHeight: '52px' }}
                    >
                      <span className="flex-1 pr-3">{option}</span>
                      {iconElement}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Answer detail explanation and speak button (Only visible after answered) */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-blue-500/5 rounded-2xl border border-blue-500/10 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-blue-500 font-extrabold uppercase tracking-wider">
                      正解の読み方
                    </div>
                    <div className="text-xs font-mono font-bold text-blue-800 italic mt-0.5">
                      [ {questions[currentQuestionIdx].dialogue.romanized} ]
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlay(questions[currentQuestionIdx].dialogue.id, questions[currentQuestionIdx].dialogue.korean)}
                    className={`p-2 rounded-full flex items-center justify-center cursor-pointer ${
                      speakingId === questions[currentQuestionIdx].dialogue.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    id="quiz-play-answer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full flex items-center justify-center gap-1 py-3 px-4 bg-rose-400 rounded-xl text-white font-semibold hover:bg-rose-500 transition-all active:scale-95 text-sm cursor-pointer"
                  id="btn-quiz-next"
                >
                  <span>{currentQuestionIdx === questions.length - 1 ? '結果を見る' : '次の問題へ'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quiz Summary View */}
      {quizState === 'summary' && (
        <motion.div
          key="summary"
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-md space-y-6 max-w-md mx-auto"
        >
          <div className="space-y-2">
            <span className="text-4xl">🏆</span>
            <h2 className="text-2xl font-extrabold text-gray-900">クイズ完了！</h2>
            <p className="text-xs text-gray-500">お疲れ様でした。クイズの結果はこちらです：</p>
          </div>

          {/* Score Circle */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-gray-100 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-rose-400 fill-none"
                strokeWidth="8"
                initial={{ strokeDashoffset: 402 }}
                animate={{ strokeDashoffset: 402 - (402 * (correctAnswersCount / 5)) }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                strokeDasharray={402}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-gray-900">{correctAnswersCount}</span>
              <span className="text-xs text-gray-400 font-bold uppercase mt-0.5">/ 5 問中</span>
            </div>
          </div>

          {/* Encouragement message */}
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-800">
              {correctAnswersCount === 5 && '完璧です！韓国旅行でもばっちり使えますね！🇰🇷✨'}
              {correctAnswersCount === 4 && '素晴らしい！あと一歩で満点です！👍'}
              {correctAnswersCount >= 2 && correctAnswersCount <= 3 && 'いい調子です！繰り返し練習しましょう！😊'}
              {correctAnswersCount <= 1 && 'もう少しですね！何度も発音を聞いて覚えましょう！📚'}
            </p>
          </div>

          {/* Control buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleStartQuiz(activeSceneId || 'all')}
              className="flex-1 flex items-center justify-center gap-1 py-3 px-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 transition-all active:scale-95 text-xs uppercase cursor-pointer"
              id="btn-quiz-retry"
            >
              <RotateCcw className="w-4 h-4" />
              <span>もう一度挑戦</span>
            </button>
            <button
              onClick={handleQuitQuiz}
              className="flex-1 py-3 px-4 bg-rose-400 rounded-xl text-white font-bold hover:bg-rose-500 transition-all active:scale-95 text-xs uppercase cursor-pointer"
              id="btn-quiz-menu"
            >
              メニューに戻る
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
