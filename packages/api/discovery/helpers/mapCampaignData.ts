import { CampaignEvent } from '../application/services/campaigns';

export const mapCampaignData = (campaignData: any): CampaignEvent[] => {
  return campaignData.map((campaign: any) => {
    if (!campaign.id || !campaign.campaignType || !campaign.content || !campaign.startDate || !campaign.endDate) {
      throw new Error('Invalid campaign data');
    }
    return {
      id: campaign.id,
      campaignType: campaign.campaignType,
      content: campaign.content,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    };
  });
};
