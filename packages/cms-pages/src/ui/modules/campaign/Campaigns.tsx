import { cn } from '@/lib/utils';
import CampaignTile from './CampaignTile';

export default function Campaigns({ campaigns }: { campaigns: Sanity.CampaignTile[] }) {
  return (
    <section className={cn('section', 'grid gap-8 md:grid-cols-2')}>
      {campaigns.map((campaign, index) => (
        <CampaignTile key={`campaign_${index}`} campaign={campaign} />
      ))}
    </section>
  );
}
