import Image from 'next/image';
import Link from 'next/link';

export default function CampaignTile({ campaign }: { campaign: Sanity.CampaignTile }) {
  return (
    <Link href={`/campaign/${campaign._id}`}>
      <span>{campaign.name}</span>
      {campaign.image.default != null && (
        <Image
          src={campaign.image.default.url}
          alt={campaign.name}
          width={campaign.image.default.width}
          height={campaign.image.default.height}
        />
      )}
    </Link>
  );
}
