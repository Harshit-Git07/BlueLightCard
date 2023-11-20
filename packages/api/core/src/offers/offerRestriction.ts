import { OfferRestrictionParams } from "./offerRestrictionParams";

export class OfferRestriction {
  private readonly organisation: string | undefined;
  private readonly isUnder18: boolean | undefined;
  private dislikedCompanyIds: number[] | undefined;

  isBannerRestricted: any;
  isCompanyRestricted: any;
  isDealOfTheWeekRestricted: any;
  isFeaturedOfferRestricted: any;
  isFlexibleMenuItemRestricted: any;
  isMarketPlaceMenuItemRestricted: any;
  restrictOffers: any;

  public constructor(private params: OfferRestrictionParams) {
    ({
      organisation: this.organisation,
      isUnder18: this.isUnder18,
      dislikedCompanyIds: this.dislikedCompanyIds,
    } = this.params);

    this.restrictOffers = this.createOfferRestrictionFactory();

    this.isBannerRestricted = this.restrictOffers({
      ageGateKey: 'isAgeGated',
      legacyCompanyIdKey: 'legacyCompanyId',
    });

    this.isCompanyRestricted = this.restrictOffers({
      ageGateKey: 'isAgeGated',
      legacyCompanyIdKey: 'id',
    });

    this.isDealOfTheWeekRestricted = this.restrictOffers({
      ageGateKey: 'agegate',
      legacyCompanyIdKey: 'compid',
    });

    this.isFeaturedOfferRestricted = this.restrictOffers({
      ageGateKey: 'agegate',
      legacyCompanyIdKey: 'compid',
    });

    this.isFlexibleMenuItemRestricted = this.restrictOffers({
      legacyCompanyIdKey: 'cid',
      restrictedToKey: 'restrictedto',
      restrictedFromKey: 'restrictedfrom',
    });

    this.isMarketPlaceMenuItemRestricted = this.restrictOffers({
      ageGateKey: 'agegate',
      legacyCompanyIdKey: 'compid',
      restrictedToKey: 'restrictedto',
      restrictedFromKey: 'restrictedfrom',
    });
  }

  public createOfferRestrictionFactory() {
    return (keys: {
        ageGateKey?: string | any;
        legacyCompanyIdKey?: string | any;
        restrictedToKey?: string | any;
        restrictedFromKey?: string | any;
      }) =>
      (offer: any) => {
        const {
          [keys.ageGateKey]: isAgeGated = '',
          [keys.legacyCompanyIdKey]: legacyCompanyId = '',
          [keys.restrictedToKey]: restrictedTo = '',
          [keys.restrictedFromKey]: restrictedFrom = '',
        } = offer;

        // Check if offer has:
        const restrictionConditions = [
          // An age gate and they are under 18
          isAgeGated && this.isUnder18,
          // A restriction to an organisation and they are not in that restriction list
          restrictedTo && restrictedTo !== '0' && restrictedTo.indexOf(this.organisation) === -1,
          // A restriction from an organisation and they are in that restriction list
          restrictedFrom && restrictedFrom !== '0' && restrictedFrom.indexOf(this.organisation) !== -1,
          // A list of disliked companies and the offer company ID is in that list
          legacyCompanyId && this.dislikedCompanyIds?.includes(parseInt(legacyCompanyId, 10)),
        ];

        for (const condition of restrictionConditions) {
          if (condition) {
            return true;
          }
        }

        return false;
      };
  }
}
