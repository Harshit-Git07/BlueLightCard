import { Config } from 'sst/node/config';

export const emailBucket = Config?.['email-templates-bucket'] ?? '';
