import * as QRCode from 'qrcode';

export const handleRequest = async (request: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');
    if (!code) {
      return new Response('Missing code parameter', { status: 400 });
    }
    const buffer = await QRCode.toString(code);

    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (err) {
    return new Response(`Error ${err}`, { status: 500 });
  }
};

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
