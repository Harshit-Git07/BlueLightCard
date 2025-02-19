import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { IPlatformAdapter, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import useOffers from '@/hooks/useOffers';

const renderWithHydratedAtoms = (mockPlatformAdapter: IPlatformAdapter, atomValues: any[] = []) => {
  return renderHook(() => {
    useHydrateAtoms(atomValues);

    return useOffers(mockPlatformAdapter);
  });
};

describe('useOffers', () => {
  it('returns the correct initial state', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    const state = renderWithHydratedAtoms(mockPlatformAdapter);

    expect(state.result.current).toMatchObject({
      getOfferPromos: expect.any(Function),
      offerPromos: {
        deal: [],
        groups: [],
      },
    });
  });

  it('executes V4 offer promos request', async () => {
    const requestMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestDataAsync')
      .mockResolvedValue({
        success: true,
        data: v4Response,
      });

    const mockPlatformAdapter = useMockPlatformAdapter();
    const state = renderWithHydratedAtoms(mockPlatformAdapter);

    await act(async () => {
      await state.result.current.getOfferPromos();
    });

    expect(requestMock).toHaveBeenCalledWith('/api/4/offer/promos_new.php');
    expect(state.result.current.offerPromos.deal).toEqual(v4Response.deal);
    expect(state.result.current.offerPromos.groups).toEqual(v4Response.groups);
    expect(state.result.current.offerPromos.flexible).toEqual(v4Response.flexible);
  });

  describe('searchV5 experiment', () => {
    let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;
    let state: RenderHookResult<any, any>;

    beforeEach(() => {
      mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: mockV5Response,
      });

      state = renderWithHydratedAtoms(mockPlatformAdapter, []);
    });

    it('executes V5 menu data request with legacy IDs', async () => {
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockImplementation((flag: string) => {
        if (flag === FeatureFlags.MODERN_FLEXI_MENU_HYBRID) {
          return 'on';
        } else if (flag === FeatureFlags.CMS_OFFERS) {
          return 'off';
        }
        return 'off';
      });

      await act(async () => {
        await state.result.current.getOfferPromos();
      });

      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/eu/discovery/menus', {
        method: 'GET',
        cachePolicy: 'auto',
      });
      expect(state.result.current.offerPromos.deal).toEqual([
        {
          title: 'Deals of the Week',
          random: true,
          items: [
            {
              id: 1,
              compid: 100,
              companyname: 'Test Company 1',
              offername: 'Test Offer 1',
              logos: 'image-1',
              absoluteLogos: 'image-1',
              image: 'image-1',
              s3Image: 'image-1',
              s3logos: 'image-1',
              absoluteImage: 'image-1',
            },
            {
              id: 2,
              compid: 200,
              companyname: 'Test Company 2',
              offername: 'Test Offer 2',
              logos: 'image-2',
              absoluteLogos: 'image-2',
              image: 'image-2',
              s3Image: 'image-2',
              s3logos: 'image-2',
              absoluteImage: 'image-2',
            },
          ],
        },
      ]);
      expect(state.result.current.offerPromos.groups).toEqual([
        {
          title: 'Marketplace Menu 1',
          random: true,
          items: [
            {
              id: 1,
              compid: 100,
              companyname: 'Test Company 1',
              offername: 'Test Offer 1',
              logos: 'image-1',
              absoluteLogos: 'image-1',
              image: 'image-1',
              s3Image: 'image-1',
              s3logos: 'image-1',
              absoluteImage: 'image-1',
            },
            {
              id: 2,
              compid: 200,
              companyname: 'Test Company 2',
              offername: 'Test Offer 2',
              logos: 'image-2',
              absoluteLogos: 'image-2',
              image: 'image-2',
              s3Image: 'image-2',
              s3logos: 'image-2',
              absoluteImage: 'image-2',
            },
          ],
        },
        {
          title: 'Featured Offers',
          random: true,
          items: [
            {
              id: 3,
              compid: 300,
              companyname: 'Test Company 3',
              offername: 'Test Offer 3',
              logos: 'image-3',
              absoluteLogos: 'image-3',
              image: 'image-3',
              s3Image: 'image-3',
              s3logos: 'image-3',
              absoluteImage: 'image-3',
            },
            {
              id: 4,
              compid: 400,
              companyname: 'Test Company 4',
              offername: 'Test Offer 4',
              logos: 'image-4',
              absoluteLogos: 'image-4',
              image: 'image-4',
              s3Image: 'image-4',
              s3logos: 'image-4',
              absoluteImage: 'image-4',
            },
          ],
        },
      ]);
      expect(state.result.current.offerPromos.flexible).toEqual({
        title: 'Flexible Menu 1',
        subtitle: '',
        random: true,
        items: [
          {
            id: 'flexible-item-1',
            title: 'Flexible Item 1',
            imagehome: 'image-1',
            imagedetail: 'image-1',
            navtitle: '',
            intro: '',
            footer: '',
            random: true,
            hide: false,
            items: [],
          },
        ],
      });
      expect(state.result.current.offerPromos.flexibleEvents).toEqual({
        title: 'Flexible Event Menu 1',
        subtitle: '',
        random: true,
        items: [
          {
            id: 'flexible-event-1',
            title: 'Flexible Event 1',
            imagehome: 'image-2',
            imagedetail: 'image-2',
            navtitle: '',
            intro: '',
            footer: '',
            random: true,
            hide: false,
            items: [],
          },
        ],
      });
    });

    it('executes V5 menu data request with modern IDs', async () => {
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockImplementation((flag: string) => {
        if (flag === FeatureFlags.MODERN_FLEXI_MENU_HYBRID) {
          return 'on';
        } else if (flag === FeatureFlags.CMS_OFFERS) {
          return 'on';
        }
        return 'off';
      });

      const state = renderWithHydratedAtoms(mockPlatformAdapter, []);

      await act(async () => {
        await state.result.current.getOfferPromos();
      });

      expect(state.result.current.offerPromos.deal).toEqual([
        {
          title: 'Deals of the Week',
          random: true,
          items: [
            {
              id: 'test-offer-id-1',
              compid: 'test-company-id-1',
              companyname: 'Test Company 1',
              offername: 'Test Offer 1',
              logos: 'image-1',
              absoluteLogos: 'image-1',
              image: 'image-1',
              s3Image: 'image-1',
              s3logos: 'image-1',
              absoluteImage: 'image-1',
            },
            {
              id: 'test-offer-id-2',
              compid: 'test-company-id-2',
              companyname: 'Test Company 2',
              offername: 'Test Offer 2',
              logos: 'image-2',
              absoluteLogos: 'image-2',
              image: 'image-2',
              s3Image: 'image-2',
              s3logos: 'image-2',
              absoluteImage: 'image-2',
            },
          ],
        },
      ]);
      expect(state.result.current.offerPromos.groups).toEqual([
        {
          title: 'Marketplace Menu 1',
          random: true,
          items: [
            {
              id: 'test-offer-id-1',
              compid: 'test-company-id-1',
              companyname: 'Test Company 1',
              offername: 'Test Offer 1',
              logos: 'image-1',
              absoluteLogos: 'image-1',
              image: 'image-1',
              s3Image: 'image-1',
              s3logos: 'image-1',
              absoluteImage: 'image-1',
            },
            {
              id: 'test-offer-id-2',
              compid: 'test-company-id-2',
              companyname: 'Test Company 2',
              offername: 'Test Offer 2',
              logos: 'image-2',
              absoluteLogos: 'image-2',
              image: 'image-2',
              s3Image: 'image-2',
              s3logos: 'image-2',
              absoluteImage: 'image-2',
            },
          ],
        },
        {
          title: 'Featured Offers',
          random: true,
          items: [
            {
              id: 'test-offer-id-3',
              compid: 'test-company-id-3',
              companyname: 'Test Company 3',
              offername: 'Test Offer 3',
              logos: 'image-3',
              absoluteLogos: 'image-3',
              image: 'image-3',
              s3Image: 'image-3',
              s3logos: 'image-3',
              absoluteImage: 'image-3',
            },
            {
              id: 'test-offer-id-4',
              compid: 'test-company-id-4',
              companyname: 'Test Company 4',
              offername: 'Test Offer 4',
              logos: 'image-4',
              absoluteLogos: 'image-4',
              image: 'image-4',
              s3Image: 'image-4',
              s3logos: 'image-4',
              absoluteImage: 'image-4',
            },
          ],
        },
      ]);
    });
  });
});

