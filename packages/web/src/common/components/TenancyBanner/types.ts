export type TenancyBannerProps = {
  variant?: 'large' | 'small';
  title?: string;
};

export type BannerDataType = {
  imageSource: string;
  title?: string;
  legacyCompanyId?: number;
  logClick?: () => void;
  link: string;
  __typename: string;
};

export type CombinedBannersType = {
  small: BannerDataType[];
  large: BannerDataType[];
};
