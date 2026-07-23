# 韓国旅行 実践会話 - 1から制作するためのプロンプト

## プロジェクト概要

**アプリ名**: 韓国旅行 実践会話  
**目的**: 韓国旅行で実際に使える会話フレーズをシーン別に学習できるPWA/ネイティブアプリ  
**対象ユーザー**: 韓国旅行を予定している日本人学習者  
**主な特徴**: オフライン対応、PWA化、ネイティブアプリ化対応、プライバシー重視

---

## 1. 技術スタック

### フロントエンド
- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7
- **スタイリング**: Tailwind CSS 4
- **UI コンポーネント**: shadcn/ui
- **ルーティング**: Wouter（軽量、PWA対応）
- **フォーム管理**: React Hook Form
- **トースト通知**: Sonner

### PWA・ネイティブ
- **PWA対応**: Service Worker（オフラインキャッシュ）、manifest.json
- **ネイティブアプリ化**: Capacitor 8.4.1
- **ターゲットプラットフォーム**: iOS（Xcode）、Android（Android Studio）

### ホスティング
- **開発環境**: Manus WebDev（自動ホスティング）
- **カスタムドメイン**: koreanlearn-7yatuzkl.manus.space（または独自ドメイン）

---

## 2. 機能要件

### 2.1 コア機能

#### ① シーン選択画面
- **表示内容**: 複数のシーン（飲食店、ホテル、駅、観光地、緊急時等）をグリッド表示
- **インタラクション**: タップでシーン詳細ページへ遷移
- **タップ領域**: 各シーンボタンは最小44×44px以上

#### ② 対話学習画面
- **レイアウト**: 店員（左側、グレー背景）と自分（右側、緑背景）の吹き出し形式
- **表示内容**:
  - 日本語質問文（上部）
  - 韓国語フレーズ（中央、大きめ）
  - 韓国語ローマ字表記（下部、小さめ）
  - 音声再生ボタン（スピーカーアイコン、44×44px以上）
- **音声機能**: デバイス内蔵TTS（Web Speech API）で韓国語を読み上げ
- **ナビゲーション**: 前後の対話へ移動するボタン

#### ③ クイズモード
- **出題形式**: 日本語を見て、正しい韓国語フレーズを選択肢から選ぶ
- **採点**: 正答率を表示、学習進捗を保存
- **フィードバック**: 正解時は緑、不正解時は赤で表示

#### ④ お気に入り機能
- **保存対象**: 各対話フレーズ
- **表示**: ハート型アイコン（タップで切り替え）
- **永続化**: ブラウザのローカルストレージに保存

#### ⑤ 検索機能
- **検索対象**: 対話フレーズ（日本語・韓国語）
- **表示**: マッチしたフレーズをリスト表示
- **フィルタリング**: シーン別で絞り込み可能

#### ⑥ 法的ページ
- **プライバシーポリシー** (`/privacy`): 個人情報非収集、ローカルデータ保存のみを明記
- **利用規約** (`/terms`): 知的財産権、禁止事項、免責事項、準拠法を記載

---

## 3. データ構造

### 3.1 シーンデータ
```typescript
interface Scene {
  id: string;           // "restaurant", "hotel", "station"
  name: string;         // "飲食店で"
  description: string;  // "注文・会計と食事のシーン"
  icon: string;         // アイコン名またはEmoji
  dialogues: Dialogue[];
}
```

### 3.2 対話データ
```typescript
interface Dialogue {
  id: string;
  sceneId: string;
  japanese: string;     // "何名様ですか？"
  korean: string;       // "몇 분이세요?"
  romanized: string;    // "ミョッ プニセヨ?"
  role: "shop" | "self"; // 話者
  order: number;        // 対話内での順序
}
```

### 3.3 ローカルストレージ構造
```typescript
interface UserData {
  favorites: string[];  // Dialogue IDの配列
  quizScores: {
    [sceneId: string]: {
      correct: number;
      total: number;
    };
  };
  theme: "light" | "dark";
}
```

---

## 4. UI/UX設計

