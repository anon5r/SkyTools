#!/usr/bin/env node

/**
 * FontAwesome Pro/Free 切り替えチェックスクリプト
 *
 * FONTAWESOME_NPM_AUTH_TOKEN が設定されていない場合、
 * Pro 版パッケージがインストールできないことを警告します。
 */

const hasToken = !!process.env.FONTAWESOME_NPM_AUTH_TOKEN

if (!hasToken) {
  console.log('')
  console.log('⚠️  FONTAWESOME_NPM_AUTH_TOKEN is not set.')
  console.log('   FontAwesome Pro packages will be skipped.')
  console.log('   Using Free version fallback.')
  console.log('')
} else {
  console.log('')
  console.log('✓ FONTAWESOME_NPM_AUTH_TOKEN is set.')
  console.log('  Installing FontAwesome Pro packages.')
  console.log('')
}
