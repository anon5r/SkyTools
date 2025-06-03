# Vercel デプロイ手順 (Nuxt + Vercel Functions)

## 概要

このプロジェクトは以下の構成でデプロイされます：

- **Nuxtアプリ** (`/app/`) → Vercel Static + SSR
- **Vercel Functions** (`/app/server/`) → Vercel Functions

## 1. 初期セットアップ

### Vercel CLIのインストール
```bash
npm install -g vercel
```

### Vercelにログイン
```bash
vercel login
```

## 2. プロジェクトの準備

### Nuxtアプリの依存関係をインストール
```bash
cd app && pnpm install
```

### 型チェック（オプション）
```bash
cd app && pnpm run type-check
```

## 3. デプロイ

### 自動デプロイスクリプト（推奨）

```bash
chmod +x vercel-deploy.sh && ./vercel-deploy.sh
```

### 手動デプロイ
```bash
vercel --prod
```

初回デプロイ時の質問:
- "Set up and deploy"? → `Y`
- "Which scope"? → 自分のアカウントを選択
- "Link to existing project"? → `N` (新規の場合)
- "What's your project's name"? → `skytools` (または任意の名前)
- "In which directory is your code located"? → `./` (ルートディレクトリ)

## 4. デプロイ後の確認

### Nuxtアプリ
```
https://your-project.vercel.app/          # メインページ
https://your-project.vercel.app/about     # Aboutページ
https://your-project.vercel.app/profile   # プロフィール機能
```

### Vercel Functions
```
https://your-project.vercel.app/api/resolver?query=bsky.app
https://your-project.vercel.app/routes/getrepocar?repo=did:plc:z72i7hdynmk6r22z27h6tvur
```

## 5. プロジェクト構造

```
skytools/
├── vercel.json                  # Vercel設定（rootDirectory: app）
├── package.json                 # ルートプロジェクト設定（最小限）
└── app/                         # Nuxtアプリルート（VercelのrootDirectory）
    ├── nuxt.config.ts          # Nuxt設定（preset: vercel）
    ├── package.json            # Nuxt + Functions依存関係
    ├── pages/                  # Nuxtページ
    ├── components/             # Vueコンポーネント
    └── server/                 # Vercel Functions
        ├── api/                # API Functions
        │   ├── resolver.ts
        │   ├── handle-resolve.ts
        │   └── ...
        └── routes/             # Route Functions
            └── getrepocar.ts
```

## 6. 設定ファイルの説明

### vercel.json

```json
{
  "buildCommand": "cd app && pnpm run build",
  "outputDirectory": "app/dist",
  "installCommand": "cd app && pnpm install",
  "functions": {
    "app/server/api/*.ts": { "runtime": "nodejs20.x" },
    "app/server/routes/*.ts": { "runtime": "nodejs20.x" }
  }
}
```

### app/nuxt.config.ts

```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'  // Vercel用プリセット
  }
})
```

## 7. 環境変数の設定

Vercel Dashboard → Settings → Environment Variables で以下を設定:

```
GTM_ID=GTM-XXXXXXX
DEFAULT_PDS=bsky.social
CLOUDFLARE_TOKEN=your-token
```

## 8. トラブルシューティング

### よくあるエラー

1. **ビルドエラー: "Module not found"**
   ```bash
   cd app && pnpm install
   ```

2. **Functions エラー: "@vercel/node not found"**
   - `app/package.json`に`@vercel/node`が含まれているか確認

3. **Nuxt プリセットエラー**
   - `app/nuxt.config.ts`で`preset: 'vercel'`が設定されているか確認

4. **API Functions が動作しない**
   - `vercel.json`の`functions`設定を確認
   - ファイルパスが正しいか確認（`app/server/api/*.ts`）

### デバッグ方法

#### ログの確認
```bash
vercel logs
```

#### ローカルでのテスト
```bash
vercel dev
```

#### ビルドのテスト

```bash
cd app && pnpm run build
```

### Functions の個別テスト

各エンドポイントをテスト:

```bash
curl "https://your-project.vercel.app/api/resolver?query=bsky.app"
curl "https://your-project.vercel.app/routes/getrepocar?repo=did:plc:z72i7hdynmk6r22z27h6tvur"
```

## 9. パフォーマンス最適化

### 推奨設定

1. **ISR（Incremental Static Regeneration）**
   ```typescript
   // app/nuxt.config.ts
   routeRules: {
     '/profile/:did': { isr: 3600 },  // 1時間キャッシュ
     '/pds/:hostname': { isr: 3600 }
   }
   ```

2. **Static Generation**
   ```typescript
   routeRules: {
     '/': { prerender: true },
     '/about': { prerender: true }
   }
   ```

## 10. 継続的デプロイ

### GitHub連携

1. Vercel Dashboard → Import Project
2. GitHubリポジトリを選択
3. Root Directory: `./`
4. Build Command: `cd app && npm run build`
5. Output Directory: `app/dist`

### 自動デプロイ

- `main`ブランチへのプッシュで自動デプロイ
- プルリクエストで Preview デプロイ

---

**重要**: このプロジェクトは`node:dns`を使用するため、Cloudflare WorkersやEdge Runtimeでは動作しません。Vercel
Functions（Node.js Runtime）でのみ動作します。
