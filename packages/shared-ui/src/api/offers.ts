import { IPlatformAdapter, usePlatformAdapter } from '../adapters';
import { queryOptions } from '@tanstack/react-query';
import { cms_GetCompany, cms_GetOffer, cms_GetOffersByCompany } from './offers_cms';
import { legacy_GetCompany, legacy_GetOffer, legacy_GetOffersByCompany } from './offers_legacy';

export function getOffer(
  adapter: IPlatformAdapter,
  id: string | undefined | null,
  useCms: boolean,
) {
  if (!id) {
    throw new Error('Missing id');
  }
  if (!useCms) {
    return legacy_GetOffer(adapter, id);
  }

  return cms_GetOffer(adapter, id);
}

export function getCompany(
  adapter: IPlatformAdapter,
  id: string | undefined | null,
  useCms: boolean,
) {
  if (!id) {
    throw new Error('Missing id');
  }
  if (!useCms) {
    return legacy_GetCompany(adapter, id);
  }

  return cms_GetCompany(adapter, id);
}

export function getOffersByCompany(
  adapter: IPlatformAdapter,
  id: string | undefined | null,
  useCms: boolean,
) {
  if (!id) {
    throw new Error('Missing id');
  }
  if (!useCms) {
    return legacy_GetOffersByCompany(adapter, id);
  }

  return cms_GetOffersByCompany(adapter, id);
}

export function getOfferQuery(id: string | undefined | null, useCms: boolean, isEnabled = true) {
  const adapter = usePlatformAdapter();

  return queryOptions({
    enabled: !!id && isEnabled,
    queryKey: ['offer', id],
    queryFn: () => getOffer(adapter, id, useCms),
  });
}

export function getCompanyQuery(id: string | undefined | null, useCms: boolean, isEnabled = true) {
  const adapter = usePlatformAdapter();

  return queryOptions({
    enabled: !!id && isEnabled,
    queryKey: ['company', id],
    queryFn: () => getCompany(adapter, id, useCms),
  });
}

export function getCompanyOffersQuery(
  id: string | undefined | null,
  useCms: boolean,
  isEnabled = true,
) {
  const adapter = usePlatformAdapter();

  return queryOptions({
    enabled: !!id && isEnabled,
    queryKey: ['company-offers', id],
    queryFn: () => getOffersByCompany(adapter, id, useCms),
  });
}