const v4Response = {
  deal: [
    {
      title: 'Test Deal of the Week',
      random: true,
      items: [
        {
          id: 1,
          offername: 'Test Offer 1',
          companyname: 'Test Company Name 1',
          compid: 1,
          logos: 's3-logo-1.jpg',
          s3Image: 's3-image-1.jpg',
          s3logos: 's3-logo-1.jpg',
          absoluteLogos: 's3-logo-1.jpg',
          absoluteImage: 'absolute-image-1.jpg',
        },
      ],
    },
  ],
  groups: [
    {
      title: 'Marketplace 1',
      random: true,
      items: [
        {
          id: 2,
          offername: 'Test Offer 2',
          companyname: 'Test Company Name 2',
          compid: 2,
          logos: 's3-logo-2.jpg',
          s3Image: 's3-image-2.jpg',
          s3logos: 's3-logo-2.jpg',
          absoluteLogos: 's3-logo-2.jpg',
          absoluteImage: 'absolute-image-2.jpg',
        },
      ],
    },
  ],
  flexible: {
    title: 'Flexible Menu',
    subtitle: 'Flexible Menu Subtitle',
    random: true,
    items: [
      {
        id: 3,
        title: 'Flexible Item 3',
        imagehome: 's3-image-3.jpg',
        imagedetail: 's3-image-3.jpg',
        navtitle: 'Flexible Item 3 Nav Title',
        intro: 'Flexible Item 3 Intro',
        footer: 'Flexible Item 3 Footer',
        random: true,
        hide: false,
        items: [],
      },
    ],
  },
};

