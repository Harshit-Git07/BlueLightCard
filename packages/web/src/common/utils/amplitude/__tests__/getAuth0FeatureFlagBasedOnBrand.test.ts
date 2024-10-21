import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';

describe('getAuth0FeatureFlagBasedOnBrand', () => {
  it('should return correct flag for BLC_AU brand', () => {
    expect(getAuth0FeatureFlagBasedOnBrand('blc-au')).toBe(
      AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_BLC_AU
    );
  });

  it('should return correct flag for DDS_UK brand', () => {
    expect(getAuth0FeatureFlagBasedOnBrand('dds-uk')).toBe(
      AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_DDS_UK
    );
  });

  it('should return correct flag for BLC_UK brand', () => {
    expect(getAuth0FeatureFlagBasedOnBrand('blc-uk')).toBe(
      AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_BLC_UK
    );
  });

  it('should return correct flag for default brand', () => {
    expect(getAuth0FeatureFlagBasedOnBrand('default')).toBe(
      AmplitudeExperimentFlags.ENABLE_AUTH0_LOGIN_LOGOUT_WEB_BLC_UK
    );
  });
});
