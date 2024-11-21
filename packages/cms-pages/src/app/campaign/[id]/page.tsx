import { fetchSanity, fetchSanityStatic, groq } from '@/lib/sanity/fetch';
import Campaign from '@/ui/modules/campaign/Campaign';
import { notFound } from 'next/navigation';

export default async function Page({ params }: Props) {
  const campaign = await getCampaign(params);
  if (!campaign) notFound();
  return <Campaign campaign={campaign} />;
}

async function getCampaign(params: Props['params']) {
  return await fetchSanity<Sanity.Campaign>(
    groq`*[_type == 'campaign' && _id == $id][0]{
			...,
			"image": {
				"default": image.default.asset->{
					url,
					"aspectRatio": metadata.dimensions.aspectRatio,
					"height": metadata.dimensions.height,
					"width": metadata.dimensions.width
				},
				"dark": image.dark.asset->{
					url,
					"aspectRatio": metadata.dimensions.aspectRatio,
					"height": metadata.dimensions.height,
					"width": metadata.dimensions.width
				},
				"light": image.light.asset->{
					url,
					"aspectRatio": metadata.dimensions.aspectRatio,
					"height": metadata.dimensions.height,
					"width": metadata.dimensions.width
				}
			},
			"inclusions": inclusions[]->{
					...,
					"company": company->{
						...
					}
				}
		}`,
    {
      params,
    },
  );
}

interface Props {
  params: { id?: string };
}
