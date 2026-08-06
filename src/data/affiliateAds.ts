// A8.net アフィリエイト広告設定ファイル
// A8.netで取得したアフィリエイトコード（HTMLタグ）または追跡リンクURLをこちらに貼り付けるだけで反映されます。

export interface AffiliateAd {
  id: string;
  // A8.netから取得した「素材（HTMLコード）」をそのまま貼る場合は htmlCode に設定してください
  htmlCode?: string;

  // カード型デザイン（アプリの見た目に合わせる場合）で指定したい場合の項目
  title?: string;
  description?: string;
  ctaText?: string;
  linkUrl?: string; // A8.netのテキストリンクURL (https://px.a8.net/svt/ejp?a8mat=...)
  imageUrl?: string; // バナー画像のURL
  impressionTrackUrl?: string; // 1x1インプレッション追跡画像のURL (https://www11.a8.net/0.gif?a8mat=...)
}

export const INFEED_ADS: Record<string, AffiliateAd> = {
  // グルメシーン用のインフィード広告
  gourmet: {
    id: 'gourmet',
    title: '【ソウルグルメ】人気焼肉・伝統料理の日本語予約',
    description: '行列必至のサムギョプサルやタッカンマリの名店を現地からスマホ予約！今ならお得なクーポン付き。',
    ctaText: '名店を予約',
    linkUrl: 'https://px.a8.net/svt/ejp?a8mat=YOUR_A8_MAT_ID', // A8.netのリンクURL
    // A8.netからコピーした「広告コード(HTML)」をそのまま使用したい場合は以下のコメントを外して貼り付けてください:
    /*
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=XXXXX" rel="nofollow" target="_blank">
      <img border="0" width="300" height="250" alt="" src="https://www17.a8.net/0.gif?a8mat=XXXXX"></a>
      <img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=XXXXX" alt="">`,
    */
  },

  // 美容シーン用のインフィード広告
  beauty: {
    id: 'beauty',
    title: '【K-Beauty】ソウル話題の美容皮膚科・サロン予約',
    description: '日本語通訳同行で安心の肌管理（ピーリング・ポテンツァ等）。特別割引きクーポン配布中！',
    ctaText: 'サロンを探す',
    linkUrl: 'https://px.a8.net/svt/ejp?a8mat=YOUR_A8_MAT_ID',
  },
};
