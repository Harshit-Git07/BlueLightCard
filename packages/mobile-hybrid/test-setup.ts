import { TextDecoder } from 'node:util';

/**
 * Mocking TextDecoder for jest
 * @see {@link https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom}
 * @see {@link https://github.com/jsdom/jsdom/issues/2524}
 */
Object.defineProperty(window, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});
