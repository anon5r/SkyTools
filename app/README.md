# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

# Environment Variables

| Variable             | Description                      | Default value                          |
|----------------------|----------------------------------|----------------------------------------|
| GTM_ID               | Google Tag Manager               | GA-XXXXXX                              |
| CLOUDFLARE_TOKEN     | Your Cloudflare API Token        |                                        |
| FONTAWESOME_TOKEN    | Your FontAwesome API Token       |                                        |
| DEFAULT_PDS          |                                  | `bsky.social`                          |
| DEFAULT_PDS_SUFFIX   | Auto append suffix               | `bsky.social`                          |
| DEFAULT_PDS_ENDPOINT | PDS API URL                      | https://bsky.social                    |
| DEFAULT_APP_URL      | Default application frontend URL | https://bsky.app                       |
| WEBMASTER_DID        | Owner DID                        | `did:plc:c22jdrqhoajyj5ca7e56a3ke`     |
| INVITE_CODE_FREQ     | Invite code frequency by JSON    | `'{"days": 10}'`                       |
| CDN_PREFIX           | Blob image proxy URL             | http://cdn-skytools.anon5r.com/proxy   |



# Run 


## Development Server

Start the development server on `http://localhost:3000`

```bash
yarn dev
```
Or run as cloudflare pages development
```bash
yarn pages:dev
```

```bash

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
