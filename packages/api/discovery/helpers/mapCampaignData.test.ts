import { CampaignType } from '../application/services/campaigns';
import { mapCampaignData } from '../helpers/mapCampaignData';

describe('mapCampaignData', () => {
  it('should return an array of CampaignEvent objects when valid campaign data is passed', () => {
    const campaignData = [
      {
        id: '1',
        campaignType: CampaignType.ThankYouCampaign,
        content: {},
        startDate: '2022-01-01',
        endDate: '2022-01-31',
      },
      {
        id: '2',
        campaignType: CampaignType.ThankYouCampaign,
        content: {},
        startDate: '2022-02-01',
        endDate: '2022-02-28',
      },
    ];

    const result = mapCampaignData(campaignData);

    expect(result).toStrictEqual(campaignData);
  });
});
