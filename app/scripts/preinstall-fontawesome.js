#!/usr/bin/env node

/**
 * FontAwesome Pro/Free preinstall スクリプト
 *
 * FONTAWESOME_NPM_AUTH_TOKEN が設定されている場合のみ、
 * .npmrc に認証トークンを設定します。
 */

const fs = require('fs')
const path = require('path')

const hasToken = !!process.env.FONTAWESOME_NPM_AUTH_TOKEN
const authToken = process.env.FONTAWESOME_NPM_AUTH_TOKEN || ''
const npmrcPath = path.join(__dirname, '..', '.npmrc')

if (!hasToken) {
  console.log('')
  console.log('ℹ️  FONTAWESOME_NPM_AUTH_TOKEN is not set.')
  console.log('   Pro packages will be skipped (optionalDependencies).')
  console.log('   Using FontAwesome Free version.')
  console.log('')

  // Remove auth token from .npmrc if exists
  let npmrcContent = fs.readFileSync(npmrcPath, 'utf8')
  if (npmrcContent.includes('//npm.fontawesome.com/:_authToken=')) {
    npmrcContent = npmrcContent.replace(/\/\/npm\.fontawesome\.com\/:_authToken=.*\n?/g, '')
    fs.writeFileSync(npmrcPath, npmrcContent)
  }
} else {
  console.log('')
  console.log('✓ FONTAWESOME_NPM_AUTH_TOKEN is set.')
  console.log('  Configuring FontAwesome Pro authentication...')

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

  console.log('  Pro packages will be installed.')
  console.log('')
}
