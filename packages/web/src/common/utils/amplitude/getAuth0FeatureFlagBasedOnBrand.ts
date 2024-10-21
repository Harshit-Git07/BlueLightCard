import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { BRANDS } from '@/types/brands.enum';

export const getAuth0FeatureFlagBasedOnBrand = (brand: string) => {
  switch (brand) {
    case BRANDS.BLC_AU:
      return AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_BLC_AU;
    case BRANDS.DDS_UK:
      return AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_DDS_UK;
    case BRANDS.BLC_UK:
    default:
      return AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_BLC_UK;
  }
};
