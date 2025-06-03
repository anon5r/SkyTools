# Junie Guidelines for SkyTools Project

This document provides guidelines for using Junie with the SkyTools project, a web service built with Nuxt.js that
interacts with Bluesky and AT Protocol, deployed to Vercel.

## Project Overview

SkyTools is a web service that:

- Uses Nuxt.js as the frontend framework
- Interacts with Bluesky and AT Protocol via XRPC (API)
- Displays and edits data from Bluesky and AT Protocol
- Is deployed to Vercel (UI) and Vercel Functions (API)
- Uses TypeScript for development
- Uses pnpm as the package manager
- Uses Flowbite for UI components
- Uses FontAwesome for icons

The project consists of two main parts:

1. **UI part** (in the `app` directory, excluding `app/server`): A Nuxt.js application deployed to Cloudflare Pages
2. **Server API part** (in the `app/server` directory): A server API deployed to Cloudflare Workers

## Development Environment Setup

### Prerequisites

- Node.js 20.x
- pnpm 8.15.5+
- Vercel account (for deployment)
- Bluesky account (for testing)

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/skytools.git
   cd skytools
   ```

2. Install dependencies:
   ```bash
   cd app
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `app` directory with the necessary environment variables (see the Environment Variables
   section in the README.md).

4. Start the development server:
   ```bash
   # For UI development
   pnpm dev
   # OR
   pnpm pages:dev

   # For server API development
   pnpm workers:dev
   ```

## Project Structure

### UI Part (`app` directory, excluding `app/server`)

- `app.vue`: The main Vue component
- `app.config.ts`: Application configuration
- `nuxt.config.ts`: Nuxt.js configuration
- `assets/`: Static assets like CSS, images, and fonts
- `components/`: Vue components
- `composables/`: Vue composables
- `layouts/`: Vue layouts
- `pages/`: Vue pages
- `plugins/`: Vue plugins
- `public/`: Public files that will be served at the root
- `static/`: Static files
- `utils/`: Utility functions

### Server API Part (`app/server` directory)

- `worker.ts`: The main entry point for the Cloudflare Worker
- API endpoints:
    - `/resolve-handle`: Resolves a handle to a DID
    - `/handle-resolve`: Resolves a DID to a handle
    - `/resolver`: Resolves a handle or DID
    - `/getrepocar`: Gets repository car files

## Using Junie with This Project

### Code Navigation

When using Junie to navigate the codebase:

1. **Finding Components**: Use `search_project "component_name"` to find Vue components.
   ```
   search_project "PostEmbedRecord"
   ```

2. **Finding API Endpoints**: Use `search_project "endpoint_name"` to find API endpoints in the server code.
   ```
   search_project "resolve-handle"
   ```

3. **Understanding File Structure**: Use `get_file_structure` to understand the structure of a file before opening it.
   ```
   get_file_structure /path/to/file.ts
   ```

### Making Changes

When making changes to the codebase:

1. **UI Changes**:
    - Modify Vue components in the `components/` directory
    - Update pages in the `pages/` directory
    - Use Flowbite components for UI elements
    - Use FontAwesome icons for icons

2. **Server API Changes**:
    - Modify API endpoints in the `app/server` directory
    - Follow the existing patterns for error handling and response formatting

3. **Testing Changes**:
   - Test UI changes locally using `pnpm dev` or `pnpm pages:dev`
   - Test server API changes locally using `pnpm workers:dev`
    - Use the browser's developer tools to debug UI issues
    - Use console logging to debug server API issues

### Coding Standards

1. **TypeScript**: Use TypeScript for all new code. Ensure proper typing for all variables, parameters, and return
   values.

2. **Comments and Documentation**: Write comments and documentation in English. Use JSDoc-style comments for functions
   and classes.

3. **UI Components**: Use Flowbite components for UI elements. Follow the existing patterns for component structure and
   styling.

4. **Icons**: Use FontAwesome icons for icons. Import only the icons you need to minimize bundle size.

5. **Error Handling**: Implement proper error handling in all code. Use try-catch blocks for async code and provide
   meaningful error messages.

6. **Code Formatting**: Follow the existing code formatting style. Use ESLint and Prettier for code formatting.

### Deployment Process

The project is automatically deployed to Cloudflare Pages and Cloudflare Workers when changes are pushed to the `main`
branch:

1. **UI Deployment**:
    - Changes to files in the `app` directory (excluding `app/server`) trigger the `deploy-pages.yaml` workflow
   - The workflow builds the UI using `pnpm pages:build` and deploys it to Cloudflare Pages using `pnpm pages:deploy`

2. **Server API Deployment**:
    - Changes to files in the `app/server` directory or the `wrangler.toml` file trigger the `deploy-workers.yaml`
      workflow
   - The workflow builds the server API using `pnpm workers:build` and deploys it to Cloudflare Workers using
     `pnpm workers:deploy`

### Common Workflows

1. **Adding a New UI Feature**:
    - Create or modify components in the `components/` directory
    - Update pages in the `pages/` directory
   - Test locally using `pnpm dev` or `pnpm pages:dev`
    - Commit and push to the `main` branch to trigger deployment

2. **Adding a New API Endpoint**:
    - Modify the server code in the `app/server` directory
   - Test locally using `pnpm workers:dev`
    - Commit and push to the `main` branch to trigger deployment

3. **Fixing a Bug**:
    - Identify the source of the bug using the browser's developer tools or server logs
    - Make the necessary changes to fix the bug
    - Test locally to ensure the bug is fixed
    - Commit and push to the `main` branch to trigger deployment

4. **Updating Dependencies**:
    - Update dependencies in the `package.json` file
   - Run `pnpm install` to update the `pnpm-lock.yaml` file
    - Test locally to ensure everything still works
    - Commit and push to the `main` branch to trigger deployment

## Troubleshooting

### Common Issues

1. **Deployment Failures**:
    - Check the GitHub Actions logs for error messages
    - Ensure all environment variables are properly set
    - Verify that the code builds locally before pushing

2. **Local Development Issues**:
    - Ensure all dependencies are installed
    - Check for TypeScript errors
    - Verify that environment variables are properly set

3. **API Errors**:
    - Check the server logs for error messages
    - Verify that the API endpoints are properly implemented
    - Test the API endpoints locally using tools like cURL or Postman

### Getting Help

If you encounter issues that you can't resolve, you can:

- Check the project's documentation
- Look for similar issues in the project's issue tracker
- Ask for help from other team members

## Conclusion

This guideline provides a comprehensive overview of how to use Junie with the SkyTools project. By following these
guidelines, you can effectively navigate, understand, and modify the codebase to implement new features, fix bugs, and
improve the project.
