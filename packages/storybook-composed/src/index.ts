import config from './config';
import type { Instance } from './types';
const { executeInThread } = require('funthreads');

function buildStorybook(instance: Instance) {
  const { root, pkgName, variantName, port, env } = instance;

  const packageJson = JSON.parse(require('fs').readFileSync(`${root}/${pkgName}/package.json`));

  const packageStorybookVersion = parseFloat(
    packageJson.devDependencies.storybook.replace(/[^0-9.]/g, ''),
  );
  const isPreStorybook8 = packageStorybookVersion < 8;

  const storybookServerPath = isPreStorybook8 ? 'core-server' : 'core/core-server';
  const storybookCliPath = isPreStorybook8 ? 'cli' : 'core';

  const { buildDevStandalone } = require(`@storybook/${storybookServerPath}`);

  const { dirname } = require('path');
  const storybookPackageJsonDir = dirname(require.resolve(`@storybook/${storybookCliPath}`));
  const storybookPackageJson = JSON.parse(
    require('fs').readFileSync(`${storybookPackageJsonDir}/../package.json`),
  );

  // Standard environment variables to always set to mimic Storybook build
  process.env.NODE_ENV = 'development';
  process.env.STORYBOOK_ENV = 'true';
  process.env.npm_lifecycle_event = 'build-storybook';

  // Custom environment variables to set as the specific instance
  // being built might need custom build-time env vars
  env.forEach((environmentVariable) => {
    process.env[environmentVariable.key] = environmentVariable.value;
  });

  return buildDevStandalone({
    configType: 'DEVELOPMENT',
    ignorePreview: false,
    outputDir: `storybook-static/${pkgName}/${variantName}`,
    configDir: `../${pkgName}/.storybook`,
    packageJson: storybookPackageJson,
    port,
  });
}

(async function () {
  // Start building a new Storybook instance for every package and its variants
  const instanceThreads = config
    .toInstances()
    .map((instance) => executeInThread(buildStorybook, instance));

  await Promise.all(instanceThreads);

  // Build the main Storybook instance that composes all of the others
  buildStorybook({
    root: config.projectRoot,
    pkgName: 'storybook-composed',
    variantName: '*',
    port: 6006,
    env: [],
  });
})();
