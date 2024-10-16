export type TenancyBannerProps = {
  variant?: 'large' | 'small';
};

export type BannerDataType = {
  imageSource: string;
  legacyCompanyId?: number;
  link: string;
  __typename: string;
};

export type CombinedBannersType = {
  small: BannerDataType[];
  large: BannerDataType[];
};
