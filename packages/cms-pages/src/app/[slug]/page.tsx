import { fetchSanity, fetchSanityStatic, groq } from '@/lib/sanity/fetch';
import { creativeModuleQuery } from '@/lib/sanity/queries';
import { notFound } from 'next/navigation';
import Modules from '@/ui/modules';
import processMetadata from '@/lib/processMetadata';

export default async function Page({ params }: Props) {
  const page = await getPage(params);
  if (!page) notFound();
  return <Modules modules={page?.modules} title={page?.title ?? ''} />;
}

export async function generateMetadata({ params }: Props) {
  const page = await getPage(params);
  if (!page) notFound();
  return await processMetadata(page);
}

export async function generateStaticParams() {
  const slugs = await fetchSanityStatic<string[]>(
    groq`*[
      _type == 'page' &&
      defined(metadata.slug.current) &&
      !(metadata.slug.current in ['index', '404'])
    ].metadata.slug.current`,
  );

  return slugs.map((slug) => ({ slug }));
}

async function getPage(params: Props['params']) {
  return await fetchSanity<Sanity.Page>(
    groq`*[
      _type == 'page' &&
      metadata.slug.current == $slug &&
      !(metadata.slug.current in ['index', '404'])
    ][0]{
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
        
        testimonials[]->,
        'headings': select(
          tableOfContents => content[style in ['h2', 'h3']]{
            style,
            'text': pt::text(@)
          }
        ),
        predefinedFilters[]->,
        menuOffer->{
          ...,
          brand[]->,
          inclusions[]->{
            ...,
						boostDetails{
          		boost->,
        		},
            company->,
          },
                  
        },
        menuCompany->{
          ...,
          inclusions[]->{
            ...,
						boostDetails{
          		boost->,
        		},
          },
        }, 
        menuThemedOffer->{
          ...,
          inclusions[]{
            ...,
            offers[]->{
              ...,
							boostDetails{
          			boost->,
        			},
              company->,
            },
          },
        },
        ${creativeModuleQuery}
      },
      metadata {
        ...,
        'ogimage': image.asset->url
      }
    }`,
    {
      params: { slug: params.slug },
      tags: ['pages'],
    },
  );
}

interface Props {
  params: { slug?: string };
}
