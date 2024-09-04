import { mapCampaignData } from '../helpers/mapCampaignData';

describe('mapCampaignData', () => {
  it('should return an array of CampaignEvent objects when valid campaign data is passed', () => {
    const campaignData = [
      { id: '1', campaignType: 'thankyouCampaign', content: {}, startDate: '2022-01-01', endDate: '2022-01-31' },
      { id: '2', campaignType: 'thankyouCampaign', content: {}, startDate: '2022-02-01', endDate: '2022-02-28' },
    ];

    const result = mapCampaignData(campaignData);

    expect(result).toStrictEqual(campaignData);
  });

  it('should throw an error when invalid campaign data is passed', () => {
    const campaignData = [
      { id: 1, name: 'Campaign 1', startDate: '2022-01-01', endDate: '2022-01-31' },
      { id: 2, name: 'Campaign 2', startDate: '2022-02-01' }, // Missing endDate
    ];

    expect(() => mapCampaignData(campaignData)).toThrow('Invalid campaign data');
  });
});
