import { execSync } from 'child_process';
import { EOL } from 'os';

try {
  const result = execSync('git diff --name-only --cached').toString().trim();

  if (!result.length) {
    console.info('No staged files found');
  }

  const paths = result.split(EOL).map((path) => path.replace('packages/client/', ''));
  if (paths.length) {
    execSync(`npx jest --passWithNoTests --findRelatedTests ${paths.join(' ')}`, {
      cwd: 'packages/client',
      stdio: 'inherit',
    });
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}