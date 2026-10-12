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

## Dependency checks and deployment

Use Bun with `bun install --frozen-lockfile`, then run `bun run typecheck`, `bun test`, and `bun run build`.
`bun run audit` submits the exact package names and versions in `bun.lock` to npm's Bulk Advisory endpoint, including Font Awesome packages whose installation registry does not expose an audit API. It checks known advisories, not unknown vulnerabilities or private vendor advisories. Network/API failures fail the check.
`bun run pages:deploy` now runs the dependency audit and typecheck before building or uploading. It stops if any known advisory remains; none are ignored.

TypeScript 7.0.2 is installed alongside the official TypeScript 6 compatibility API because the current Vue and ESLint tools still require that API.
The checked-in Bun patches adapt Nuxt DevTools to simple-git 4's named export, and the DID resolver's Request construction to Cloudflare's supported `redirect: 'manual'`. DID redirects are rejected by the resolver's non-2xx response checks. Server identity resolution uses Workers-native fetch and DNS over HTTPS, avoiding Node-only undici dispatchers and global fetch mutation.

As of 2026-10-12, **two high-severity advisories remain in the development/build dependency graph**, with no published patched version:

- `braces@3.0.3`: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), through Nuxt/Nitro's file globbing dependencies.
- `node-forge@1.4.0`: [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv), through Nuxt's development HTTPS tooling (`listhen`).

Neither package was found in the generated Worker source maps. This does not resolve the dependency advisories: deployment remains blocked by the full audit until patched upstream versions or reviewed replacements are available. Do not treat this release as having zero known dependency vulnerabilities.

If local installation reports `No version matching` for a published release, use Bun 1.4.2 or newer and refresh cached package metadata:

```sh
bun install --frozen-lockfile --force --no-cache
```

Public packages use `https://registry.npmjs.org/` explicitly; Font Awesome retains its scoped registry and authentication.
