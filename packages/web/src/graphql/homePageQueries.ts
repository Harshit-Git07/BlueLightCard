import { gql } from '@apollo/client';

export const homePageQuery = (brand: string, isUnder18: boolean, organisation: string) => gql`
  query HomePageQuery {
    banners: getBanners(
      input: {brandId: "${brand}", limit: 10, type: "sponsor", restriction: {isUnder18: ${isUnder18}}}
    ) {
      link
      imageSource
      legacyCompanyId
    }
    offerMenus: getOfferMenusByBrandId(brandId: "${brand}", input: {isUnder18: ${isUnder18}, organisation: "${organisation}"}) {
      deals {
        compid
        image
        logos
        id
        offername
        companyname
      }
      flexible {
        imagehome
        title
        hide
      }
      marketPlace {
        items {
          item {
            companyname
            offername
            image
            logos
            compid
            offerId
          }
        }
        name
        hidden
      }
      features {
        companyname
        offername
        image
        logos
        compid
        id
      }
    }
  }
`;

export const companiesCategoriesQuery = (brand: string, isUnder18: boolean) => gql`
  query CompaniesCategoriesQuery {
    response: getCategoriesAndCompaniesByBrandId(brandId: "${brand}", input: { isUnder18: ${isUnder18} }) {
      categories {
        id
        name
      }
      companies {
        id
        name
      }
    }
  }
`;
