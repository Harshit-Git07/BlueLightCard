import { MenusData } from '@bluelightcard/shared-ui';
import { transformFlexibleMenuDataForView } from '../transformFlexibleMenuDataForView';
import { OfferFlexibleModel } from '../../models/offer';
import { FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST } from '@bluelightcard/shared-ui/constants';

describe('transformFlexibleMenuDataForView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [undefined, []],
    [[], []],
  ])('when flexibleMenusData is %p, should return %p ', (input, expectedResult) => {
    const result = transformFlexibleMenuDataForView(input);
    expect(result).toEqual(expectedResult);
  });

  test('should map all the flexibleMenusData with titles from allowlist', () => {
    const mockFlexibleMenusData: MenusData['flexible'] = [
      {
        id: 'mockFlexibleMenusData01Id',
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
        menus: [
          {
            id: 'mockFlexibleMenuData01Id',
            title: 'mockFlexibleMenuData01Title',
            imageURL: 'mockFlexibleMenuData01ImageURL',
          },
        ],
      },
      {
        id: 'mockFlexibleMenusData02Id',
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1],
        menus: [
          {
            id: 'mockFlexibleMenuData02Id',
            title: 'mockFlexibleMenuData02Title',
            imageURL: 'mockFlexibleMenuData02ImageURL',
          },
        ],
      },
      {
        id: 'mockFlexibleMenusData03Id',
        title: 'mockFlexibleMenusData03Title',
        menus: [
          {
            id: 'mockFlexibleMenuData03Id',
            title: 'mockFlexibleMenuData03Title',
            imageURL: 'mockFlexibleMenuData03ImageURL',
          },
        ],
      },
    ];

    const expectedResult: OfferFlexibleModel[] = [
      {
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
        subtitle: '',
        random: true,
        items: [
          {
            footer: '',
            hide: false,
            id: 'mockFlexibleMenuData01Id',
            imagedetail: '',
            imagehome: 'mockFlexibleMenuData01ImageURL',
            intro: '',
            items: [],
            navtitle: '',
            random: true,
            title: 'mockFlexibleMenuData01Title',
          },
        ],
      },
      {
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1],
        subtitle: '',
        random: true,
        items: [
          {
            footer: '',
            hide: false,
            id: 'mockFlexibleMenuData02Id',
            imagedetail: '',
            imagehome: 'mockFlexibleMenuData02ImageURL',
            intro: '',
            items: [],
            navtitle: '',
            random: true,
            title: 'mockFlexibleMenuData02Title',
          },
        ],
      },
    ];

    const result = transformFlexibleMenuDataForView(mockFlexibleMenusData);

    expect(result).toEqual(expectedResult);
  });

  test('should ignore case when mapping flexibleMenusData', () => {
    const mockFlexibleMenusData: MenusData['flexible'] = [
      {
        id: 'mockFlexibleMenusData01Id',
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toUpperCase(),
        menus: [
          {
            id: 'mockFlexibleMenuData01Id',
            title: 'mockFlexibleMenuData01Title',
            imageURL: 'mockFlexibleMenuData01ImageURL',
          },
        ],
      },
      {
        id: 'mockFlexibleMenusData02Id',
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toLowerCase(),
        menus: [
          {
            id: 'mockFlexibleMenuData02Id',
            title: 'mockFlexibleMenuData02Title',
            imageURL: 'mockFlexibleMenuData02ImageURL',
          },
        ],
      },
    ];

    const expectedResult: OfferFlexibleModel[] = [
      {
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toUpperCase(),
        subtitle: '',
        random: true,
        items: [
          {
            footer: '',
            hide: false,
            id: 'mockFlexibleMenuData01Id',
            imagedetail: '',
            imagehome: 'mockFlexibleMenuData01ImageURL',
            intro: '',
            items: [],
            navtitle: '',
            random: true,
            title: 'mockFlexibleMenuData01Title',
          },
        ],
      },
      {
        title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toLowerCase(),
        subtitle: '',
        random: true,
        items: [
          {
            footer: '',
            hide: false,
            id: 'mockFlexibleMenuData02Id',
            imagedetail: '',
            imagehome: 'mockFlexibleMenuData02ImageURL',
            intro: '',
            items: [],
            navtitle: '',
            random: true,
            title: 'mockFlexibleMenuData02Title',
          },
        ],
      },
    ];

    const result = transformFlexibleMenuDataForView(mockFlexibleMenusData);

    expect(result).toEqual(expectedResult);
  });

  test("should NOT map flexibleMenusData that don't have child menus to display", () => {
    const mockFlexibleMenusDataWithoutChildMenusToDisplay: MenusData['flexible'] = [
      {
        id: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
        title: 'mockFlexibleMenusData03Title',
        menus: [],
      },
    ];

    const expectedResult: OfferFlexibleModel[] = [];

    const result = transformFlexibleMenuDataForView(
      mockFlexibleMenusDataWithoutChildMenusToDisplay,
    );

    expect(result).toEqual(expectedResult);
  });
});
