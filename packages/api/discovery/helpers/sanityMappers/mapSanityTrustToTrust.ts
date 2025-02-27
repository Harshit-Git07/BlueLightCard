import { Trust as SanityTrust } from '@bluelightcard/sanity-types';
export const mapSanityTrustToTrust = (trusts?: SanityTrust[]) =>
  trusts?.map((trust) => trust.name ?? '').filter(Boolean) ?? [];
