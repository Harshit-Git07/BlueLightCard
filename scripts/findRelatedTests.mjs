import { execSync } from 'child_process';
import { EOL } from 'os';

const isCIFlag = process.argv[2] === '--ci';

try {
  const result = execSync(isCIFlag ?
    `git show --name-only --pretty=format:%b` :
    'git diff --name-only --cached'
  ).toString().split(/\s+/)[1];

  if (result && result.length) {
    const paths = result.split(EOL).map((path) => {
      if (isCIFlag) {
        console.info(`File: ${path}`);
      }
      return path.replace('packages/client/', '');
    });
    if (paths.length) {
      execSync(`npx jest --passWithNoTests --findRelatedTests ${paths.join(' ')}`, {
        cwd: 'packages/client',
        stdio: 'inherit',
      });
    }
  } else {
    console.info('No files found');
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}