export type CampaignEventContent = {
  imageURL: string;
  iframeURL: string;
};

export type CampaignEvent = {
  id: string;
  content: CampaignEventContent;
};

export type CampaignBannerProps = {
  onClick: (campaignEvent: CampaignEvent) => void;
};
