import client from '@/lib/sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

const clientWithToken = client.withConfig({
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

export async function GET(request: Request) {
  console.info('Request URL:', request.url);

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(clientWithToken, request.url);

  console.info('Validation result:', { isValid, redirectTo });

  if (!isValid) {
    console.error('Invalid secret');
    return new Response('Invalid secret', { status: 401 });
  }

  console.info('Enabling draft mode');
  draftMode().enable();

  console.info('Redirecting to:', redirectTo);
  redirect(redirectTo);
}
