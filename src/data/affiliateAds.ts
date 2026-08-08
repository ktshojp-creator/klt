// A8.net アフィリエイト広告設定ファイル
// A8.netで取得したアフィリエイトコード（HTMLタグ）または追跡リンクURLをこちらに貼り付けるだけで反映されます。

export interface AffiliateAd {
  id: string;
  // A8.netから取得した「素材（HTMLコード）」をそのまま貼る場合は htmlCode に設定してください
  htmlCode?: string;

  // バナーの上に表示する1行キャッチコピー
  catchphrase?: string;

  // カード型デザイン（アプリの見た目に合わせる場合）で指定したい場合の項目
  title?: string;
  description?: string;
  ctaText?: string;
  linkUrl?: string; // A8.netのテキストリンクURL (https://px.a8.net/svt/ejp?a8mat=...)
  imageUrl?: string; // バナー画像のURL
  impressionTrackUrl?: string; // 1x1インプレッション追跡画像のURL (https://www11.a8.net/0.gif?a8mat=...)
}

export const INFEED_ADS: Record<string, AffiliateAd> = {
  // グルメシーン用のインフィード広告 (A8.net バナーHTMLタグ使用)
  gourmet: {
    id: 'gourmet',
    catchphrase: '【安定性抜群】安いけれど品質も安心！',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4B9YLG+2P1PXE+5TBA+5YZ75" rel="nofollow" target="_blank">
<img border="0" width="300" height="250" alt="" src="https://www22.a8.net/svt/bgt?aid=260805220163&wid=003&eno=01&mid=s00000027127001003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4B9YLG+2P1PXE+5TBA+5YZ75" alt="">`,
  },

  // 美容シーン用のインフィード広告 (A8.net バナーHTMLタグ使用)
  beauty: {
    id: 'beauty',
    catchphrase: '【USB充電機能も】機内持ち込み対応～大容量モデルまで',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4B9YLG+2Q8L4Y+5VYU+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www23.a8.net/svt/bgt?aid=260805220165&wid=003&eno=01&mid=s00000027471001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B9YLG+2Q8L4Y+5VYU+5ZMCH" alt="">`,
  },

  // クイズページ用インフィード広告 1 (A8.net バナーHTMLタグ使用)
  quiz1: {
    id: 'quiz1',
    catchphrase: 'たまにしか使わない…スーツケースはレンタルで！',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4B9YLG+2XDSEA+3J30+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www21.a8.net/svt/bgt?aid=260805220177&wid=003&eno=01&mid=s00000016470001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B9YLG+2XDSEA+3J30+5ZMCH" alt="">`,
  },

  // クイズページ用インフィード広告 2 (A8.net バナーHTMLタグ使用)
  quiz2: {
    id: 'quiz2',
    catchphrase: '【よりお得に】現地ツアーやアクティビティならここ！',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4BA0XB+45FV5U+52F8+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=260808239251&wid=003&eno=01&mid=s00000023642001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4BA0XB+45FV5U+52F8+5ZMCH" alt="">`,
  },

  // クイズページ用インフィード広告 3 (A8.net バナーHTMLタグ使用)
  quiz3: {
    id: 'quiz3',
    catchphrase: '【もう迷わない】最新情報を検索しながらの旅行にも安心',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4B9YLG+2VLHKY+5L2C+5YZ75" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www21.a8.net/svt/bgt?aid=260805220174&wid=003&eno=01&mid=s00000026058001003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=4B9YLG+2VLHKY+5L2C+5YZ75" alt="">`,
  },

  // クイズページ用インフィード広告 4 (A8.net バナーHTMLタグ使用)
  quiz4: {
    id: 'quiz4',
    catchphrase: '【時間も節約】日本語対応の厳選エステ＆体験予約',
    htmlCode: `<a href="https://px.a8.net/svt/ejp?a8mat=4B9YLG+2XZ802+4X1W+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www26.a8.net/svt/bgt?aid=260805220178&wid=003&eno=01&mid=s00000022946001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B9YLG+2XZ802+4X1W+5ZMCH" alt="">`,
  },
};

