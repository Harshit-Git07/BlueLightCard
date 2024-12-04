import { CompanyLocationEvent } from '@blc-mono/discovery/application/models/CompanyLocation';

import {
  mapSanityCompanyLocationToCompanyLocationEvent,
  SanityCompanyLocationEventBody,
} from './mapSanityCompanyLocationToCompanyLocation';

describe('mapSanityCompanyLocationToCompanyLocationEvent', () => {
  const baseEvent: SanityCompanyLocationEventBody = {
    _id: 'company-123',
    _updatedAt: '2024-11-04T09:46:08.003Z',
    _type: 'company.location.batch',
    operation: 'create',
    batchIndex: 1,
    totalBatches: 2,
    locations: [
      {
        storeName: 'Store 1',
        addressLine1: '123 Main St',
        addressLine2: 'Suite 100',
        townCity: 'Anytown',
        postcode: '12345',
        region: 'Region 1',
        country: 'UK',
        location: {
          _type: 'geopoint',
          lat: 40.7128,
          lng: -74.006,
        },
        telephone: '123-456-7890',
        _type: 'company.location',
      },
    ],
  };

  it('should throw an error if location is missing', () => {
    const event = {
      ...baseEvent,
      locations: [
        {
          ...baseEvent.locations[0],
          location: undefined,
        },
      ],
    };

    expect(() => mapSanityCompanyLocationToCompanyLocationEvent(event)).toThrow('Missing sanity field: location');
  });

  it('should throw an error if location.lat is missing', () => {
    const event = {
      ...baseEvent,
      locations: [
        {
          ...baseEvent.locations[0],
          location: {
            _type: 'geopoint',
            lat: undefined,
            lng: -74.006,
          },
        },
      ],
    };

    expect(() => mapSanityCompanyLocationToCompanyLocationEvent(event as SanityCompanyLocationEventBody)).toThrow(
      'Missing sanity field: location.lat',
    );
  });

  it('should throw an error if location.lng is missing', () => {
    const event = {
      ...baseEvent,
      locations: [
        {
          ...baseEvent.locations[0],
          location: {
            lat: 40.7128,
            lng: undefined,
          },
        },
      ],
    };

    expect(() => mapSanityCompanyLocationToCompanyLocationEvent(event as SanityCompanyLocationEventBody)).toThrow(
      'Missing sanity field: location.lng',
    );
  });

  it('should map the event correctly', () => {
    const result: CompanyLocationEvent = mapSanityCompanyLocationToCompanyLocationEvent(baseEvent);

    expect(result).toEqual({
      companyId: 'company-123',
      updatedAt: '2024-11-04T09:46:08.003Z',
      batchIndex: 1,
      totalBatches: 2,
      locations: [
        {
          id: 'company-123#2024-11-04T09:46:08.003Z#1#0',
          type: 'company-location',
          companyId: 'company-123',
          updatedAt: '2024-11-04T09:46:08.003Z',
          storeName: 'Store 1',
          addressLine1: '123 Main St',
          addressLine2: 'Suite 100',
          townCity: 'Anytown',
          postcode: '12345',
          region: 'Region 1',
          country: 'UK',
          location: {
            lat: 40.7128,
            lon: -74.006,
          },
          telephone: '123-456-7890',
          batchIndex: 1,
          totalBatches: 2,
        },
      ],
    });
  });
});
