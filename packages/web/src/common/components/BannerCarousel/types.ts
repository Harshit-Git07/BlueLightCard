export type CampaignCardProps = {
  name: string;
  image: string;
  linkUrl: string;
  className?: string;
};

export type BannerCarouselPropers = {
  banners: CampaignCardProps[];
};
