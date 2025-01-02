import { addMonths, subMonths } from 'date-fns';

import { eventFactory, offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { EventStatus, OfferStatus } from '@blc-mono/discovery/application/models/Offer';

import { isActiveEventOffer, isActiveOffer } from './activeOfferRules';

describe('isActiveOffer', () => {
  it('should return false if offer status is not "live"', () => {
    const offer = offerFactory.build({ status: OfferStatus.EXPIRED });

    const result = isActiveOffer(offer);

    expect(result).toEqual(false);
  });

  it('should return false if event offer status is not "live"', () => {
    const event = eventFactory.build({ status: EventStatus.EXPIRED });

    const result = isActiveEventOffer(event);

    expect(result).toEqual(false);
  });

  describe('and offer status is "live"', () => {
    it('should return true if offer is evergreen', () => {
      const offer = offerFactory.build({ status: OfferStatus.LIVE, evergreen: true });

      const result = isActiveOffer(offer);

      expect(result).toEqual(true);
    });

    describe('and offer is not evergeeen', () => {
      it('should return true if no offer start date or offer end date', () => {
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: undefined,
          offerEnd: undefined,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(true);
      });

      it('should return true if event offer guestlist completed by date and start date is in the future', () => {
        const event = eventFactory.build({
          guestlistCompleteByDate: addMonths(new Date(), 1).toISOString(),
          offerStart: addMonths(new Date(), 2).toISOString(),
        });

        const result = isActiveEventOffer(event);

        expect(result).toEqual(true);
      });

      it('should return false if event offer guestlist completed by date is in the past', () => {
        const event = eventFactory.build({
          guestlistCompleteByDate: subMonths(new Date(), 1).toISOString(),
          offerStart: addMonths(new Date(), 2).toISOString(),
        });

        const result = isActiveEventOffer(event);

        expect(result).toEqual(false);
      });

      it('should return false if event offer starte date is in the past', () => {
        const event = eventFactory.build({
          guestlistCompleteByDate: addMonths(new Date(), 1).toISOString(),
          offerStart: subMonths(new Date(), 1).toISOString(),
        });

        const result = isActiveEventOffer(event);

        expect(result).toEqual(false);
      });

      it('should return true if offer is start date in the past and end date in the future', () => {
        const pastStartDate = subMonths(new Date(), 3).toISOString();
        const futureEndDate = addMonths(new Date(), 1).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: pastStartDate,
          offerEnd: futureEndDate,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(true);
      });

      it('should return false if offer start date is in the future', () => {
        const futureStartDate = addMonths(new Date(), 1).toISOString();
        const futureEndDate = addMonths(new Date(), 2).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: futureStartDate,
          offerEnd: futureEndDate,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(false);
      });

      it('should return false if offer end date is in the past', () => {
        const pastStartDate = subMonths(new Date(), 3).toISOString();
        const pastEndDate = subMonths(new Date(), 1).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: pastStartDate,
          offerEnd: pastEndDate,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(false);
      });

      it('should return true if offer is start date in the past and end date is undefined', () => {
        const pastStartDate = subMonths(new Date(), 3).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: pastStartDate,
          offerEnd: undefined,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(true);
      });

      it('should return false if offer is start date in the future and end date is undefined', () => {
        const futureStartDate = addMonths(new Date(), 3).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: futureStartDate,
          offerEnd: undefined,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(false);
      });

      it('should return true if offer is start date is undefined and end date is in the future', () => {
        const futureEndDate = addMonths(new Date(), 1).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: undefined,
          offerEnd: futureEndDate,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(true);
      });

      it('should return false if offer is start date is undefined and end date is in the past', () => {
        const pastEndDate = subMonths(new Date(), 1).toISOString();
        const offer = offerFactory.build({
          status: OfferStatus.LIVE,
          evergreen: false,
          offerStart: undefined,
          offerEnd: pastEndDate,
        });

        const result = isActiveOffer(offer);

        expect(result).toEqual(false);
      });
    });
  });
});
