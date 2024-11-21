import { getSite } from '@/lib/sanity/queries';
import processUrl, { BASE_URL } from './processUrl';
import type { Metadata } from 'next';
import { getBrand } from '@/app/actions';

export default async function processMetadata(
  page: Sanity.Page | Sanity.BlogPost,
): Promise<Metadata> {
  const selectedBrand = await getBrand();
  const site = await getSite(selectedBrand);

  const url = processUrl(page);
  const { title, description, ogimage, noIndex } = page.metadata;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: ogimage || site.ogimage,
    },
    robots: {
      index: !noIndex,
    },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': '/blog/rss.xml',
      },
    },
  };
}
