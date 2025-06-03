# SkyTools App - Nuxt + Vercel Functions

このディレクトリには、VercelにデプロイされるSkyToolsアプリが含まれています。

## 構成

- **Nuxtアプリ**: メインのWebアプリケーション
- **Vercel Functions**: `/server` ディレクトリ内のAPIエンドポイント

## セットアップ

依存関係をインストール:

```bash
pnpm install
```

## 環境変数

| 変数名                  | 説明                    | デフォルト値                              |
|----------------------|-----------------------|-------------------------------------|
| GTM_ID               | Google Tag Manager ID | GTM-XXXXXXX                         |
| CLOUDFLARE_TOKEN     | Cloudflare APIトークン    |                                     |
| DEFAULT_PDS          | デフォルトPDS              | `bsky.social`                       |
| DEFAULT_PDS_ENDPOINT | PDS API URL           | https://bsky.social                 |
| DEFAULT_APP_URL      | アプリのフロントエンドURL        | https://bsky.app                    |
| WEBMASTER_DID        | 管理者DID                | `did:plc:c22jdrqhoajyj5ca7e56a3ke`  |
| CDN_PREFIX           | 画像プロキシURL             | https://cdn.bluesky.social/imgproxy |
| OGP_PREFIX           | OGP用URLプレフィックス        | https://your-app.vercel.app         |
| NODE_ENV             | 実行環境                  | production                          |

## 開発

### 開発サーバー

`http://localhost:3000`で開発サーバーを起動:

```bash
# Nuxt開発サーバー
pnpm dev

# Vercel Functions付きローカル開発
vercel dev
```

### デバッグ

1. **Vue DevTools**: Vue DevToolsブラウザ拡張機能
2. **ブラウザDevTools**: ブラウザの開発者ツール
3. **Console Logging**: `console.log()`でのロギング
4. **Nuxt DevTools**: `nuxt.config.ts`で`devtools: { enabled: true }`

## デプロイ

### Vercelへのデプロイ

プロジェクトルートから実行:

```bash
# 自動デプロイスクリプト
./vercel-deploy.sh

# 手動デプロイ
vercel --prod
```

### ローカルプレビュー

```bash
# 本番ビルドのプレビュー
pnpm build
pnpm preview

# Vercel Functionsと一緒にプレビュー
vercel dev
```

## プロジェクト構造

```
app/
├── nuxt.config.ts          # Nuxt設定（preset: vercel）
├── package.json            # 依存関係
├── components/             # Vueコンポーネント
├── composables/            # Vue Composables
├── layouts/                # レイアウト
├── pages/                  # ページ
├── plugins/                # プラグイン
├── server/                 # Vercel Functions
│   ├── api/               # API Functions
│   └── routes/            # Route Functions
├── public/                # 静的ファイル
├── assets/                # アセット
└── utils/                 # ユーティリティ
```

## API エンドポイント

### Vercel Functions

#### API Functions (`/api/`)

- `/api/resolver` - DID/ハンドル解決
- `/api/handle-resolve` - ハンドル解決
- `/api/resolver-functions` - DID/ハンドル相互解決
- `/api/resolve-handle` - ハンドルからDID解決

#### Route Functions (`/routes/`)

- `/routes/getrepocar` - リポジトリCARファイルダウンロード

## 技術スタック

- **フレームワーク**: Nuxt 3
- **ランタイム**: Vercel Functions (Node.js 20)
- **UI**: Vue 3 + Tailwind CSS + Flowbite
- **アイコン**: FontAwesome Pro
- **状態管理**: Pinia (Nuxt内蔵)
- **API**: AT Protocol (@atproto/*)

## 移行情報

このプロジェクトは以前Cloudflare Pages + Workersで動作していましたが、
`node:dns`の制限によりVercel Functionsに移行されました。

### 削除された機能

- Cloudflare Workers (`worker.ts`)
- Cloudflare Pages Functions (`functions/`)
- Wrangler設定 (`wrangler.toml`)

### 新機能

- Vercel Functions (`server/`)
- DNS解決機能の完全サポート
- Node.js標準ライブラリの利用

詳細については、プロジェクトルートの[README.md](../README.md)をご覧ください。
