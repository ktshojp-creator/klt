interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
  };
}

const config: CapacitorConfig = {
  appId: 'com.koreantravel.app',
  appName: '韓国旅行 これだけ！会話集',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
