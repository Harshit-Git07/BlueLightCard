export function isSpotifyUrl(url: string): boolean {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname === 'www.spotify.com' && url.includes('!!!CODE!!!');
}
