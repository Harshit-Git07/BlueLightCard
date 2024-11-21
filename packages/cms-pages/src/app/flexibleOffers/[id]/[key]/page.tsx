import { fetchSanity, fetchSanityStatic, groq } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import OfferCollection from '@/ui/modules/offer/OfferCollection';

export default async function Page({ params }: Props) {
  const { menu } = await getThemedMenu(params);
  if (!menu) notFound();
  return <OfferCollection menu={menu} />;
}

export async function generateMetadata({ params }: Props) {
  const { menu } = await getThemedMenu(params);
  if (!menu) notFound();
  return menu.title;
}

export async function generateStaticParams() {
  const ids = await fetchSanityStatic<string[]>(groq`*[_type == "company"]._id`);

  return ids.map((id) => ({ params: { id } }));
}

async function getThemedMenu(params: Props['params']) {
  console.log(`Fetching themed menu for: ${params.id} and ${params.key}`);
  try {
    const result = await fetchSanity<{
      menu: Sanity.MenuThemedOffer;
    }>(
      groq`{
  			"menu": *[_type == 'menu.themed.offer' && _id == $id][0]{
    			...,
    			inclusions[ _type == "offerCollection" && _key == $key ]{
      			...,
      			offers[]->{
        			...,
							boostDetails{
          			boost->,
        			},
        			company->{
          			...
        			}
      			},
      			offerCollectionImage {
        			...,
      			},
      			offerCollectionName,
      			brands[]->{
        			...
      			},
      			offerDetails {
        			...,
      			},
    			}
  			}
			}`,
      {
        params: { id: params.id, key: params.key },
        tags: ['menu'],
      },
    );
    console.log(`Successfully fetched data for menu: ${params.id} and key: ${params.key}`);
    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error fetching data for menu: ${params.id} and ${params.key}`, error);
    throw error;
  }
}

interface Props {
  params: { id: string; key: string };
}
