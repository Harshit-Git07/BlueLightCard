export class OfferRestriction {
  private readonly organisation: string;
  private readonly isUnder18: boolean;
  private dislikedCompanyIds: number[];

  isDealOfTheWeekRestricted: any;
  isFeaturedOfferRestricted: any;
  isFlexibleMenuItemRestricted: any;
  isMarketPlaceMenuItemRestricted: any;
  restrictOffers: any;

  constructor(organisation: string, isUnder18: boolean, dislikedCompanyIds: number[]) {
    this.organisation = organisation;
    this.isUnder18 = isUnder18;
    this.dislikedCompanyIds = dislikedCompanyIds;

    this.restrictOffers = this.createOfferRestrictionFactory();
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
