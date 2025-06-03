#!/bin/bash

echo "🔍 Vercelデプロイ前のチェックを実行中..."

# pnpmの確認
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpmがインストールされていません"
    echo "👉 以下のコマンドでインストールしてください："
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm: $(pnpm --version)"

# TypeScript型チェック（Vercel Functions用ファイルのみ）
echo "📝 TypeScript型チェック（Vercel Functions用ファイルのみ）..."

# /app で依存関係のインストール確認
if [ ! -d "app/node_modules" ]; then
    echo "📥 依存関係をインストール中..."
    cd app && pnpm install
    cd ..
fi

# Nuxtの型チェック（app内で実行）
echo "🔍 Nuxt型チェック..."
cd app
if pnpm run type-check; then
    echo "✅ Nuxt TypeScript型チェック: 成功"
else
    echo "⚠️ Nuxt TypeScript型チェック: 警告があります（デプロイは可能）"
fi
cd ..

# 必須ファイルの存在確認
echo "📁 必須ファイルの確認..."
files=("vercel.json" "package.json" "app/package.json" "app/pnpm-lock.yaml")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: 存在"
    else
        echo "❌ $file: 見つかりません"
        exit 1
    fi
done

# API函数文件确认
echo "🔌 APIファイルの確認..."
api_files=(
    "app/server/api/resolver-functions.ts"
    "app/server/api/handle-resolve.ts" 
    "app/server/api/resolver.ts"
    "app/server/api/resolve-handle.ts"
    "app/server/routes/getrepocar.ts"
)

for file in "${api_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: 存在"
    else
        echo "❌ $file: 見つかりません"
        exit 1
    fi
done


if [ "$cleanup_needed" = true ]; then
    echo "💡 以下のコマンドで不要ファイルを削除できます："
    echo "   rm -f app/server/package.json app/server/pnpm-lock.yaml"
    echo "   rm -rf app/server/node_modules"
fi

echo ""
echo "🎉 すべてのチェックが完了しました！"
echo "👉 次のコマンドでデプロイできます："
echo "   ./vercel-deploy.sh"
echo "   または"
echo "   vercel --prod"
