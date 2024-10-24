/**
 * Trims everything in a URL up to the path and query params.
 *
 * Example:
 * - `https://www.foo.com/bar.php?q=123` becomes `/bar.php?q=123`
 * @param url URL to parse path from
 * @returns Parsed path
 */
export const getPathFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname + parsedUrl.search;
};
