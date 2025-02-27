import * as Factory from 'factory.ts';

import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';

import { EventOffer, EventStatus, EventType, Offer, OfferStatus, OfferType } from '../models/Offer';

import { boostFactory } from './BoostFactory';
import { categoryFactory } from './CategoryFactory';
import { discountFactory } from './DiscountFactory';
import { venueFactory } from './VenueFactory';

export const offerFactory = Factory.Sync.makeFactory<Offer>({
  id: Factory.each((i) => (i + 1).toString()),
  legacyOfferId: 101,
  name: 'Sample Offer',
  status: OfferStatus.LIVE,
  offerType: OfferType.ONLINE,
  offerDescription: 'Sample offer description',
  image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
  offerStart: '2024-09-01',
  offerEnd: '2024-09-30',
  evergreen: false,
  tags: ['tag1', 'tag2'],
  includedTrusts: [],
  excludedTrusts: [],
  company: companyFactory.build(),
  categories: [categoryFactory.build()],
  local: false,
  discount: discountFactory.build(),
  commonExclusions: ['none'],
  boost: boostFactory.build(),
  updatedAt: '2024-09-01T00:00:00',
});

export const eventFactory = Factory.Sync.makeFactory<EventOffer>({
  id: Factory.each((i) => (i + 1).toString()),
  name: 'Sample event',
  status: EventStatus.LIVE,
  offerType: EventType.TICKET,
  eventDescription: 'Sample event description',
  image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
  offerStart: '2024-09-01',
  offerEnd: '2024-09-30',
  includedTrusts: [],
  excludedTrusts: [],
  categories: [categoryFactory.build()],
  updatedAt: '2024-09-01T00:00:00',
  venue: venueFactory.build(),
  redemption: {
    drawDate: '2024-09-01',
    numberOfWinners: 20,
    type: 'Ballot',
  },
  ticketFaceValue: '£20',
  guestlistCompleteByDate: '2024-09-01T00:00:00',
  ageRestrictions: '20+',
});
