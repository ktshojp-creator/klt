export interface Dialogue {
  id: string;
  sceneId: string;
  japanese: string;     // 日本語訳 ("何名様ですか？" / "2人です。席はありますか？")
  korean: string;       // 韓国語 ("몇 분이세요?" / "두 명이에요. 자리가 있어요?")
  romanized: string;    // カタカナ・ルビ表記 ("ミョッ プニセヨ?" / "トゥ ミョンイエヨ。チャリガ イッソヨ?")
  role: 'shop' | 'self'; // 話者 ('shop': 店員/現地の人、'self': 自分)
  order: number;        // 対話内での順序
}

export interface Scene {
  id: string;           // "restaurant", "hotel", "station", "sightseeing", "emergency"
  name: string;         // "飲食店で", "ホテルで", "駅・交通", "観光地で", "緊急事態"
  description: string;  // シーン説明
  iconName: string;     // Lucideアイコン名（Utensils, Hotel, Train, Camera, AlertTriangle など）
  emoji: string;        // 補助Emoji（🍔, 🏨, 🎫, 📸, 🚨）
  dialogues: Dialogue[];
}

export interface UserData {
  favorites: string[];  // お気に入りに登録されたDialogue IDの配列
  quizScores: {
    [sceneId: string]: {
      correct: number;
      total: number;
      date: string;
    }[];
  };
  isSupporter?: boolean; // サポーター（寄付・広告非表示）かどうか
}
