#!/bin/bash

echo "🚀 Vercelにデプロイを開始します..."

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# TypeScriptの型チェック
echo "🔍 TypeScriptの型チェック中..."
npx tsc --noEmit

# Vercelへのデプロイ
echo "🌐 Vercelにデプロイ中..."
vercel --prod

echo "✅ デプロイ完了！"
