import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import { SEARCH_MOCK_DATA_FILE, SST_OUTPUT_JSON, TEST_DATA_DIR, cliArgs } from './constants';
import { logger } from './instances';
import { EOL } from 'os';

type SSTOutput = Record<string, unknown>;
type SSTValues = Record<string, string>;
type EnvValues = Record<string, string>;

function getSSTOutput() {
  return JSON.parse(readFileSync(SST_OUTPUT_JSON).toString()) as SSTOutput;
}

export function getFlagValue(name: string) {
  const findFlagByName = cliArgs.find((arg) => arg.startsWith(`--${name}`));
  const flagValue = findFlagByName?.split('=')[1];

  return flagValue;
}

export function getValues(keys: string[]) {
  const sstOutput = getSSTOutput();
  const values: SSTValues = {};

  const process = (obj: SSTOutput) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        process(obj[key] as SSTOutput);
      } else if (keys.includes(key)) {
        values[key] = obj[key] as string;
      }
    }
  };

  process(sstOutput);
  return values;
}

export function getTestDataFiles() {
  const fileNames = readdirSync(TEST_DATA_DIR);
  const files = fileNames
    .map((fileName) => ({
      key: fileName,
      content: readFileSync(resolve(TEST_DATA_DIR, fileName)),
    }))
    .filter((file) => file.key !== SEARCH_MOCK_DATA_FILE);

  return files;
}

export function updateEnvFile(values: EnvValues, envPath: string) {
  const envUpdates: EnvValues = {};
  // load users .env to update
  config({
    processEnv: envUpdates,
    path: join(process.cwd(), envPath),
  });

  logger.info({ message: `Updating '${envPath}' file with sst values` });

  for (const envKey in values) {
    envUpdates[envKey] = values[envKey];
  }

  // convert env updates to raw env data
  const envRawData = Object.keys(envUpdates).reduce((acc, key) => {
    acc += `${key}=${envUpdates[key]}${EOL}`;
    return acc;
  }, '');
  writeFileSync(join(process.cwd(), envPath), envRawData);
}
