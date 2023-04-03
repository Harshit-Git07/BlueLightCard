import { execSync } from 'child_process';
import { EOL } from 'os';

const isCIFlag = process.argv[2] === '--ci';
const commitSHA = process.argv[3];

console.info(`COMMIT SHA: ${commitSHA}`);

try {
  if (isCIFlag && !commitSHA) {
    throw new Error('Missing commit hash');
  }

  const result = execSync(isCIFlag ?
    `git show --name-only --pretty=format:%b ${commitSHA}` :
    'git diff --name-only --cached'
  ).toString().split(/\s+/)[1];

  if (result && result.length) {
    console.info(result);
    // const paths = result.split(EOL).map((path) => path.replace('packages/client/', ''));
    // if (paths.length) {
    //   execSync(`npx jest --passWithNoTests --findRelatedTests ${paths.join(' ')}`, {
    //     cwd: 'packages/client',
    //     stdio: 'inherit',
    //   });
    // }
  } else {
    console.info('No files found');
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}