#!/bin/bash

echo "🔍 Vercelデプロイ前のチェックを実行中..."

# TypeScript型チェック
#echo "📝 TypeScript型チェック..."
#if npx tsc --noEmit; then
#    echo "✅ TypeScript型チェック: 成功"
#else
#    echo "❌ TypeScript型チェック: 失敗"
#    exit 1
#fi

# 必須ファイルの存在確認
echo "📁 必須ファイルの確認..."
files=("vercel.json" "package.json" "tsconfig.json")
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

echo ""
echo "🎉 すべてのチェックが完了しました！"
echo "👉 次のコマンドでデプロイできます："
echo "   vercel"
echo "   または"
echo "   vercel --prod"
