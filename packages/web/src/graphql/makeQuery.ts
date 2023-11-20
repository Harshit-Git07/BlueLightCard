import {
  ApolloClient,
  InMemoryCache,
  OperationVariables,
  TypedDocumentNode,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { OfferRestriction } from '@core/offers/offerRestriction';

export const gqlLinkWithAuthHeaders = () => {
  const authorization = localStorage.getItem('idToken') || '';

  return createHttpLink({
    uri: process.env.NEXT_PUBLIC_OFFERS_ENDPOINT || '',
    headers: {
      authorization,
    },
  });
};

export const apolloClient = (clientOverwrite: ApolloLink | undefined = undefined) => {
  const client = new ApolloClient({
    link: clientOverwrite ?? gqlLinkWithAuthHeaders(),
    credentials: 'include',
    cache: new InMemoryCache(),
  });

  return client;
};

export async function makeQuery(query: DocumentNode | TypedDocumentNode<any, OperationVariables>) {
  const client = apolloClient();
  return await client.query({ query });
}

export async function makeHomePageQueryWithDislikeRestrictions(
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  dislikes: number[]
) {
  const OfferRestrictions = new OfferRestriction({ dislikedCompanyIds: dislikes });

  const removeDislikedOffersLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      // Banners
      if (response.data?.banners) {
        response.data.banners = response.data.banners.filter(
          (banner: any) => !OfferRestrictions.isBannerRestricted(banner)
        );
      }
      // Market Places
      if (response.data?.offerMenus?.deals) {
        response.data.offerMenus.deals = response.data.offerMenus.deals.filter(
          (deal: any) => !OfferRestrictions.isDealOfTheWeekRestricted(deal)
        );
      }
      if (response.data?.offerMenus?.features) {
        response.data.offerMenus.features = response.data.offerMenus.features.filter(
          (feature: any) => !OfferRestrictions.isFeaturedOfferRestricted(feature)
        );
      }
      if (response.data?.offerMenus?.marketPlace) {
        response.data.offerMenus.marketPlace.map((menu: any) => {
          menu.items = menu.items.filter((item: any) => {
            return !OfferRestrictions.isMarketPlaceMenuItemRestricted(item.item);
          });
          return menu;
        });
      }
      // Flexible is not affected by dislikes
      return response;
    });
  });

  const client = apolloClient(removeDislikedOffersLink.concat(gqlLinkWithAuthHeaders()));
  return await client.query({ query });
}

export async function makeNavbarQueryWithDislikeRestrictions(
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  dislikes: number[]
) {
  const OfferRestrictions = new OfferRestriction({ dislikedCompanyIds: dislikes });

  const removeDislikedOffersLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      if (response.data?.response?.companies) {
        response.data.response.companies = response.data.response.companies.filter(
          (company: any) => {
            return !OfferRestrictions.isCompanyRestricted(company);
          }
        );
      }
      return response;
    });
  });

  const client = apolloClient(removeDislikedOffersLink.concat(gqlLinkWithAuthHeaders()));
  return await client.query({ query });
}
