import * as QRCode from 'qr-image';

export const handleRequest = (request: Request): Response => {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }
    const buffer = QRCode.imageSync(code, { type: 'png' });

    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (err) {
    return new Response(`Error ${err}`, { status: 500 });
  }
};

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
