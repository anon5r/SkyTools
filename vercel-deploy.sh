#!/bin/bash

echo "🚀 Nuxt + Vercel Functions デプロイを開始します..."

# pnpmの確認
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpmがインストールされていません"
    echo "👉 以下のコマンドでインストールしてください："
    echo "   npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm: $(pnpm --version)"

# 必須ファイルの存在確認
echo "📁 必須ファイルの確認..."
files=("vercel.json" "app/package.json" "app/nuxt.config.ts")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: 存在"
    else
        echo "❌ $file: 見つかりません"
        exit 1
    fi
done

# Vercel Functions用ファイルの確認
echo "🔌 Vercel Functions用ファイルの確認..."
api_files=(
    "app/server/api/resolver-functions.ts"
    "app/server/api/handle-resolve.ts" 
    "app/server/api/resolver.ts"
    "app/server/api/resolve-handle.ts"
    "app/server/routes/getrepocar.ts"
)

all_exist=true
for file in "${api_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file: 存在"
    else
        echo "❌ $file: 見つかりません"
        all_exist=false
    fi
done

if [ "$all_exist" = false ]; then
    echo "❌ 一部のAPIファイルが見つかりません"
    exit 1
fi


# Nuxtアプリの主要ファイル確認
echo "🎨 Nuxtアプリの確認..."
nuxt_files=("app/pages" "app/components" "app/layouts")
for dir in "${nuxt_files[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/: 存在"
    else
        echo "⚠️ $dir/: 見つかりません（オプショナル）"
    fi
done

# 依存関係のインストール確認
echo "📦 依存関係の確認..."
if [ ! -d "app/node_modules" ]; then
    echo "📥 依存関係をインストール中..."
    cd app && pnpm install
    cd ..
else
    echo "✅ app/node_modules: 存在"
fi

echo ""
echo "✅ ファイル確認完了！"
echo ""
echo "📦 Vercelデプロイを実行中..."
echo "   - Package Manager: pnpm"
echo "   - Root Directory: app/"
echo "   - Nuxtアプリ: app/ -> Vercel Static + SSR"
echo "   - API Functions: app/server/ -> Vercel Functions"
echo ""

# Vercelデプロイの実行
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "❌ Vercel CLIがインストールされていません"
    echo "👉 以下のコマンドでインストールしてください："
    echo "   npm install -g vercel"
    exit 1
fi
