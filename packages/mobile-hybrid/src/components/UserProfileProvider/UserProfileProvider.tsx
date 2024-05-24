import { FC, PropsWithChildren, useEffect } from 'react';
import { userProfile } from './store';
import { useSetAtom, useAtomValue } from 'jotai';
import { APIUrl, V5_API_URL } from '@/globals';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { isUnder18 } from '@bluelightcard/shared-ui';
import InvokeNativeAPICall from '@/invoke/apiCall';
import useUserService from '@/hooks/useUserService';

const invokeNativeAPICall = new InvokeNativeAPICall();

const UserProfileProvider: FC<PropsWithChildren> = ({ children }) => {
  const platformAdapter = usePlatformAdapter();
  const setUserProfile = useSetAtom(userProfile);
  const amplitudeExperiments = useAtomValue(experimentsAndFeatureFlags);
  const userServiceValue = useUserService();
  const v5ApiFeatureFlag = amplitudeExperiments[FeatureFlags.V5_API_INTEGRATION] === 'on';
  const categorySearchExperiment =
    amplitudeExperiments[Experiments.CATEGORY_LEVEL_THREE_SEARCH] === 'treatment';
  const categorySearchExperimentEnabled = v5ApiFeatureFlag && categorySearchExperiment;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfileResponse = await platformAdapter.invokeV5Api(V5_API_URL.User, {
        method: 'GET',
        queryParameters: {},
        cachePolicy: 'auto',
      });
      if (userProfileResponse) {
        const userProfileData = JSON.parse(userProfileResponse.data).data;
        if (userProfileData) {
          const userProfileParsed = {
            ...userProfileData.profile,
            service: userServiceValue,
            isAgeGated: !isUnder18(userProfileData.profile.dob),
          };
          setUserProfile(userProfileParsed);
        }
      }
    };

    const fetchUserService = async () => {
      invokeNativeAPICall.requestData(APIUrl.UserService);
      if (userServiceValue) {
        setUserProfile({
          ...userProfile,
          service: userServiceValue,
        });
      }
    };

    if (categorySearchExperimentEnabled) {
      fetchUserProfile();
    }

    fetchUserService();
  }, [categorySearchExperimentEnabled, platformAdapter, setUserProfile, userServiceValue]);

  return children;
};

export default UserProfileProvider;
