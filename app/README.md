# SkyTools UI

This directory contains the UI part of SkyTools, which is deployed to Cloudflare Pages.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Environment Variables

| Variable              | Description                      | Default value                        |
|-----------------------|----------------------------------|--------------------------------------|
| GTM_ID                | Google Tag Manager               | GA-XXXXXX                            |
| CLOUDFLARE_TOKEN      | Your Cloudflare API Token        |                                      |
| FONTAWESOME_TOKEN     | Your FontAwesome API Token       |                                      |
| DEFAULT_PDS           |                                  | `bsky.social`                        |
| DEFAULT_PDS_SUFFIX    | Auto append suffix               | `bsky.social`                        |
| DEFAULT_PDS_ENDPOINT  | PDS API URL                      | https://bsky.social                  |
| DEFAULT_APP_URL       | Default application frontend URL | https://bsky.app                     |
| WEBMASTER_DID         | Owner DID                        | `did:plc:c22jdrqhoajyj5ca7e56a3ke`   |
| INVITE_CODE_FREQ      | Invite code frequency by JSON    | `'{"days": 10}'`                     |
| CDN_PREFIX            | Blob image proxy URL             | http://cdn-skytools.anon5r.com/proxy |
| CLOUDFLARE_ACCOUNT_ID | Your Cloudflare Account ID       |                                      |
| NITRO_PRESET          | Nuxt.js preset for deployment    | `cloudflare-pages`                   |

## Development

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# Standard Nuxt.js development server
yarn dev

# Or run as Cloudflare Pages development server
yarn pages:dev
```

### Debugging

To debug the UI part, you can use the following techniques:

1. **Vue DevTools**: Install the Vue DevTools browser extension to inspect Vue components, state, and events.

2. **Browser DevTools**: Use the browser's built-in developer tools to inspect the DOM, network requests, and JavaScript
   errors.

3. **Console Logging**: Use `console.log()` statements in your code to log information to the browser console.

4. **Nuxt.js DevTools**: Enable Nuxt.js DevTools by setting `devtools: { enabled: true }` in your `nuxt.config.ts` file.

## Deployment

The UI part is deployed to Cloudflare Pages using the GitHub Actions workflow defined in
`.github/workflows/deploy-pages.yaml`. The workflow is triggered when changes are pushed to the `main` branch and the
changes affect files in the `app` directory (excluding the `app/server` directory) or the workflow file itself.

### Deployment Process

1. The workflow checks out the code.
2. It sets up Node.js with the specified version.
3. It installs the dependencies using Yarn.
4. It builds the UI using the `pages:build` script, which uses the Cloudflare Pages preset for Nuxt.js.
5. It deploys the UI to Cloudflare Pages using the `pages:deploy` script, which uses Wrangler to deploy the UI.

### Manual Deployment

To manually deploy the UI part to Cloudflare Pages, run the following commands from the `app` directory:

```bash
# Install dependencies
yarn install

# Build for Cloudflare Pages
yarn pages:build

# Deploy to Cloudflare Pages
yarn pages:deploy
```

### Preview Deployment

To preview the production build locally, run the following command from the `app` directory:

```bash
# Preview the production build
yarn pages:preview
```

## Project Structure

- `app.vue`: The main Vue component.
- `app.config.ts`: Application configuration.
- `nuxt.config.ts`: Nuxt.js configuration.
- `assets/`: Static assets like CSS, images, and fonts.
- `components/`: Vue components.
- `composables/`: Vue composables.
- `layouts/`: Vue layouts.
- `pages/`: Vue pages.
- `plugins/`: Vue plugins.
- `public/`: Public files that will be served at the root.
- `server/`: Server API code (deployed to Cloudflare Workers).
- `static/`: Static files.
- `utils/`: Utility functions.

For more information about Nuxt.js, check out
the [Nuxt.js documentation](https://nuxt.com/docs/getting-started/introduction).
