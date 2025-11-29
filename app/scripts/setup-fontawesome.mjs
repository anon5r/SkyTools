import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const token = process.env.FONTAWESOME_NPM_AUTH_TOKEN;

if (token) {
  console.log('Font Awesome Token found. Configuring for Pro...');
  try {
    // Configure registry for @fortawesome scope
    // We use yarn config set
    execSync('yarn config set "npmScopes.fortawesome.npmRegistryServer" "https://npm.fontawesome.com/"', { stdio: 'inherit' });
    execSync(`yarn config set "npmScopes.fortawesome.npmAuthToken" "${token}"`, { stdio: 'inherit' });

    console.log('Installing Font Awesome Pro packages...');
    const packages = [
      '@fortawesome/pro-solid-svg-icons',
      '@fortawesome/pro-regular-svg-icons',
      '@fortawesome/pro-light-svg-icons',
      '@fortawesome/pro-thin-svg-icons',
      '@fortawesome/pro-duotone-svg-icons',
      '@fortawesome/pro-brands-svg-icons'
    ];
    
    // Install without modifying lockfile if possible, but yarn add usually modifies it.
    // In CI, modifications are discarded.
    execSync(`yarn add ${packages.join(' ')}`, { stdio: 'inherit' });
    
    console.log('Font Awesome Pro installed successfully.');
  } catch (e) {
    console.error('Failed to install Font Awesome Pro:', e.message);
    // If installation fails (e.g. bad token), we might want to fail the build or fallback.
    // Letting it fail is safer so user knows something is wrong with their token.
    process.exit(1);
  }
} else {
  console.log('No Font Awesome Token found. Using Free version (default).');
  // Ensure we are using public registry for free packages (in case it was changed previously)
  try {
     execSync('yarn config unset "npmScopes.fortawesome.npmRegistryServer"', { stdio: 'ignore' });
     execSync('yarn config unset "npmScopes.fortawesome.npmAuthToken"', { stdio: 'ignore' });
  } catch (e) {}
}
