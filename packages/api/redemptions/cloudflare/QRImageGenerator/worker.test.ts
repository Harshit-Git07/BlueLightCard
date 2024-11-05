import * as QRCode from 'qrcode';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('qrcode');

describe('Fetch event', () => {
  beforeEach(() => {
    global.addEventListener = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.addEventListener = undefined;
    vi.clearAllMocks();
  });

  it('returns a QR code image when code query parameter is present', async () => {
    const { handleRequest } = await import('./worker.ts');
    const code = '123456';
    const mockToString = vi.fn().mockImplementation((): string => {
      return code;
    });

    vi.spyOn(QRCode, 'toString').mockImplementation(mockToString);

    const expectedOutput = await QRCode.toString(code);
    const request = new Request(`http://localhost?code=${code}`);
    const response = await handleRequest(request);
    const responseBody = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(responseBody).toBe(expectedOutput);
  });

  it('returns an error when code query is missing', async () => {
    const { handleRequest } = await import('./worker.ts');
    const request = new Request(`http://localhost`);
    const response = await handleRequest(request);

    expect(response.status).toEqual(400);
  });

  it('returns an error qr code fails', async () => {
    const { handleRequest } = await import('./worker.ts');
    const mockToString = vi.fn().mockImplementation(() => {
      throw new Error('QR code failed');
    });

    vi.spyOn(QRCode, 'toString').mockImplementation(mockToString);

    const request = new Request(`http://localhost?code=3413`);
    const response = await handleRequest(request);

    expect(response.status).toEqual(500);
  });
});
