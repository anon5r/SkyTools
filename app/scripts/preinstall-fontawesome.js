#!/usr/bin/env node

/**
 * FontAwesome Pro/Free preinstall スクリプト
 *
 * FONTAWESOME_NPM_AUTH_TOKEN が設定されている場合のみ、
 * .yarnrc.yml と .npmrc に認証設定を追加します。
 */

const fs = require('fs')
const path = require('path')

const hasToken = !!process.env.FONTAWESOME_NPM_AUTH_TOKEN
const authToken = process.env.FONTAWESOME_NPM_AUTH_TOKEN || ''
const yarnrcPath = path.join(__dirname, '..', '.yarnrc.yml')
const npmrcPath = path.join(__dirname, '..', '.npmrc')

if (!hasToken) {
  console.log('')
  console.log('ℹ️  FONTAWESOME_NPM_AUTH_TOKEN is not set.')
  console.log('   Using FontAwesome Free version only.')
  console.log('')
} else {
  console.log('')
  console.log('✓ FONTAWESOME_NPM_AUTH_TOKEN is set.')
  console.log('  Configuring FontAwesome Pro (Kit)...')

  // Add @awesome.me scope to .yarnrc.yml
  let yarnrcContent = fs.readFileSync(yarnrcPath, 'utf8')
  if (!yarnrcContent.includes('npmScopes:')) {
    yarnrcContent += `npmScopes:\n  awesome.me:\n    npmRegistryServer: "https://npm.fontawesome.com/"\n`
    fs.writeFileSync(yarnrcPath, yarnrcContent)
    console.log('  - Added @awesome.me scope to .yarnrc.yml')
  }

  // Add auth token to .npmrc
  let npmrcContent = fs.readFileSync(npmrcPath, 'utf8')
  if (!npmrcContent.includes('//npm.fontawesome.com/:_authToken=')) {
    if (!npmrcContent.endsWith('\n')) {
      npmrcContent += '\n'
    }
    npmrcContent += `//npm.fontawesome.com/:_authToken=${authToken}\n`
    fs.writeFileSync(npmrcPath, npmrcContent)
    console.log('  - Added auth token to .npmrc')
  }

  console.log('  Pro Kit will be installed.')
  console.log('')
}
