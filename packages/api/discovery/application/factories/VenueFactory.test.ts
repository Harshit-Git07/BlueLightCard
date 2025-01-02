import { venueFactory } from './VenueFactory';

describe('Venue Factory', () => {
  it('should build a default Venue object', () => {
    const venue = venueFactory.build();
    expect(venue).toEqual({
      id: '1',
      name: 'Sample venue',
      logo: 'https://cdn.bluelightcard.co.uk/venue/1724052659175.jpg',
      categories: expect.any(Array),
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
  });

  it('should build an Offer object with overridden name', () => {
    const venue = venueFactory.build({ name: 'Special venue' });
    expect(venue.name).toBe('Special venue');
  });
});
