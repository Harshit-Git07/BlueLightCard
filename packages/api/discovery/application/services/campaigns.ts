import { isCurrentUKDateInRange } from '@blc-mono/discovery/helpers/isCurrentUKDateInRange';

export enum CampaignType {
  ThankYouCampaign = 'thankyouCampaign',
  BlackFriday = 'blackFriday',
}

export type CampaignEvent = {
  id: string;
  campaignType: CampaignType;
  content: object;
  startDate: string;
  endDate: string;
};

export const getActiveCampaigns = (campaignType: string, campaignData: CampaignEvent[]) => {
  const filteredCampaigns = campaignData.filter(
    (campaign) =>
      campaign.campaignType === campaignType && isCurrentUKDateInRange(campaign.startDate, campaign.endDate),
  );

  const campaigns = filteredCampaigns.map((campaign) => ({
    id: campaign.id,
    content: campaign.content,
  }));

  return campaigns;
};
