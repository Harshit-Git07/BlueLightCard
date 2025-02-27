import getCDNUrl from '@/utils/getCDNUrl';

export const CharacterEntities: Record<string, string> = {
  'Â£': '\u{00a3}',
  '\\.\\.\\.': '\u{2026}',
  "\\\\'": "'",
  'Ã𝇍â¬â𝇍': "'", //A Dixon Autos - About
  'â€™': "'",
  '€™': '\u{0000}', // Sonos - About
  â: "'", //Butlin's - Enjoy the best of Butlin's, plus an extra £20 off
};

export const recentSearchesData = [
  'nike',
  'jd sports',
  'new',
  'samsung',
  'new look',
  'british airways',
];

export const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);
