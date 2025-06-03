# SkyTools API

AT Protocolを使用したバックエンドAPIをVercel Functionsで実行します。

## 機能

### Routes (`/routes/`)

- `getrepocar`: BlueskyユーザーのリポジトリデータをCARファイル形式でダウンロード

### API Functions (`/api/`)

- `resolver-functions`: DIDとハンドルの相互解決
- `handle-resolve`: ハンドル/DIDの解決
- `resolver`: 高度なタイムアウト機能付きリゾルバー
- `resolve-handle`: ハンドルからDIDへの解決

## セットアップ

### 前提条件

- Node.js 18以上
- Vercel CLI (`npm i -g vercel`)

### インストール

```bash
npm install
```

### 開発環境の起動

```bash
npm run dev
```

### デプロイ

```bash
vercel
```

## API エンドポイント

### Routes

#### GET /routes/getrepocar

BlueskyユーザーのリポジトリデータをCARファイル形式でダウンロードします。

**パラメータ:**

- `repo` (string): ユーザーのDID (例: `did:plc:xxx`)

**例:**

```
GET /routes/getrepocar?repo=did:plc:example123
```

### API Functions

#### GET /api/resolver-functions

DIDまたはハンドルを解決します。

**パラメータ:**

- `actor` (string): DIDまたはハンドル

**例:**

```
GET /api/resolver-functions?actor=example.bsky.social
GET /api/resolver-functions?actor=did:plc:example123
```

#### GET /api/handle-resolve

ハンドルまたはDIDを解決します。

**パラメータ:**

- `query` (string): ハンドルまたはDID

**例:**

```
GET /api/handle-resolve?query=example.bsky.social
```

#### GET /api/resolver

高度なタイムアウト機能付きでDIDとハンドルを相互解決します。

**パラメータ:**

- `query` (string): ハンドルまたはDID

**例:**

```
GET /api/resolver?query=example.bsky.social
```

#### GET /api/resolve-handle

ハンドルからDIDを解決します。

**パラメータ:**

- `handle` (string): ハンドル

**例:**

```
GET /api/resolve-handle?handle=example.bsky.social
```

## 技術スタック

- TypeScript
- Vercel Functions
- AT Protocol (@atproto/*)
- Luxon (日付処理)

## 注意事項

このAPIは`node:dns`を内部的に使用するため、Cloudflare Workersでは動作しません。Vercel Functionsで実行してください。

## 元のコード構造

このプロジェクトは元々Cloudflare Workers + H3フレームワークで構築されていましたが、DNS解決の制限によりVercel
Functionsに移行されました。
