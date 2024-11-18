import { gql } from '@apollo/client';

export const bannerQuery = (brand: string, isUnder18: boolean) => gql`
  query BannerQuery {
    banners: getBanners(
      input: {brandId: "${brand}", limit: 100, type: "sponsor", restriction: {isUnder18: ${isUnder18}}}
    ) {
      link
      imageSource
      legacyCompanyId
    }
  }
`;
