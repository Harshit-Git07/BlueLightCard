import crypto from 'crypto';

export function selectRandomEntries<T extends { id: string }>(items: T[], count: number): T[] {
  if (count > items.length) {
    return [];
  }

  const shuffled = [...items];

  // Fisher-Yates shuffle using cryptographically secure random bytes
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomBytes = crypto.randomBytes(4);
    const randomIndex = randomBytes.readUInt32LE(0) % (i + 1);
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