const mockV5Response = {
  dealsOfTheWeek: {
    id: 'deals-of-the-week',
    offers: [
      {
        offerID: 'test-offer-id-1',
        companyID: 'test-company-id-1',
        legacyOfferID: 1,
        legacyCompanyID: 100,
        offerName: 'Test Offer 1',
        companyName: 'Test Company 1',
        imageURL: 'image-1',
      },
      {
        offerID: 'test-offer-id-2',
        companyID: 'test-company-id-2',
        legacyOfferID: 2,
        legacyCompanyID: 200,
        offerName: 'Test Offer 2',
        companyName: 'Test Company 2',
        imageURL: 'image-2',
      },
    ],
  },
  marketplace: [
    {
      id: 'marketplace-menu-1',
      title: 'Marketplace Menu 1',
      description: 'Marketplace Menu 1 Description',
      hidden: false,
      offers: [
        {
          offerID: 'test-offer-id-1',
          companyID: 'test-company-id-1',
          legacyOfferID: 1,
          legacyCompanyID: 100,
          offerName: 'Test Offer 1',
          companyName: 'Test Company 1',
          imageURL: 'image-1',
        },
        {
          offerID: 'test-offer-id-2',
          companyID: 'test-company-id-2',
          legacyOfferID: 2,
          legacyCompanyID: 200,
          offerName: 'Test Offer 2',
          companyName: 'Test Company 2',
          imageURL: 'image-2',
        },
      ],
    },
  ],
  featured: {
    id: 'featured-offers-menu',
    offers: [
      {
        offerID: 'test-offer-id-3',
        companyID: 'test-company-id-3',
        legacyOfferID: 3,
        legacyCompanyID: 300,
        offerName: 'Test Offer 3',
        companyName: 'Test Company 3',
        imageURL: 'image-3',
      },
      {
        offerID: 'test-offer-id-4',
        companyID: 'test-company-id-4',
        legacyOfferID: 4,
        legacyCompanyID: 400,
        offerName: 'Test Offer 4',
        companyName: 'Test Company 4',
        imageURL: 'image-4',
      },
    ],
  },
  flexible: {
    offers: [
      {
        id: 'flexible-menu-1',
        title: 'Flexible Menu 1',
        menus: [
          {
            id: 'flexible-item-1',
            title: 'Flexible Item 1',
            imageURL: 'image-1',
          },
        ],
      },
    ],
    events: [
      {
        id: 'flexible-event-menu-1',
        title: 'Flexible Event Menu 1',
        menus: [
          {
            id: 'flexible-event-1',
            title: 'Flexible Event 1',
            imageURL: 'image-2',
          },
        ],
      },
    ],
  },
};
