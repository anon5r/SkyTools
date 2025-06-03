# SkyTools - Nuxt + Vercel Functions

Nuxtアプリと、AT ProtocolのVercel Functionsを組み合わせたプロジェクトです。

## 構成

- **Nuxtアプリ** (`/app/`): Bluesky向けWebアプリケーション
- **Vercel Functions** (`/app/server/`): AT ProtocolのDNS解決APIエンドポイント

## 機能

### Nuxtアプリ (`/app/`)

- Bluesky用のWebインターフェース
- プロフィール表示、投稿閲覧など

### Vercel Functions (`/app/server/`)

#### Routes (`/routes/`)
- `getrepocar`: BlueskyユーザーのリポジトリデータをCARファイル形式でダウンロード

#### API Functions (`/api/`)
- `resolver-functions`: DIDとハンドルの相互解決
- `handle-resolve`: ハンドル/DIDの解決
- `resolver`: 高度なタイムアウト機能付きリゾルバー
- `resolve-handle`: ハンドルからDIDへの解決

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm 8以上 (`npm install -g pnpm`)
- Vercel CLI (`npm install -g vercel`)

### インストール

```bash
# Nuxtアプリの依存関係をインストール
cd app && pnpm install
```

### 開発環境の起動

```bash
# Nuxtアプリの開発サーバー
cd app && pnpm run dev

# Vercel Functions（ローカル開発）
vercel dev
```

### デプロイ

```bash
# 自動デプロイスクリプト
chmod +x vercel-deploy.sh && ./vercel-deploy.sh

# または手動デプロイ
vercel --prod
```

## デプロイ後のエンドポイント

### Nuxtアプリ
```
https://your-project.vercel.app/          # メインアプリ
https://your-project.vercel.app/profile   # プロフィールページ
https://your-project.vercel.app/about     # Aboutページ
```

### Vercel Functions

#### Routes
```
https://your-project.vercel.app/routes/getrepocar?repo=did:plc:example
```

#### API Functions
```
https://your-project.vercel.app/api/resolver?query=example.bsky.social
https://your-project.vercel.app/api/handle-resolve?query=example.bsky.social
https://your-project.vercel.app/api/resolver-functions?actor=example.bsky.social
https://your-project.vercel.app/api/resolve-handle?handle=example.bsky.social
```

## 技術スタック

### Nuxtアプリ

- **Framework**: Nuxt 3
- **UI**: Vue 3 + Tailwind CSS + Flowbite
- **Icons**: FontAwesome Pro
- **State**: Pinia (Nuxt内蔵)

### Vercel Functions

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Libraries**: AT Protocol (@atproto/*)、Luxon

## アーキテクチャ

```
skytools/
├── app/                          # Nuxtアプリ
│   ├── pages/                    # Nuxtページ
│   ├── components/               # Vueコンポーネント
│   ├── server/                   # Vercel Functions
│   │   ├── api/                  # API Functions
│   │   └── routes/               # Route Functions
│   ├── nuxt.config.ts           # Nuxt設定
│   └── package.json             # Nuxtアプリの依存関係
├── vercel.json                  # Vercel設定
└── package.json                 # プロジェクトルート設定
```

## 開発の注意事項

1. **DNS解決**: `node:dns`を使用するため、Cloudflare Workersでは動作しません
2. **ビルド**: NuxtアプリとVercel Functionsは独立してビルドされます
3. **依存関係**: AT Protocol関連の依存関係は`/app/package.json`に含まれています

## 移行履歴

このプロジェクトは**Cloudflare Workers + Pages**から**Vercel Functions + Static**に移行されました。

### 移行理由

- `node:dns`モジュールの制限によりCloudflare WorkersでAT ProtocolのDNS解決が不可能
- Vercel FunctionsではNode.js標準ライブラリが完全サポート

### 移行による変更

- ✅ DNS解決機能の完全動作
- ✅ 統合されたデプロイメント
- ✅ シンプルな依存関係管理
- ❌ Cloudflare Workers固有の機能は使用不可

### 削除されたファイル

```bash
# クリーンアップスクリプトで削除可能
chmod +x cleanup-server.sh && ./cleanup-server.sh
```

## トラブルシューティング

### デプロイエラー

1. Vercel CLIがインストールされているか確認
2. `/app/package.json`に必要な依存関係が含まれているか確認
3. `vercel.json`の設定が正しいか確認

### ローカル開発エラー

1. `cd app && pnpm install`で依存関係をインストール
2. `vercel dev`でローカルサーバーを起動
3. `http://localhost:3000`でアクセス

### 不要ファイルのクリーンアップ

```bash
# app/server内の不要ファイルを削除
chmod +x cleanup-server.sh && ./cleanup-server.sh
```
