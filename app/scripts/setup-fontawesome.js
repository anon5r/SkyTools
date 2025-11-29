#!/usr/bin/env node

/**
 * FontAwesome Pro/Free 情報表示スクリプト
 *
 * インストール後に、どちらのバージョンが使用されているかを表示します。
 */

const fs = require('fs')
const path = require('path')

const hasToken = !!process.env.FONTAWESOME_NPM_AUTH_TOKEN
const nodeModulesPath = path.join(__dirname, '..', 'node_modules')

// Check if Pro packages are installed
const hasProKit = fs.existsSync(path.join(nodeModulesPath, '@awesome.me', 'kit-e7e521035c'))
const hasProLight = fs.existsSync(path.join(nodeModulesPath, '@fortawesome', 'pro-light-svg-icons'))

console.log('')
if (hasProKit || hasProLight) {
  console.log('✓ FontAwesome Pro packages installed successfully.')
  console.log('  Your app will use Pro icons.')
} else if (hasToken) {
  console.log('⚠️  FONTAWESOME_NPM_AUTH_TOKEN is set, but Pro packages failed to install.')
  console.log('  Falling back to Free version.')
} else {
  console.log('ℹ️  Using FontAwesome Free version.')
  console.log('  To use Pro icons, set FONTAWESOME_NPM_AUTH_TOKEN and reinstall.')
}
console.log('')