### 4.1 カラーパレット
| 要素 | 色 | 用途 |
|------|-----|------|
| 背景 | #faf8f5 (クリーム) | ページ背景 |
| プライマリ | #22c55e (緑) | CTA、強調、自分の吹き出し |
| セカンダリ | #f3f4f6 (ライトグレー) | 店員の吹き出し、背景 |
| テキスト | #1f2937 (ダークグレー) | 本文 |
| ボーダー | #e5e7eb (薄いグレー) | 区切り線 |

### 4.2 タイポグラフィ
- **見出し**: 24-32px、太字（font-weight: 700）
- **本文**: 16px、標準（font-weight: 400）
- **小文字**: 12-14px、標準（font-weight: 400）
- **フォントファミリー**: システムフォント（-apple-system, BlinkMacSystemFont等）

### 4.3 レスポンシブデザイン
- **モバイルファースト**: 375px以上で設計
- **タブレット**: 768px以上で2カラムレイアウト対応
- **デスクトップ**: 1024px以上で最大幅制限（max-w-4xl）

### 4.4 ボトムナビゲーション
- **固定位置**: 画面下部に常時表示
- **アイテム**: 
  1. シーン（グリッドアイコン）
  2. 検索（虫眼鏡アイコン）
  3. お気に入り（ハートアイコン）
  4. クイズ（本アイコン）
- **safe-area対応**: iPhone等のノッチ・ホームバーに対応

---

## 5. PWA実装

### 5.1 manifest.json
```json
{
  "name": "韓国旅行 実践会話",
  "short_name": "韓国会話",
  "description": "シーン別の対話で学ぶ韓国旅行フレーズ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf8f5",
  "theme_color": "#22c55e",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 5.2 Service Worker
- **キャッシュ戦略**: Network first → Cache fallback
- **キャッシュ対象**: HTML、CSS、JS、画像、フォント
- **オフライン対応**: キャッシュ済みコンテンツはオフラインで表示可能

### 5.3 index.htmlメタタグ
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="true">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="韓国会話">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
```

---

## 6. ネイティブアプリ化（Capacitor）

### 6.1 初期設定
```bash
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/ios @capacitor/android
npx cap init
```

### 6.2 capacitor.config.ts
```typescript
const config: CapacitorConfig = {
  appId: 'com.koreantravel.app',
  appName: '韓国旅行 実践会話',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};
```

### 6.3 ビルドコマンド
```json
{
  "scripts": {
    "build": "vite build",
    "cap:sync": "pnpm build && npx cap sync",
    "cap:open:ios": "npx cap open ios",
    "cap:open:android": "npx cap open android",
    "cap:run:ios": "npx cap run ios",
    "cap:run:android": "npx cap run android"
  }
}
```

---

## 7. ストア申請準備

### 7.1 必須ドキュメント
- ✅ プライバシーポリシー (`/privacy`)
- ✅ 利用規約 (`/terms`)
- ✅ アプリアイコン（192×192, 512×512）
- ✅ スクリーンショット（5-8枚、各プラットフォーム）
- ✅ アプリ説明文（日本語、100-200字）
- ✅ キーワード（5-10個）

### 7.2 App Store申請（iOS）
- **必須**: Apple Developer Program登録（年額¥12,800）
- **ビルド**: Xcodeで `.ipa` ファイルを生成
- **審査期間**: 通常1-3日

### 7.3 Google Play申請（Android）
- **必須**: Google Play Console登録（初回$25）
- **ビルド**: Android Studioで `.aab` ファイルを生成
- **審査期間**: 通常数時間～1日

---

## 8. セキュリティ・プライバシー

### 8.1 データ保護
- ❌ 個人情報は一切収集しない
- ❌ 外部サーバーへのデータ送信なし
- ✅ ローカルストレージのみ使用
- ✅ HTTPS通信（Manus自動対応）

### 8.2 権限管理
- ❌ カメラ・マイクへのアクセス不要
- ❌ 位置情報へのアクセス不要
- ✅ 音声読み上げ（Web Speech API、デバイス内蔵）

---

## 9. 実装手順（推奨順序）

### Phase 1: 基盤構築
1. Vite + React + TypeScript プロジェクト初期化
2. Tailwind CSS 4 設定
3. shadcn/ui コンポーネント導入
4. ルーティング（Wouter）設定

