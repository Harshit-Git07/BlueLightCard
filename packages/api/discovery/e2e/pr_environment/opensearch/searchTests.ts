import { OfferType } from '@blc-mono/discovery/application/models/Offer';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { whenSearchIsCalledWith } from '../../helpers';

type OfferDetails = {
  offerId: string;
  companyName: string;
  companyId: string;
};

type SearchOpenSearchTestInput = {
  evergreenOffer: OfferDetails;
  activeOffer: OfferDetails;
  validStartDateNoExpiry: OfferDetails;
  validEndDateNoStart: OfferDetails;
  expiryDateReached: OfferDetails;
  futureStartDate: OfferDetails;
  expiredStatus: OfferDetails;

  testUserToken: string;
};

export async function searchOpenSearchTests({
  evergreenOffer,
  activeOffer,
  testUserToken,
  validStartDateNoExpiry,
  validEndDateNoStart,
  expiredStatus,
  expiryDateReached,
  futureStartDate,
}: SearchOpenSearchTestInput) {
  it('should return offer with valid offer start and end dates set', async () => {
    const expectedSearchResult: SearchResult = {
      ID: activeOffer.offerId,
      OfferName: activeOffer.offerId,
      OfferType: OfferType.ONLINE,
      offerimg: 'https://testimage.com',
      CompID: activeOffer.companyId,
      LegacyID: 1,
      OfferDescription: 'Test to see if all linked to webhook - attempt n',
      LegacyCompanyID: 1,
      CompanyName: activeOffer.companyName,
    };

    const result = await whenSearchIsCalledWith(
      { query: activeOffer.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === activeOffer.offerId);

    expect(searchResult).toStrictEqual(expectedSearchResult);
  });

  it('should return offer with offer expires & offer start as undefined (evergeen)', async () => {
    const expectedSearchResult: SearchResult[] = [
      {
        ID: evergreenOffer.offerId,
        OfferName: evergreenOffer.offerId,
        OfferType: OfferType.ONLINE,
        offerimg: 'https://testimage.com',
        CompID: evergreenOffer.companyId,
        LegacyID: 1,
        OfferDescription: 'Test to see if all linked to webhook - attempt n',
        LegacyCompanyID: 1,
        CompanyName: evergreenOffer.companyName,
      },
    ];

    const result = await whenSearchIsCalledWith(
      { query: evergreenOffer.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === evergreenOffer.offerId);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });

  it('should return offer with offer expires not set & offer start valid', async () => {
    const expectedSearchResult: SearchResult[] = [
      {
        ID: validStartDateNoExpiry.offerId,
        OfferName: validStartDateNoExpiry.offerId,
        OfferType: OfferType.ONLINE,
        offerimg: 'https://testimage.com',
        CompID: validStartDateNoExpiry.companyId.toString(),
        LegacyID: 1,
        OfferDescription: 'Test to see if all linked to webhook - attempt n',
        LegacyCompanyID: 1,
        CompanyName: validStartDateNoExpiry.companyName,
      },
    ];

    const result = await whenSearchIsCalledWith(
      { query: validStartDateNoExpiry.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === validStartDateNoExpiry.offerId);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });

  it('should return offer with offer start not set & offer expires valid', async () => {
    const expectedSearchResult: SearchResult[] = [
      {
        ID: validEndDateNoStart.offerId,
        OfferName: validEndDateNoStart.offerId,
        OfferType: OfferType.ONLINE,
        offerimg: 'https://testimage.com',
        CompID: validEndDateNoStart.companyId.toString(),
        LegacyID: 1,
        OfferDescription: 'Test to see if all linked to webhook - attempt n',
        LegacyCompanyID: 1,
        CompanyName: validEndDateNoStart.companyName,
      },
    ];

    const result = await whenSearchIsCalledWith(
      { query: validEndDateNoStart.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === validEndDateNoStart.offerId);
    expect([searchResult]).toStrictEqual(expectedSearchResult);
  });

  it('should not return offers with expiry date reached in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: expiryDateReached.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === expiryDateReached.offerId);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offers not yet started in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: futureStartDate.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === futureStartDate.offerId);

    expect([searchResult]).toStrictEqual([undefined]);
  });

  it('should not return offers status "expired" in search results', async () => {
    const result = await whenSearchIsCalledWith(
      { query: expiredStatus.offerId },
      { Authorization: `Bearer ${testUserToken}` },
    );

    const results = (await result.json()) as { data: SearchResult[] };

    const searchResult = results.data.find((result) => result.ID === expiredStatus.offerId);

    expect([searchResult]).toStrictEqual([undefined]);
  });
}
