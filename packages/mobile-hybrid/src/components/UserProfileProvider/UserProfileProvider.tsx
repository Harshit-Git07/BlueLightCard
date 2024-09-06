import { FC, PropsWithChildren, useEffect } from 'react';
import { userProfile } from './store';
import { useSetAtom, useAtomValue } from 'jotai';
import { APIUrl, V5_API_URL } from '@/globals';
import { usePlatformAdapter } from '@bluelightcard/shared-ui';
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await platformAdapter.invokeV5Api(V5_API_URL.User, {
          method: 'GET',
          queryParameters: {},
          cachePolicy: 'auto',
        });

        const userProfileData = JSON.parse(userProfileResponse.data).data;
        if (!userProfileData) throw new Error('Empty user profile response received');

        const userProfileParsed = {
          ...userProfileData.profile,
          uuid: userProfileData.uuid,
          canRedeemOffer: userProfileData.canRedeemOffer,
          service: userServiceValue,
          isAgeGated: !isUnder18(userProfileData.profile.dob),
        };
        setUserProfile(userProfileParsed);
      } catch (err) {
        console.error('Error requesting user profile', err);
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

    fetchUserProfile();
    fetchUserService();
  }, [platformAdapter, setUserProfile, userServiceValue, amplitudeExperiments]);

  return children;
};

export default UserProfileProvider;
