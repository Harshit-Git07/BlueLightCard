import { gql } from '@apollo/client';

export const homePageQuery = (brand: string) => gql`
  query HomePageQuery {
    # Banners
    banners: getBannersByBrandAndType(type: "takeover", brand: "${brand}", limit: 3) {
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
            compid
            id
          }
        }
        name
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
