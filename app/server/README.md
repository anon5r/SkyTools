# SkyTools Server API

This directory contains the server API for SkyTools, which is deployed to Cloudflare Workers.

## Deployment

The server API is deployed to Cloudflare Workers using the GitHub Actions workflow defined in
`.github/workflows/deploy-workers.yaml`. The workflow is triggered when changes are pushed to the `main` branch and the
changes affect files in the `app/server` directory, the `wrangler.toml` file, or the workflow file itself.

### Deployment Process

1. The workflow checks out the code.
2. It sets up Node.js with the specified version.
3. It installs the dependencies using pnpm, focusing only on the server workspace to minimize the deployment size.
4. It builds the server using the `workers:build` script, which calls the server workspace's `build` script to use
   esbuild to bundle and minify the server code.
5. It deploys the server to Cloudflare Workers using the `workers:deploy` script, which uses Wrangler to deploy the
   server.

### Manual Deployment

To manually deploy the server API to Cloudflare Workers, run the following commands from the `app` directory:

```bash
# Install dependencies
pnpm install

# Focus on server workspace to minimize deployment size
pnpm --filter skytools-api install --prod

# Build the server
pnpm workers:build

# Deploy to Cloudflare Workers
pnpm workers:deploy
```

## Development

To develop the server API locally, run the following command from the `app` directory:

```bash
# Start the development server
pnpm workers:dev
```

This will start a local development server using Wrangler, which will simulate the Cloudflare Workers environment.

### Debugging

To debug the server API, you can use the following techniques:

1. **Console Logging**: Use `console.log()` statements in your code to log information to the console. These logs will
   appear in the terminal where you're running the development server.

2. **Error Handling**: Implement proper error handling in your code to catch and log errors. This will help you identify
   issues in your code.

3. **Wrangler Dev Tools**: When running the development server, Wrangler provides a web interface at
   `http://localhost:8976` where you can view logs, inspect requests, and more.

4. **Testing Endpoints**: Use tools like cURL, Postman, or the browser to test your API endpoints. For example:

   ```bash
   curl http://localhost:8787/resolve-handle?query=yourusername.bsky.social
   ```

## Configuration

The server API is configured using the `wrangler.toml` file in the root directory of the project. This file defines the
name of the Worker, the account ID, the build command, and other configuration options.

### Environment Variables

The following environment variables are used by the server API:

| Variable | Description                                    | Default Value |
|----------|------------------------------------------------|---------------|
| NODE_ENV | The environment in which the server is running | `production`  |

## Minimizing Deployment Size

To minimize the deployment size of the server API, the following techniques are used:

1. **Workspace Focus**: The `pnpm --filter skytools-api install --prod` command is used to install only the dependencies
   required by the server API, excluding development dependencies.

2. **esbuild**: The server code is bundled and minified using esbuild, which produces smaller output compared to other
   bundlers.

3. **ES Modules**: The server code is built as ES modules, which are generally smaller than CommonJS modules.

4. **Minification**: The server code is minified to reduce its size.

5. **Tree Shaking**: Unused code is removed from the bundle using tree shaking.

## API Endpoints

The server API provides the following endpoints:

- `/resolve-handle`: Resolves a handle to a DID.
- `/handle-resolve`: Resolves a DID to a handle.
- `/resolver`: Resolves a handle or DID.
- `/getrepocar`: Gets repository car files.
