import { expect, test } from '@playwright/test'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// Add a cleanup hook to ensure resources are released
test.afterAll(async () => {
  // Force process cleanup
  if (process.platform === 'win32') {
    try {
      execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' })
    } catch (e) {
      // Ignore errors if no processes to kill
    }
  } else {
    try {
      execSync('pkill -f "pnpm dev" || true', { stdio: 'ignore' })
    } catch (e) {
      // Ignore errors if no processes to kill
    }
  }
})

test.describe('Deployment process', () => {
  test('should build the application successfully', async () => {
    // This test runs the build process and checks if it completes successfully
    // and if the expected files are generated

    try {
      // Run the build command
      const buildOutput = execSync('cd ../../ && pnpm build', {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 60000, // 60 seconds timeout
      })

      // Check if the build was successful
      expect(buildOutput).toContain('Nuxt built')

      // Check if the dist directory exists
      const distPath = path.resolve(__dirname, '../../dist')
      expect(fs.existsSync(distPath)).toBe(true)

      // Check if key files exist in the dist directory
      const indexHtmlPath = path.join(distPath, 'index.html')
      expect(fs.existsSync(indexHtmlPath)).toBe(true)

      // Check if the index.html file contains the expected content
      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8')
      expect(indexHtml).toContain('<html')
      expect(indexHtml).toContain('</html>')

      // Check if the _nuxt directory exists
      const nuxtDirPath = path.join(distPath, '_nuxt')
      expect(fs.existsSync(nuxtDirPath)).toBe(true)

      // Check if there are JS files in the _nuxt directory
      const nuxtFiles = fs.readdirSync(nuxtDirPath)
      const jsFiles = nuxtFiles.filter(file => file.endsWith('.js'))
      expect(jsFiles.length).toBeGreaterThan(0)
    } catch (error) {
      console.error('Build process failed:', error)
      throw error
    }
  })

  test('should have correct configuration for Cloudflare Pages', async () => {
    // Check if the necessary configuration files for Cloudflare Pages exist

    // Check if the wrangler.toml file exists (if used)
    const wranglerPath = path.resolve(__dirname, '../../wrangler.toml')
    if (fs.existsSync(wranglerPath)) {
      const wranglerContent = fs.readFileSync(wranglerPath, 'utf8')
      expect(wranglerContent).toContain('[site]')
    }

    // Check if the package.json has the necessary scripts for Cloudflare Pages
    const packageJsonPath = path.resolve(__dirname, '../../package.json')
    expect(fs.existsSync(packageJsonPath)).toBe(true)

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    expect(packageJson.scripts).toHaveProperty('pages:deploy')
    expect(packageJson.scripts['pages:deploy']).toContain(
      'wrangler pages deploy'
    )

    // Check if the build output is compatible with Cloudflare Pages
    const distPath = path.resolve(__dirname, '../../dist')
    expect(fs.existsSync(distPath)).toBe(true)

    // Check if the index.html file exists in the dist directory
    const indexHtmlPath = path.join(distPath, 'index.html')
    expect(fs.existsSync(indexHtmlPath)).toBe(true)
  })
})
