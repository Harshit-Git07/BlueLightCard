import { Config } from 'sst/node/config';

export function emailBucket(): string {
  return Config?.['email-templates-bucket'] ?? '';
}
