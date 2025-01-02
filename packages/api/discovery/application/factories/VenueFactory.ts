import * as Factory from 'factory.ts';

import { Venue } from '../models/Venue';

import { categoryFactory } from './CategoryFactory';

export const venueFactory = Factory.Sync.makeFactory<Venue>({
  id: Factory.each((i) => (i + 1).toString()),
  name: 'Sample venue',
  logo: 'https://cdn.bluelightcard.co.uk/venue/1724052659175.jpg',
  categories: [categoryFactory.build()],
  updatedAt: '2024-09-01T00:00:00',
  venueDescription: 'Sample venue description',
  location: {
    latitude: 1,
    longitude: 1,
  },
  addressLine1: 'sample address line 1',
  addressLine2: 'sample address line 2',
  townCity: 'sample town',
  region: 'sample region',
  postcode: 'sample postcode',
  telephone: '122432',
});
