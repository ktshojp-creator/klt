# 韓国旅行 実践会話 - ネイティブアプリ化ガイド (Capacitor)

本プロジェクトは、**Capacitor** を用いて iOS (Xcode) および Android (Android Studio) のネイティブアプリとしてビルド・パッケージングできるように設計・構成されています。

以下は、ご自身のローカル開発環境でネイティブアプリをビルドし、実機またはシミュレータで動かすための手順です。

---

## 1. 開発前提条件

ネイティブアプリのビルドには、各プラットフォーム対応の統合開発環境（IDE）が必要です：

- **iOS アプリをビルドする場合**:
  - macOS 搭載の Mac デバイス
  - **Xcode** (App Storeからインストール)
  - CocoaPods (`brew install cocoapods` または `sudo gem install cocoapods`)

- **Android アプリをビルドする場合**:
  - Windows、macOS、または Linux デバイス
  - **Android Studio** (公式ウェブサイトからダウンロード)
  - Android SDK および対応エミュレータ/実機デバイス

---

## 2. 必要なパッケージのインストール

ご自身のローカルPC環境で、プロジェクトのルートディレクトリに移動し、以下のコマンドで必要な依存関係をインストールします。

```bash
# 依存パッケージのインストール
npm install

# Capacitor関連パッケージのインストール
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

---

## 3. Capacitor の初期化と設定

すでにプロジェクトルートに `capacitor.config.ts` が存在することを確認してください。

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.koreantravel.app',
  appName: '韓国旅行 実践会話',
  webDir: 'dist', // Webのビルド成果物ディレクトリ
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

---

## 4. プラットフォームプロジェクトの生成と追加

以下のコマンドを順に実行して、iOS および Android のネイティブプロジェクトフォルダを生成します。

```bash
# 1. まずWebアセットをビルド
npm run build

# 2. Capacitorを初期化 (未初期化の場合のみ)
npx cap init

# 3. iOSプロジェクトを追加
npx cap add ios

# 4. Androidプロジェクトを追加
npx cap add android
```

実行後、プロジェクトルートに `/ios` および `/android` フォルダが作成されます。

---

## 5. Web ビルドとネイティブ同期の実行サイクル

Web側（React/TypeScript/Vite）でコードを変更するたびに、Webビルドを行い、その成果物をネイティブプラットフォームにコピー（同期）する必要があります。

```bash
# Webビルドとネイティブ同期を一括実行
npm run build && npx cap sync
```

---

## 6. 各プラットフォームの IDE でアプリを開いて実行

### 6.1 iOS (Xcode) の場合
以下のコマンドを実行すると、自動的に Xcode が起動し、生成されたプロジェクトが開きます。

```bash
npx cap open ios
```

1. Xcode が開いたら、左上のスキーム（端末選択）からシミュレータ（例: iPhone 15）または接続された実機を選択します。
2. ▶ (Run) ボタンをクリックすると、ビルドが開始され、シミュレータ上で「韓国旅行 実践会話」アプリが起動します。

### 6.2 Android (Android Studio) の場合
以下のコマンドを実行すると、自動的に Android Studio が起動し、生成されたプロジェクトが開きます。

```bash
npx cap open android
```

1. Android Studio がプロジェクト構造を同期（Gradle Sync）するのを待ちます。
2. 上部ツールバーから対象のデバイス（エミュレータまたは実機）を選択します。
3. ▶ (Run) ボタンをクリックすると、ビルドが完了し、デバイス上でアプリが起動します。

---

## 7. ストア申請用の主な設定項目

### iOS (App Store)
- Xcodeの `General` タブ、および `Signing & Capabilities` から、App Store用の開発者アカウント（Apple Developer Program）を登録・設定します。
- `/ios/App/App/Assets.xcassets` 内で、1024x1024px の高解像度アプリアイコンを設定します。

### Android (Google Play)
- Android Studio の `Build` -> `Generate Signed Bundle / APK...` から、本番署名用のキーストアファイルを生成し、`.aab` 形式でリリースビルドを出力します。
- `/android/app/src/main/res` の各 mipmap フォルダに、アプリアイコン画像を設定します。

---

### 🎉 以上で準備完了です！韓国旅行の実践英会話・韓国語会話をアプリとして手元で楽しみましょう！
