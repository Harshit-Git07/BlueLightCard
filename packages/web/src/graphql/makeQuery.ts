import {
  ApolloClient,
  InMemoryCache,
  OperationVariables,
  TypedDocumentNode,
  createHttpLink,
} from '@apollo/client';
import { DocumentNode } from 'graphql';

export const gqlLinkWithAuthHeaders = () => {
  const authorization = localStorage.getItem('idToken') || '';

  return createHttpLink({
    uri: process.env.NEXT_PUBLIC_OFFERS_ENDPOINT || '',
    headers: {
      authorization,
    },
  });
};

export const apolloClient = () => {
  const client = new ApolloClient({
    link: gqlLinkWithAuthHeaders(),
    credentials: 'include',
    cache: new InMemoryCache(),
  });

  return client;
};

async function makeQuery(query: DocumentNode | TypedDocumentNode<any, OperationVariables>) {
  const client = apolloClient();
  return await client.query({ query });
}

export default makeQuery;
