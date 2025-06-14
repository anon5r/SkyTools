import { expect, test } from '@playwright/test'
import { execSync } from 'child_process'

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

test.describe('Home page', () => {
  test('should display the title and feature cards', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')

    // Check if the title is displayed
    await expect(page.locator('div.text-8xl')).toBeVisible()
    await expect(page.locator('div.text-8xl')).toContainText('SkyTools')

    // Check if the subtitle is displayed
    await expect(page.locator('div.text-xl')).toBeVisible()
    await expect(page.locator('div.text-xl')).toContainText(
      'Toolbox for Bluesky'
    )

    // Check if all feature cards are displayed
    const featureCards = page.locator('.feature-card')
    await expect(featureCards).toHaveCount(4)

    // Check if feature card titles are displayed
    await expect(featureCards.nth(0).locator('h2')).toContainText(
      'Profile viewer'
    )
    await expect(featureCards.nth(1).locator('h2')).toContainText(
      'Identity history'
    )
    await expect(featureCards.nth(2).locator('h2')).toContainText(
      'PDS status viewer'
    )
    await expect(featureCards.nth(3).locator('h2')).toContainText('Invite code')

    // Check if the "Invite code" feature is marked as temporarily closed
    await expect(page.locator('.label-maintain')).toContainText(
      'Temporary closed'
    )
  })

  test('should navigate to Profile page when clicking on Profile viewer card', async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto('/')

    // Click on the Profile viewer card
    await page.locator('.feature-card').nth(0).click()

    // Check if we're on the Profile page
    await expect(page).toHaveURL('/profile')
  })

  test('should navigate to History page when clicking on Identity history card', async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto('/')

    // Click on the Identity history card
    await page.locator('.feature-card').nth(1).click()

    // Check if we're on the History page
    await expect(page).toHaveURL('/history')
  })

  test('should navigate to PDS page when clicking on PDS status viewer card', async ({
    page,
  }) => {
    // Navigate to the home page
    await page.goto('/')

    // Click on the PDS status viewer card
    await page.locator('.feature-card').nth(2).click()

    // Check if we're on the PDS page
    await expect(page).toHaveURL('/pds')
  })
})
