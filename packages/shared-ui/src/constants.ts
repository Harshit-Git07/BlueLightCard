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
  MarketingPreferences: (memberId: string, platform: 'web' | 'mobile') =>
    `/${V5_REGION}/members/members/${memberId}/marketing/preferences/${platform}`,
  BrazePreferences: (memberId: string) =>
    `/${V5_REGION}/members/members/${memberId}/marketing/braze`,
  Menus: `${DISCOVERY_PATH}/menus`,
  Organisation: (orgId?: string) => `/${V5_REGION}/members/orgs/${orgId}`,
  Profile: (memberId: string) => `/${V5_REGION}/members/members/${memberId}/profile`,
  Application: (memberId: string) => `/${V5_REGION}/members/members/${memberId}/applications`,
  PaymentConfirmed: (memberId: string, applicationId: string) =>
    `/${V5_REGION}/members/members/${memberId}/applications/${applicationId}/paymentConfirmed`,
  DocumentUpload: (memberId: string, applicationId: string) =>
    `/${V5_REGION}/members/members/${memberId}/applications/${applicationId}/uploadDocument`,
  User: `/${V5_REGION}/members/user`,
} as const;

export const BRAND_WEB_URL = process.env.NEXT_PUBLIC_BRAND_URL ?? 'https://www.bluelightcard.co.uk';

export const CATEGORY_ID = {
  event: '19',
} satisfies Readonly<Record<string, string>>;

/**
 * This constant supplies the titles of the flexibles to display on the home page.
 * It is used to filter out all other flexibles before passing the data to the
 * home page for display.
 *
 * The order in the array of these titles is meaningful: the flexible menus are
 * sorted in the same order and corresponds to the order they are displayed on
 * the home page.
 *
 * When the "enable-all-flexible-menus" flag is enabled, both flexible menus will
 * be displayed.
 *
 * When the "enable-all-flexible-menus" flag is NOT enabled, only the first
 * flexible menus will be displayed.
 *
 * The case of these titles MUST be lowercase.
 */
export const FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST = [
  'ways to save',
  'free events',
] satisfies Readonly<string[]>;
