import { addDays, formatISO, subDays } from 'date-fns';

import { CampaignEvent, CampaignType, getActiveCampaigns } from './campaigns';

describe('campaigns.test.ts', () => {
  const today = new Date();
  const mockActiveCampaignDates = {
    startDate: formatISO(subDays(today, 6)),
    endDate: formatISO(addDays(today, 6)),
  };
  const mockInactiveCampaignDates = {
    startDate: formatISO(subDays(today, 10)),
    endDate: formatISO(subDays(today, 6)),
  };
  const mockContent = {
    id: '1',
    imageURL: 'https://image.com',
    iframeUrl: 'https://iframe.com',
  };
  const mockCampaignData: CampaignEvent[] = [
    {
      id: '1',
      campaignType: CampaignType.ThankYouCampaign,
      content: mockContent,
      startDate: mockActiveCampaignDates.startDate,
      endDate: mockActiveCampaignDates.endDate,
    },
    {
      id: '2',
      campaignType: CampaignType.ThankYouCampaign,
      content: mockContent,
      startDate: mockInactiveCampaignDates.startDate,
      endDate: mockInactiveCampaignDates.endDate,
    },
    {
      id: '2',
      campaignType: CampaignType.BlackFriday,
      content: mockContent,
      startDate: mockInactiveCampaignDates.startDate,
      endDate: mockInactiveCampaignDates.endDate,
    },
  ];

  describe('getActiveCampaigns', () => {
    const testCases = [
      {
        campaignType: CampaignType.ThankYouCampaign,
        expectedResult: [{ id: mockCampaignData[0].id, content: mockCampaignData[0].content }],
      },
      {
        campaignType: CampaignType.BlackFriday,
        expectedResult: [],
      },
    ];

    it.each(testCases)(
      'should only return campaigns which are active & match the campaign type',
      ({ campaignType, expectedResult }) => {
        const res = getActiveCampaigns(campaignType, mockCampaignData);
        expect(res).toStrictEqual(expectedResult);
      },
    );
  });
});
