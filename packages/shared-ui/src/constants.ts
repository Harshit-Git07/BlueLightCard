import { resolve } from 'path';

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
};

export const IS_STORYBOOK_LIFECYCLE =
  process.env.npm_lifecycle_event === 'storybook' ||
  process.env.npm_lifecycle_event === 'build-storybook';
