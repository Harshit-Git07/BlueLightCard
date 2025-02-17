import { Config } from 'sst/node/config';

export function getMemberApiUrlFromParameterStore(): string | undefined {
  return Config?.['member-api-url'];
}

export function getEmailTemplatesBucketNameFromParameterStore(): string {
  return Config?.['email-templates-bucket-name'] ?? '';
}
