import { FlexibleMenusData, MenusData, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { transformFlexibleMenuDataForView } from '../transformFlexibleMenuDataForView';
import { cleanText } from '../../../../../shared-ui/src/utils/cleanText';
import { FlexibleMenusDataTransformedForView } from '../../page-types/members-home';
import { FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST } from '../../../../../shared-ui/src/constants';

let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;
jest.mock('../../../../../shared-ui/src/utils/cleanText');

describe('transformFlexibleMenuDataForView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  mockPlatformAdapter = useMockPlatformAdapter();

  describe('when "enable all flexible menus" feature flag is active', () => {
    beforeEach(() => {
      const activeFeatureFlagValue = 'on';
      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue(activeFeatureFlagValue);
      (cleanText as jest.Mock).mockImplementation((text) => text);
    });

    test.each([
      [undefined, []],
      [[], []],
    ])('if flexibleMenusData is %p, should return %p ', (input, expectedResult) => {
      const result = transformFlexibleMenuDataForView(input, mockPlatformAdapter);
      expect(result).toEqual(expectedResult);
    });

    test('should map all the flexibleMenusData with titles from allowlist', () => {
      const mockFlexibleMenusData: MenusData['flexible'] = [
        {
          id: 'mockFlexibleMenusData01Id',
          title: 'mockFlexibleMenusData01Title',
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
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
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
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1],
          menus: [
            {
              id: 'mockFlexibleMenuData03Id',
              title: 'mockFlexibleMenuData03Title',
              imageURL: 'mockFlexibleMenuData03ImageURL',
            },
          ],
        },
      ];

      const expectedResult: FlexibleMenusDataTransformedForView = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
          menus: [
            {
              href: `/flexible-offers?id=mockFlexibleMenuData02Id`,
              imageUrl: 'mockFlexibleMenuData02ImageURL',
              offerId: 'mockFlexibleMenuData02Id',
              offername: 'mockFlexibleMenuData02Title',
            },
          ],
        },
        {
          id: 'mockFlexibleMenusData03Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1],
          menus: [
            {
              href: `/flexible-offers?id=mockFlexibleMenuData03Id`,
              imageUrl: 'mockFlexibleMenuData03ImageURL',
              offerId: 'mockFlexibleMenuData03Id',
              offername: 'mockFlexibleMenuData03Title',
            },
          ],
        },
      ];

      const result = transformFlexibleMenuDataForView(mockFlexibleMenusData, mockPlatformAdapter);

      expect(result).toEqual(expectedResult);
    });

    test('should order flexibleMenusData according to allowlist order and ignore case of flexibleMenusData titles', () => {
      const mockFlexibleMenusData: MenusData['flexible'] = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toUpperCase(),
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
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toLowerCase(),
          menus: [
            {
              id: 'mockFlexibleMenuData03Id',
              title: 'mockFlexibleMenuData03Title',
              imageURL: 'mockFlexibleMenuData03ImageURL',
            },
          ],
        },
      ];

      const result = transformFlexibleMenuDataForView(mockFlexibleMenusData, mockPlatformAdapter);

      expect(result[0].title).toEqual(FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toLowerCase());
      expect(result[1].title).toEqual(FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toUpperCase());
    });
    test('should ignore case when mapping flexibleMenusData', () => {
      const mockFlexibleMenusData: MenusData['flexible'] = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toUpperCase(),
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
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toLowerCase(),
          menus: [
            {
              id: 'mockFlexibleMenuData03Id',
              title: 'mockFlexibleMenuData03Title',
              imageURL: 'mockFlexibleMenuData03ImageURL',
            },
          ],
        },
      ];

      const expectedResult: FlexibleMenusDataTransformedForView = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0].toUpperCase(),
          menus: [
            {
              href: `/flexible-offers?id=mockFlexibleMenuData02Id`,
              imageUrl: 'mockFlexibleMenuData02ImageURL',
              offerId: 'mockFlexibleMenuData02Id',
              offername: 'mockFlexibleMenuData02Title',
            },
          ],
        },
        {
          id: 'mockFlexibleMenusData03Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[1].toLowerCase(),
          menus: [
            {
              href: `/flexible-offers?id=mockFlexibleMenuData03Id`,
              imageUrl: 'mockFlexibleMenuData03ImageURL',
              offerId: 'mockFlexibleMenuData03Id',
              offername: 'mockFlexibleMenuData03Title',
            },
          ],
        },
      ];

      const result = transformFlexibleMenuDataForView(mockFlexibleMenusData, mockPlatformAdapter);

      expect(result).toEqual(expectedResult);
    });

    test("should NOT map flexibleMenusData that don't have child menus to display", () => {
      const mockFlexibleMenusData: MenusData['flexible'] = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
          menus: [],
        },
      ];

      const expectedResult: FlexibleMenusDataTransformedForView = [];

      const result = transformFlexibleMenuDataForView(mockFlexibleMenusData, mockPlatformAdapter);

      expect(result).toEqual(expectedResult);
    });

    test('should clean offer name text strings', () => {
      const mockFlexibleMenusData: MenusData['flexible'] = [
        {
          id: 'mockFlexibleMenusData02Id',
          title: FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST[0],
          menus: [
            {
              id: 'mockFlexibleMenuData02Id',
              title: 'mockFlexibleMenuData02Title',
              imageURL: 'mockFlexibleMenuData02ImageURL',
            },
          ],
        },
      ];

      transformFlexibleMenuDataForView(mockFlexibleMenusData, mockPlatformAdapter);

      expect(cleanText).toHaveBeenNthCalledWith(1, 'mockFlexibleMenuData02Title');
    });
  });

  describe('when "enable all flexible menus" feature flag is inactive', () => {
    beforeEach(() => {
      const activeFeatureFlagValue = 'off';
      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue(activeFeatureFlagValue);
    });

    test.each([
      [undefined, []],
      [[], []],
      [[{ mock: 'data' }] as unknown as FlexibleMenusData[], []],
    ])('if flexibleMenusData is %p, should return %p', (input, expected) => {
      const result = transformFlexibleMenuDataForView(input, mockPlatformAdapter);
      expect(result).toEqual(expected);
    });
  });
});
