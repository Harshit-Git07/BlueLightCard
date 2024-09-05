import { FC } from 'react';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import BannerCarousel from '@/components/Banner/BannerCarousel';
import useCampaignEvents from './useCampaignEvents';
import type { CampaignBannerProps } from './types';

const CampaignBanner: FC<CampaignBannerProps> = (props) => {
  const { onClick } = props;

  const platformAdapter = usePlatformAdapter();
  const campaignEvents = useCampaignEvents(platformAdapter);

  // we currently only support one active campaign event
  // which should be returned for the thank you campaign
  if (campaignEvents?.length !== 1) return null;
  const [campaignEvent] = campaignEvents;

  const onSlideItemClick = () => onClick(campaignEvent);

  return (
    <div data-testid="campaign-banner">
      <BannerCarousel
        slides={[
          {
            id: Number(campaignEvent.id),
            imageSrc: campaignEvent.content.imageURL,
            text: '',
          },
        ]}
        onSlideItemClick={onSlideItemClick}
      />
    </div>
  );
};

export default CampaignBanner;
