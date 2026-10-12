# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# Setup

Make sure to install the dependencies:

```bash
# Bun
bun install
```

# Environment Variables

| Variable             | Description                      | Default value                          |
|----------------------|----------------------------------|----------------------------------------|
| GTM_ID               | Google Tag Manager               | GA-XXXXXX                              |
| CLOUDFLARE_TOKEN     | Your Cloudflare API Token        |                                        |
| FONTAWESOME_NPM_AUTH_TOKEN | Font Awesome Pro npm registry token |                                  |
| DEFAULT_PDS          |                                  | `bsky.social`                          |
| DEFAULT_PDS_SUFFIX   | Auto append suffix               | `bsky.social`                          |
| DEFAULT_PDS_ENDPOINT | PDS API URL                      | https://bsky.social                    |
| DEFAULT_APP_URL      | Default application frontend URL | https://bsky.app                       |
| WEBMASTER_DID        | Owner DID                        | `did:plc:c22jdrqhoajyj5ca7e56a3ke`     |
| INVITE_CODE_FREQ     | Invite code frequency by JSON    | `'{"days": 10}'`                       |
| CDN_PREFIX           | SkyTools OGP asset base URL             | http://cdn-skytools.anon5r.com/proxy   |

Set `FONTAWESOME_NPM_AUTH_TOKEN` when installing dependencies; it authenticates Bun to the Font Awesome Pro registry.




# Run 


## Development Server

Start the development server on `http://localhost:3000`

```bash
bun run dev
```
Or run as cloudflare pages development
```bash
bun run pages:dev
```

```bash

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

Bluesky images are loaded directly from `https://cdn.bsky.app`. Videos use the playlist and thumbnail URLs returned by `https://public.api.bsky.app`, with native HLS playback or hls.js. `CDN_PREFIX` is retained for SkyTools OGP assets only. Videos unavailable in the public AppView display an unavailable message.
