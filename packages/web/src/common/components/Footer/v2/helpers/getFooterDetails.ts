import { BRANDS } from '../../../../types/brands.enum';
import {
  AUS_FOOTER_CONFIG_AUTHENTICATED,
  AUS_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../constants/ausFooterConfig';
import {
  DDS_FOOTER_CONFIG_AUTHENTICATED,
  DDS_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../constants/ddsFooterConfig';
import {
  UK_FOOTER_CONFIG_AUTHENTICATED,
  UK_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../constants/ukFooterConfig';

export const getFooterDetails = (brand: BRANDS, isAuthenticated: boolean) => {
  switch (brand) {
    case BRANDS.BLC_UK:
      return isAuthenticated ? UK_FOOTER_CONFIG_AUTHENTICATED : UK_FOOTER_CONFIG_UNAUTHENTICATED;

    case BRANDS.BLC_AU:
      return isAuthenticated ? AUS_FOOTER_CONFIG_AUTHENTICATED : AUS_FOOTER_CONFIG_UNAUTHENTICATED;

    case BRANDS.DDS_UK:
      return isAuthenticated ? DDS_FOOTER_CONFIG_AUTHENTICATED : DDS_FOOTER_CONFIG_UNAUTHENTICATED;
  }
};
