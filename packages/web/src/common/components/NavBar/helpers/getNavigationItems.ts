import { BRANDS } from '../../../types/brands.enum';
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

export const getNavigationItems = (brand: BRANDS, authenticated: boolean) => {
  switch (brand) {
    case BRANDS.BLC_UK:
      return authenticated ? AUTHENTICATED_NAVIGATION_UK : UNAUTHENTICATED_NAVIGATION_UK;
    case BRANDS.BLC_AU:
      return authenticated ? AUTHENTICATED_NAVIGATION_AUS : UNAUTHENTICATED_NAVIGATION_AUS;
    case BRANDS.DDS_UK:
      return authenticated ? AUTHENTICATED_NAVIGATION_DDS : UNAUTHENTICATED_NAVIGATION_DDS;
  }
};
