import { UserProfile } from '../services/UserProfile';

/**
 * Retrieve the service parameter for the user, if the user has an organisation.
 * 
 * @param authToken - The authentication token for the user.
 * @returns A string in the format "&service=<service name>" if the user has an organisation, otherwise "&service=".
 */
export async function getServiceParams(authToken: string): Promise<string> {
  let serviceParams = '';

  const userProfile = new UserProfile(authToken);
  const userProfileData = await userProfile.getUserProfileRequest();
  if(userProfileData?.data?.data?.profile?.organisation) {
    serviceParams = `&service=${userProfileData.data.data.profile.organisation}`; 
  } else {
    // Api's that use this function handle a blank service param differently to it not being present at all
    serviceParams = `&service=`;
  }

  return serviceParams;
}