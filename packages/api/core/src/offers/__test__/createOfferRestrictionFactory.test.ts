import { OfferRestriction } from '../offerRestriction';

const offers = [
  {
    companynamy: 'JD Sports',
    offername: 'Get £10 off orders over £100!',
    image: 'https://cdn.bluelightcard.co.uk/offerimages/1694012844212.jpg',
    compid: 123,
    id: 1,
    agegate: 0,
    restrictedto: '',
    restrictedfrom: '',
  },
  {
    companyname: 'ASDA',
    offername: 'Get £20 off orders over £100!',
    image: 'https://cdn.bluelightcard.co.uk/offerimages/1694012844212.jpg',
    compid: '123',
    id: 2,
    agegate: 0,
    restrictedto: '',
    restrictedfrom: '',
  },
  {
    companyname: 'Farmhouse Inns',
    offername: 'Get £30 off orders over £100!',
    image: 'https://cdn.bluelightcard.co.uk/offerimages/1694012844212.jpg',
    compid: 34514,
    id: 3,
    agegate: 1,
    restrictedto: '',
    restrictedfrom: '',
  },
  {
    companyname: 'Look Fantastic',
    offername: 'Get £40 off orders over £100!',
    image: 'https://cdn.bluelightcard.co.uk/offerimages/1694012844212.jpg',
    compid: 35315,
    agegate: 0,
    restrictedto: '',
    restrictedfrom: 'NHS',
  },
  {
    companyname: 'Footasylum',
    offername: 'Get £50 off orders over £100!',
    image: 'https://cdn.bluelightcard.co.uk/offerimages/1694012844212.jpg',
    compid: 35313,
    agegate: 0,
    restrictedto: '',
    restrictedfrom: 'POLICE',
  },
];

describe('Test offer restrictions for featured', () => {
  it('should filter out age gated offers for users under 18 for featured', () => {
    const isUnder18 = true;
    const organisation = '';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isFeaturedOfferRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => !offer.agegate));
  });

  it('should filter out featured based on disliked companies', () => {
    const isUnder18 = false;
    const organisation = 'NHS';
    const dislikedCompanyIds: number[] = [35313];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isFeaturedOfferRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.compid !== 35313));
  });

  it('All offers should be displayed as no criteria for restrictions match', () => {
    const isUnder18 = false;
    const organisation = 'BBIKES';
    const dislikedCompanyIds: number[] = [30790];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isFeaturedOfferRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.compid !== 30790 || offer.agegate));
  });

  it('should filter out age gated offers for users under 18 for deals of the week', () => {
    const isUnder18 = true;
    const organisation = '';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isDealOfTheWeekRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => !offer.agegate));
  });

  it('should filter out deals based on disliked companies', () => {
    const isUnder18 = false;
    const organisation = 'NHS';
    const dislikedCompanyIds: number[] = [35313];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isDealOfTheWeekRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.compid !== 35313));
  });

  it('All offers should be displayed as no criteria for restrictions match', () => {
    const isUnder18 = false;
    const organisation = 'BBIKES';
    const dislikedCompanyIds: number[] = [30790];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isDealOfTheWeekRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.compid !== 30790 || offer.agegate));
  });

  it('should show offers that are restricted to a service for flexible', () => {
    const isUnder18 = true;
    const organisation = 'BBIKES';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});
    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isFlexibleMenuItemRestricted(offer));
    expect(filteredOffers).toEqual(offers);
  });

  it('should show offers that are restricted from a service for flexible', () => {
    const isUnder18 = false;
    const organisation = 'NHS';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});

    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isFlexibleMenuItemRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.restrictedfrom !== organisation));
  });

  it('should show offers that are restricted to agegating', () => {
    const isUnder18 = true;
    const organisation = 'BBIKES';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});
    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isMarketPlaceMenuItemRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => !offer.agegate));
  });

  it('should show offers that are restricted to restrictedFrom', () => {
    const isUnder18 = false;
    const organisation = 'POLICE';
    const dislikedCompanyIds: number[] = [];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});
    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isMarketPlaceMenuItemRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => offer.restrictedfrom != organisation));
  });

  it('should show offers that are restricted due to dislikes', () => {
    const isUnder18 = false;
    const organisation = 'POLICE';
    const dislikedCompanyIds: number[] = [35313];
    const restrictOffers = new OfferRestriction({organisation, isUnder18, dislikedCompanyIds});
    const filteredOffers = offers.filter((offer: any) => !restrictOffers.isMarketPlaceMenuItemRestricted(offer));
    expect(filteredOffers).toEqual(offers.filter((offer: any) => !dislikedCompanyIds.includes(offer.compid)));
  });
});
