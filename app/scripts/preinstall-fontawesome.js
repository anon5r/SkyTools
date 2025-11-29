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

  // Ensure no Pro-related auth config exists
  let yarnrcContent = fs.readFileSync(yarnrcPath, 'utf8')
  if (yarnrcContent.includes('  fortawesome:')) {
    yarnrcContent = yarnrcContent.replace(/  fortawesome:\s*\n(\s{4}.*\n)*/g, '')
    fs.writeFileSync(yarnrcPath, yarnrcContent)
  }

  let npmrcContent = fs.readFileSync(npmrcPath, 'utf8')
  if (npmrcContent.includes('//npm.fontawesome.com/:_authToken=')) {
    npmrcContent = npmrcContent.replace(/\/\/npm\.fontawesome\.com\/:_authToken=.*\n?/g, '')
    fs.writeFileSync(npmrcPath, npmrcContent)
  }
} else {
  console.log('')
  console.log('✓ FONTAWESOME_NPM_AUTH_TOKEN is set.')
  console.log('  Configuring FontAwesome Pro...')

  // Add @fortawesome scope to .yarnrc.yml
  let yarnrcContent = fs.readFileSync(yarnrcPath, 'utf8')
  if (!yarnrcContent.includes('  fortawesome:')) {
    const fortawesomeScope = `  fortawesome:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.fontawesome.com/"
`
    // Insert after awesome.me scope
    yarnrcContent = yarnrcContent.replace(
      /(  awesome\.me:[\s\S]*?npmRegistryServer: "[^"]+"\n)/,
      `$1${fortawesomeScope}`
    )
    fs.writeFileSync(yarnrcPath, yarnrcContent)
    console.log('  - Added @fortawesome scope to .yarnrc.yml')
  }

  // Add auth token to .npmrc
  let npmrcContent = fs.readFileSync(npmrcPath, 'utf8')
  if (!npmrcContent.includes('//npm.fontawesome.com/:_authToken=')) {
    // Ensure newline before adding token
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
