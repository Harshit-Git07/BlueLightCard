import { resolve } from 'path';
import { getBrandedDiscoveryPath } from './utils/pathUtils';

export const TOKENS_ROOT_DIR = resolve(process.cwd(), '../shared-ui/tokens');

export const CharacterEntities: Record<string, string> = {
  'Â£': '\u{00a3}',
  '\\.\\.\\.': '\u{2026}',
  "\\\\'": "'",
  'Ã𝇍â¬â𝇍': "'", //A Dixon Autos - About
  'â€™': "'",
  '€™': '\u{0000}', // Sonos - About
  â: "'", //Butlin's - Enjoy the best of Butlin's, plus an extra £20 off
  '': '\u{0000}',
  "' for '": "'",
  'Ã©': '\u{00e8}',
  'Â®': '\u{00ae}',
  'Â·': '\u{00b7}',
  "' ": '–',
};

export const IS_STORYBOOK_LIFECYCLE =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';

export const focusableElements = ['button', 'a', 'input', 'textarea', 'select'];

const V5_REGION = process.env.NEXT_PUBLIC_APP_BRAND === 'blc-au' ? 'au' : 'eu';

const DISCOVERY_PATH = getBrandedDiscoveryPath();

export const V5_API_URL = {
  Employers: (orgId?: string) => `/${V5_REGION}/members/orgs/${orgId}/employers`,
  MarketingPreferences: `/${V5_REGION}/members/members/preferences`,
  Menus: `${DISCOVERY_PATH}/menus`,
  Organisation: (orgId?: string) => `/${V5_REGION}/members/orgs/${orgId}`,
  Profile: (memberId: string) => `/${V5_REGION}/members/members/${memberId}/profile`,
  Application: (memberId: string) => `/${V5_REGION}/members/members/${memberId}/applications`,
  DocumentUpload: (memberId: string, applicationId: string) =>
    `/${V5_REGION}/members/members/${memberId}/applications/${applicationId}/uploadDocument`,
  User: `/${V5_REGION}/members/user`,
} as const;

export const BRAND_WEB_URL = process.env.NEXT_PUBLIC_BRAND_URL ?? 'https://www.bluelightcard.co.uk';
