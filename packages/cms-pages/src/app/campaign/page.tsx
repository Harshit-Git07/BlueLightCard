import { fetchSanity, groq } from '@/lib/sanity/fetch';
import Campaigns from '@/ui/modules/campaign/Campaigns';
import { notFound } from 'next/navigation';

export default async function Page() {
  const campaigns = await getCampaigns();
  if (!campaigns) notFound();
  return <Campaigns campaigns={campaigns} />;
}

async function getCampaigns() {
  return await fetchSanity<Sanity.CampaignTile[]>(
    groq`*[_type == 'campaign']{
		  name,
			_id,
			"image": {
				"default": image.default.asset->{
					url,
					"aspectRatio": metadata.dimensions.aspectRatio,
					"height": metadata.dimensions.height,
					"width": metadata.dimensions.width
				}
			}
		 }`,
  );
}
