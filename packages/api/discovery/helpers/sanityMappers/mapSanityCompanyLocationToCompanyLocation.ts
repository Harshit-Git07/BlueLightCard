import { CompanyLocation as SanityCompanyLocation } from '@bluelightcard/sanity-types';

import { CompanyLocationEvent } from '@blc-mono/discovery/application/models/CompanyLocation';

export type SanityCompanyLocationEventBody = {
  _id: string; // _id for the company that these locations relate to
  _updatedAt: string;
  _type: 'company.location.batch';
  operation: 'create' | 'update' | 'delete';
  batchIndex: number;
  totalBatches: number;
  locations: SanityCompanyLocation[];
};

export function mapSanityCompanyLocationToCompanyLocationEvent(
  companyLocationEvent: SanityCompanyLocationEventBody,
): CompanyLocationEvent {
  return {
    companyId: companyLocationEvent._id,
    updatedAt: companyLocationEvent._updatedAt,
    batchIndex: companyLocationEvent.batchIndex,
    totalBatches: companyLocationEvent.totalBatches,
    locations: companyLocationEvent.locations.map((location, key) => {
      if (!location.location) {
        throw new Error('Missing sanity field: location');
      }
      if (!location.location.lng) {
        throw new Error('Missing sanity field: location.lng');
      }
      if (!location.location.lat) {
        throw new Error('Missing sanity field: location.lat');
      }
      return {
        id: `${companyLocationEvent._id}#${companyLocationEvent._updatedAt}#${companyLocationEvent.batchIndex}#${key}`,
        type: 'company-location',
        companyId: companyLocationEvent._id,
        updatedAt: companyLocationEvent._updatedAt,
        storeName: location.storeName,
        addressLine1: location.addressLine1,
        addressLine2: location.addressLine2,
        townCity: location.townCity,
        postcode: location.postcode,
        region: location.region,
        country: location.country,
        location: {
          lat: location.location.lat,
          lon: location.location.lng,
        },
        telephone: location.telephone,
        batchIndex: companyLocationEvent.batchIndex,
        totalBatches: companyLocationEvent.totalBatches,
      };
    }),
  };
}
