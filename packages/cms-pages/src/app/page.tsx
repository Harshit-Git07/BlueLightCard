import { fetchSanity, groq } from '@/lib/sanity/fetch';
import { creativeModuleQuery } from '@/lib/sanity/queries';
import Modules from '@/ui/modules';
import processMetadata from '@/lib/processMetadata';
import { getBrand } from './actions';
import { notFound } from 'next/navigation';

export default async function Page() {
  const page = await getPage();
  if (!page) notFound();
  return <Modules modules={page?.modules} />;
}

export async function generateMetadata() {
  const page = await getPage();
  if (!page) notFound();
  return await processMetadata(page);
}

async function getPage() {
  const brand = await getBrand();
  const page = await fetchSanity<Sanity.Page>(
    groq`*[_type == 'page' && brand->.code == $brand && metadata.slug.current == 'index'][0]{
			...,
			modules[]{
				...,
				ctas[]{
					...,
					link{
						...,
						internal->{ title, metadata }
					}
				},
				logos[]->,
				testimonials[]->,
				predefinedFilters[]->,
				${creativeModuleQuery}
			},
			metadata {
				...,
				'ogimage': image.asset->url
			}
		}`,
    {
      params: {
        brand,
      },
      tags: ['homepage'],
    },
  );
  return page;
}