### Phase 2: コア機能
5. シーンデータの定義・管理
6. シーン選択画面の実装
7. 対話学習画面の実装
8. 音声再生機能（Web Speech API）

### Phase 3: 追加機能
9. クイズモード実装
10. お気に入り機能（ローカルストレージ）
11. 検索機能
12. ボトムナビゲーション

### Phase 4: PWA・ネイティブ化
13. Service Worker実装
14. manifest.json作成
15. Capacitor導入
16. iOS/Androidプロジェクト生成

### Phase 5: 法的・デプロイ
17. プライバシーポリシー・利用規約ページ
18. ビルド・最適化
19. ストア申請準備
20. 本番デプロイ

---

## 10. 推奨される拡張機能（将来）

1. **学習進捗トラッキング**: 各シーンの習得率をグラフ表示
2. **スピーキング練習**: ユーザーの音声入力と比較
3. **フレーズ追加機能**: ユーザーが独自フレーズを登録
4. **オンライン同期**: クラウドバックアップ（プライバシー配慮）
5. **多言語対応**: 英語・中国語等への拡張
6. **ゲーミフィケーション**: バッジ・ランキング・ストリーク

---

## 11. 制作に使用するプロンプト例

### 初回プロンプト
```
韓国旅行で使える会話フレーズを学習するPWAアプリを制作してください。

【要件】
- React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- シーン別の対話学習（飲食店、ホテル、駅等）
- 音声読み上げ機能（Web Speech API）
- クイズモード、お気に入り機能、検索機能
- ボトムナビゲーション（4タブ）
- PWA対応（Service Worker + manifest.json）
- Capacitor対応（iOS/Android）
- プライバシーポリシー・利用規約ページ
- モバイルファースト、safe-area対応

【カラーパレット】
- 背景: #faf8f5
- プライマリ: #22c55e
- テキスト: #1f2937

【データ】
対話データはアプリ内に静的に定義してください。
```

### フェーズ別プロンプト例
```
【Phase 2: コア機能】
シーン選択画面と対話学習画面を実装してください。

【シーン選択画面】
- グリッド表示（2-3列）
- 各シーン: アイコン + 名前 + 説明
- タップで対話学習画面へ遷移

【対話学習画面】
- 店員（左、グレー）と自分（右、緑）の吹き出し
- 日本語 → 韓国語 → ローマ字の順で表示
- 音声再生ボタン（Web Speech API使用）
- 前後ボタンでナビゲーション

【データ】
以下のシーンを含めてください:
- 飲食店で（注文・会計・食事）
- ホテルで（チェックイン・ルームサービス）
- 駅で（チケット購入・乗車）
- 観光地で（道案内・写真撮影）
- 緊急時（病院・警察・トラブル）
```

---

## 12. ファイル構成

```
korean_travel_learning/
├── client/
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Privacy.tsx
│   │   │   ├── Terms.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── SceneNav.tsx
│   │   │   ├── QuizMode.tsx
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   └── useDialogueData.ts
│   │   ├── lib/
│   │   │   ├── dialogueData.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── android/
├── ios/
├── capacitor.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── NATIVE_APP_GUIDE.md
└── README.md
```

---

## 13. 注意事項

### セキュリティ
- ❌ APIキーをクライアント側に埋め込まない
- ❌ 個人情報を外部に送信しない
- ✅ HTTPS通信を使用（Manus自動対応）

### パフォーマンス
- ✅ Service Workerでオフラインキャッシュ
- ✅ 画像は最適化（WebP形式推奨）
- ✅ バンドルサイズを最小化（tree-shaking）

### ストア申請
- ✅ プライバシーポリシー・利用規約は必須
- ✅ アプリアイコンは高品質（1024×1024以上）
- ✅ スクリーンショットは実際の動作画面を使用
- ❌ 虚偽の説明・フェイクレビューは禁止

---

## 14. 参考リソース

- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **Capacitor**: https://capacitorjs.com
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **PWA**: https://web.dev/progressive-web-apps/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies**: https://play.google.com/about/developer-content-policy/

---

**作成日**: 2026年6月25日  
**バージョン**: 1.0
