import { decodeBase64 } from '../base64';

describe('decodeBase64', () => {
  it('should decode base64 string correctly', () => {
    const base64 = 'SGVsbG8gd29ybGQ=';
    const result = decodeBase64(base64);
    expect(result).toBe('Hello world');
  });
});
