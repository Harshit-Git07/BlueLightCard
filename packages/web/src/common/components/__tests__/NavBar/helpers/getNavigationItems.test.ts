import { BRANDS } from '@/root/src/common/types/brands.enum';
import {
  AUTHENTICATED_NAVIGATION_UK,
  UNAUTHENTICATED_NAVIGATION_UK,
} from '../../../NavBar/constants/ukNavigation';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../../../NavBar/constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../../../NavBar/constants/ddsNavigation';
import { getNavigationItems } from '../../../NavBar/helpers/getNavigationItems';
import { NavigationItem } from '@/components/NavBar/types';

const isZendeskV1BlcUkEnabled = true;

const navigationScenarios = [
  {
    authenticated: true,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_UK,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_UK,
  },
  {
    authenticated: true,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: true,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_DDS,
  },
  {
    authenticated: false,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_DDS,
  },
];

describe('getNavigationItems', () => {
  it.each(navigationScenarios)(
    'should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb'
      );
      expect(getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled)).toStrictEqual(
        updatedList
      );
    }
  );
});

describe('getNavigationItemsZendeskFalse', () => {
  it.each(navigationScenarios)(
    'should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        '/contactblc.php'
      );
      expect(getNavigationItems(brand, authenticated, false)).toStrictEqual(updatedList);
    }
  );
});

function UpdateNavigationList(
  expectedNavigationItems: NavigationItem[],
  authenticated: boolean,
  brand: BRANDS,
  url: string
) {
  const updatedList = expectedNavigationItems;
  //This is only due to us knowing exactly which item should change without having to duplicate the nav items
  if (updatedList[4]?.id == 'faq' && authenticated && brand == BRANDS.BLC_UK) {
    updatedList[4].url = url;
  }
  return updatedList;
}
