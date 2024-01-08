import { gql } from '@apollo/client';

export const advertQuery = (brand: string, isUnder18: boolean) => gql`
  query BannerQuery {
    banners: getBanners(
      input: { brandId: "${brand}", limit: 2, restriction: { isUnder18: ${isUnder18} }, type: "bottom" }
    ) {
      link
      imageSource
    }
  }
`;
