import 'server-only';

import client from '@/lib/sanity/client';
import dev from '@/lib/env';
import { draftMode } from 'next/headers';
import type { QueryParams, ResponseQueryOptions } from 'next-sanity';
import { getRevalidationValue } from '../utils';

export { default as groq } from 'groq';

export async function fetchSanity<T = any>(
  query: string,
  {
    params = {},
    ...next
  }: {
    params?: QueryParams;
  } & ResponseQueryOptions['next'] = {},
) {
  const preview = dev || draftMode().isEnabled;

  return await client.fetch<T>(
    query,
    params,
    preview
      ? {
          perspective: 'previewDrafts',
          useCdn: false,
          token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
          next: {
            revalidate: 0,
            ...next,
          },
        }
      : {
          perspective: 'published',
          useCdn: true,
          next: {
            revalidate: getRevalidationValue(),
            ...next,
          },
        },
  );
}

export async function fetchSanityStatic<T = any>(
  query: string,
  {
    params = {},
    ...next
  }: {
    params?: QueryParams;
  } & ResponseQueryOptions['next'] = {},
) {
  return await client.fetch<T>(query, params, {
    perspective: 'published',
    useCdn: true,
    next: {
      revalidate: getRevalidationValue(),
      ...next,
    },
  });
}
