import * as QRCode from 'qr-image';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('qr-image');

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
    const request = new Request(`http://localhost?code=${code}`);
    const response = handleRequest(request);
    vi.mocked(QRCode.imageSync).mockReturnValue(Buffer.from(code));
    const buffer = QRCode.imageSync(code, { type: 'png' });
    expect(typeof response.body).toEqual(typeof buffer);
    expect(QRCode.imageSync).toHaveBeenCalledWith(code, { type: 'png' });
    expect(response.headers.get('Content-Type')).toEqual('image/png');
  });

  it('returns an error when code query is missing', async () => {
    const { handleRequest } = await import('./worker.ts');
    const request = new Request(`http://localhost`);
    const response = handleRequest(request);
    expect(response.status).toEqual(400);
  });

  it('returns an error qr code fails', async () => {
    vi.spyOn(QRCode, 'imageSync').mockImplementation(() => {
      throw new Error('QR code failed');
    });
    const { handleRequest } = await import('./worker.ts');
    const request = new Request(`http://localhost?code=3413`);
    const response = handleRequest(request);
    expect(response.status).toEqual(500);
  });
});
