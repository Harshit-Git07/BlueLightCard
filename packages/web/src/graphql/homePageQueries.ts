import { gql } from '@apollo/client';

export const homePageQuery = (brand: string) => gql`
  query HomePageQuery {
    # Banners
    banners: getBannersByBrandAndType(type: "sponsor", brandId: "${brand}", limit: 10) {
      link
      imageSource
    }
    offerMenus: getOfferMenusByBrandId(brandId: "${brand}") {
      # Deals of the week
      deals {
        compid
        image
        logos
        id
        offername
        companyname
      }
      # Flexible menus
      flexible {
        imagehome
        title
        hide
      }
      # Market place menus
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
      # Featured offers
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

export const companiesCategoriesQuery = (brand: string) => gql`
  query CompaniesCategoriesQuery {
    response: getCategoriesAndCompaniesByBrandId(brandId: "${brand}") {
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
