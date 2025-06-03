# Vercelデプロイ手順

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

### 依存関係のインストール

```bash
npm install
```

### TypeScript型チェック (optional)

```bash
npx tsc --noEmit
```

## 3. デプロイ

### 初回デプロイ

```bash
vercel
```

以下の質問に答えてください：

- "Set up and deploy"? → `Y`
- "Which scope"? → 自分のアカウントを選択
- "Link to existing project"? → `N` (新規の場合)
- "What's your project's name"? → `skytools` (または任意の名前)
- "In which directory is your code located"? → `./` (現在のディレクトリ)

### 本番環境デプロイ

```bash
vercel --prod
```

## 4. 設定確認

デプロイ後、以下のURLでAPIが利用可能になります：

### Routes

```
https://your-project.vercel.app/routes/getrepocar?repo=did:plc:example
```

### API Functions

```
https://your-project.vercel.app/api/resolver?query=example.bsky.social
https://your-project.vercel.app/api/handle-resolve?query=example.bsky.social
https://your-project.vercel.app/api/resolver-functions?actor=example.bsky.social
https://your-project.vercel.app/api/resolve-handle?handle=example.bsky.social
```

## 5. 環境変数の設定 (必要に応じて)

Vercel Dashboard → Settings → Environment Variables で設定できます。

## 6. コード構造

```
app/server/
├── api/                    # API Functions
│   ├── resolver-functions.ts
│   ├── handle-resolve.ts
│   ├── resolver.ts
│   └── resolve-handle.ts
└── routes/                 # Route Functions  
    └── getrepocar.ts
```

## 7. トラブルシューティング

### よくあるエラー

1. **Module not found**:
    - `npm install`を再実行
    - `package.json`の依存関係を確認

2. **TypeScript errors**:
    - `npx tsc --noEmit`で型エラーを確認
    - `tsconfig.json`の設定を確認

3. **API endpoint not working**:
    - `vercel.json`の設定を確認
    - ファイルパスが正しいか確認 (`app/server/api/*.ts` と `app/server/routes/*.ts`)

4. **DNS resolution errors**:
    - Vercel Functionsはnode:dnsをサポートしているため、これらのエラーは発生しないはずです
    - ログを確認して具体的なエラー内容を確認

### ログの確認

```bash
vercel logs
```

### ローカルでのテスト

```bash
vercel dev
```

## 8. 元のコードからの変更点

- H3フレームワークからVercel Functions形式に変更
- `defineEventHandler`を`export default async function handler`に変更
- `getQuery(event)`を`req.query`に変更
- `createError`/`sendError`をシンプルな`res.status().json()`に変更
- すべてのファイルに`@vercel/node`の型定義を追加
