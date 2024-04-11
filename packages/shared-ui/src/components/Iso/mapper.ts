import { PlatformVariant } from '../../types';

export interface Profile {
  dob: string | null;
  gender: string | null;
  mobile: string | null;
}

export interface UserProfileMobile {
  message: string;
  success: boolean;
  data?: Profile;
}

export interface UserProfileDesktop {
  message: string;
  data?: {
    profile: Profile;
  };
}

export const mapping = {
  [PlatformVariant.Mobile]: (apiResponse?: UserProfileMobile): Profile => {
    return {
      dob: apiResponse?.data?.dob ?? null,
      gender: apiResponse?.data?.gender ?? null,
      mobile: apiResponse?.data?.mobile ?? null,
    };
  },
  [PlatformVariant.Desktop]: (apiResponse?: UserProfileDesktop): Profile => {
    return {
      dob: apiResponse?.data?.profile?.dob ?? null,
      gender: apiResponse?.data?.profile?.gender ?? null,
      mobile: apiResponse?.data?.profile?.mobile ?? null,
    };
  },
};
