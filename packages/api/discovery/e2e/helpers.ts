import { ApiGatewayV1Api } from 'sst/node/api';

import { ENDPOINTS } from '../infrastructure/constants/environment';

export const whenCompaniesIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
  const urlParams = new URLSearchParams(params);
  const companiesEndpoint = `${ApiGatewayV1Api.discovery.url}companies?${urlParams.toString()}`;
  return fetch(companiesEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-client-type': 'web',
      ...headers,
    },
  });
};

const getSearchEndpoint = () => {
  if (ENDPOINTS.SEARCH === undefined || ENDPOINTS.SEARCH === '') {
    return `${ApiGatewayV1Api.discovery.url}search`;
  }
  return ENDPOINTS.SEARCH;
};

export const whenSearchIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
  const urlParams = new URLSearchParams(params);
  const searchEndpoint = getSearchEndpoint();
  return fetch(`${searchEndpoint}?${urlParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-client-type': 'web',
      ...headers,
    },
  });
};

export const whenCategoryIsCalledWith = async (headers: Record<string, string>, categoryId: string) => {
  const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories/${categoryId}`;
  return fetch(categoriesEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-client-type': 'web',
      ...headers,
    },
  });
};

export const whenCategoriesIsCalledWith = async (headers: Record<string, string>) => {
  const categoriesEndpoint = `${ApiGatewayV1Api.discovery.url}categories`;
  return fetch(categoriesEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-client-type': 'web',
      ...headers,
    },
  });
};

export const whenNearestOffersIsCalledWith = async (
  headers: Record<string, string>,
  params: Record<string, string>,
) => {
  const nearestEndpoint = `${ApiGatewayV1Api.discovery.url}nearest`;
  const queryParams = new URLSearchParams(params);
  return fetch(`${nearestEndpoint}?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-client-type': 'web',
      ...headers,
    },
  });
};
