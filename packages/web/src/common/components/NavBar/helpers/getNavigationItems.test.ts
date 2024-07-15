import { BRANDS } from '../../../types/brands.enum';
import { getNavigationItems } from './getNavigationItems';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../constants/ddsNavigation';
import {
  AUTHENTICATED_NAVIGATION_UK,
  UNAUTHENTICATED_NAVIGATION_UK,
} from '../constants/ukNavigation';

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
      expect(getNavigationItems(brand, authenticated)).toStrictEqual(expectedNavigationItems);
    }
  );
});
