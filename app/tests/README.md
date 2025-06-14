# SkyTools Tests

This directory contains tests for the SkyTools application. The tests are organized into three categories:

1. **Unit Tests**: Tests for individual functions and components in isolation.
2. **Integration Tests**: Tests for components and their interactions with other components.
3. **End-to-End Tests**: Tests for the application as a whole, simulating user interactions.

## Prerequisites

Before running the tests, make sure you have installed all the dependencies:

```bash
cd app
pnpm install
```

## Running Tests

### Unit Tests

Unit tests are located in the `unit` directory and test individual functions and components in isolation. To run the
unit tests:

```bash
cd app
pnpm test
```

To run the unit tests in watch mode (tests will automatically re-run when files change):

```bash
cd app
pnpm test:watch
```

To run the unit tests with coverage:

```bash
cd app
pnpm test:coverage
```

### Integration Tests

Integration tests are located in the `integration` directory and test components and their interactions with other
components. To run the integration tests:

```bash
cd app
pnpm test
```

### End-to-End Tests

End-to-end tests are located in the `e2e` directory and test the application as a whole, simulating user interactions.

Before running the end-to-end tests, make sure you have installed the Playwright browsers:

```bash
cd app
pnpm playwright install
```

To run the end-to-end tests:

```bash
cd app
pnpm test:e2e
```

To run the end-to-end tests with the Playwright UI:

```bash
cd app
pnpm test:e2e:ui
```

## Test Structure

### Unit Tests

Unit tests are organized by the type of code they test:

- `unit/utils`: Tests for utility functions
- `unit/components`: Tests for individual components

### Integration Tests

Integration tests are organized by the type of code they test:

- `integration/components`: Tests for components and their interactions with other components
- `integration/pages`: Tests for pages and their interactions with components

### End-to-End Tests

End-to-end tests are organized by the feature they test:

- `e2e/home.spec.ts`: Tests for the home page and navigation
- `e2e/deployment.spec.ts`: Tests for the deployment process

## Writing Tests

### Unit Tests

Unit tests should test individual functions and components in isolation. They should not depend on external services or
other components. Use mocks and stubs to isolate the code being tested.

Example:

```typescript
import { describe, it, expect } from 'vitest'
import { formatIdentifier } from '@/utils/bskyutils'

describe('formatIdentifier', () => {
  it('should remove at:// prefix', () => {
    expect(formatIdentifier('at://user')).toBe('user.bsky.social')
  })
})
```

### Integration Tests

Integration tests should test components and their interactions with other components. They should not depend on
external services. Use mocks and stubs to isolate the code being tested.

Example:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CopyToClipboard from '@/components/CopyToClipboard.vue'

describe('CopyToClipboard', () => {
  it('copies text to clipboard when button is clicked', async () => {
    const mockClipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    }

    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    })

    const wrapper = mount(CopyToClipboard, {
      props: {
        copyText: 'Test text',
      },
    })

    await wrapper.find('button').trigger('click')

    expect(mockClipboard.writeText).toHaveBeenCalledWith('Test text')
  })
})
```

### End-to-End Tests

End-to-end tests should test the application as a whole, simulating user interactions. They should test the application
in a way that is as close as possible to how a user would interact with it.

Example:

```typescript
import { test, expect } from '@playwright/test'

test('should navigate to Profile page when clicking on Profile viewer card', async ({ page }) => {
  await page.goto('/')
  await page.locator('.feature-card').nth(0).click()
  await expect(page).toHaveURL('/profile')
})
```

## Continuous Integration

The tests are run automatically on each push to the repository using GitHub Actions. The workflow is defined in the
`.github/workflows/test.yml` file.
