import { EventResponse } from '@blc-mono/discovery/application/models/EventResponse';
import { EventType, OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';

import { whenCategoryIsCalledWith } from '../../helpers';

type CategoriesOpenSearchTestInput = {
  testUserToken: string;
  activeOfferUUID: string;
  companyUUID: string;
  companyName: string;
  activeEventUUID: string;
  expiredEventUUID: string;
  excludedEventUUID: string;
  guestlistExpiredEventUUID: string;
};

export function categoriesOpenSearchTests({
  testUserToken,
  activeEventUUID,
  activeOfferUUID,
  companyName,
  companyUUID,
  excludedEventUUID,
  expiredEventUUID,
  guestlistExpiredEventUUID,
}: CategoriesOpenSearchTestInput) {
  it('should consume offer and return it when queries by category', async () => {
    const expectedSearchResult: OfferResponse = {
      offerID: activeOfferUUID,
      offerName: activeOfferUUID,
      offerType: OfferType.ONLINE,
      imageURL: 'https://testimage.com',
      companyID: companyUUID,
      legacyOfferID: 1,
      offerDescription: 'Test to see if all linked to webhook - attempt n',
      legacyCompanyID: 1,
      companyName: companyName,
    };

    const result = await whenCategoryIsCalledWith({ Authorization: `Bearer ${testUserToken}` }, '1');

    const results = (await result.json()) as { data: { data: OfferResponse[] } };

    const searchResult = results.data.data.find((result) => result.offerID === activeOfferUUID);

    expect(searchResult).toBeDefined();
    expect(searchResult).toStrictEqual(expectedSearchResult);
  });

  it('should consume events and return only valid events when queries by category', async () => {
    const expectedSearchResult: EventResponse = {
      eventID: activeEventUUID,
      eventName: activeEventUUID,
      offerType: EventType.TICKET,
      imageURL: 'https://example.com/image.jpg',
      eventDescription: 'This is a heading↵ This is a paragraph.',
      venueID: 'dc1adf94-f6f5-4d77-a155-65f72928fb77',
      venueName: 'The O2 Arena',
    };

    const result = await whenCategoryIsCalledWith({ Authorization: `Bearer ${testUserToken}` }, '19');

    const results = (await result.json()) as { data: { data: EventResponse[] } };

    expect(results.data.data.length).toEqual(1);
    const searchResult = results.data.data.find((result) => result.eventID === activeEventUUID);
    const expiredSearchResult = results.data.data.find((result) => result.eventID === expiredEventUUID);
    const excludedSearchResult = results.data.data.find((result) => result.eventID === excludedEventUUID);
    const gueslistExpiredSearchResult = results.data.data.find(
      (result) => result.eventID === guestlistExpiredEventUUID,
    );

    expect(searchResult).toBeDefined();
    expect(expiredSearchResult).toBeUndefined();
    expect(excludedSearchResult).toBeUndefined();
    expect(gueslistExpiredSearchResult).toBeUndefined();
    expect(searchResult).toStrictEqual(expectedSearchResult);
  });
}
