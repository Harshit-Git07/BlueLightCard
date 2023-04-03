import { execSync } from 'child_process';
import { EOL } from 'os';

try {
  const result = execSync('git diff --name-only --cached').toString().trim();

  if (result.length) {
    const paths = result.split(EOL).map((path) => path.replace('packages/client/', ''));
    if (paths.length) {
      execSync(`npx jest --passWithNoTests --findRelatedTests ${paths.join(' ')}`, {
        cwd: 'packages/client',
        stdio: 'inherit',
      });
    }
  } else {
    console.info('No staged files found');
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}