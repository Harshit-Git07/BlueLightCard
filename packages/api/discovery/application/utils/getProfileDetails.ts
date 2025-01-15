import { format, subYears } from 'date-fns';

import { OrganisationService } from '@blc-mono/members/application/services/organisationService';
import { ProfileService } from '@blc-mono/members/application/services/profileService';

const profileService = new ProfileService();
const organisationService = new OrganisationService();

/**
 * Get user details from the new members service - to be used Phase 2 once release of auth0
 * Lightweight wrapper for discovery stack to retrieve user details using member service
 * @param memberId
 * @returns
 */
export const getProfileDetails = async (memberId: string) => {
  const profileDetails = await profileService.getProfile(memberId);

  if (!profileDetails) return;
  const organisationName = profileDetails.organisationId
    ? await organisationService.getOrganisation(profileDetails.organisationId)
    : undefined;
  if (!profileDetails.dateOfBirth) {
    return {
      organisation: organisationName?.name,
      dob: format(subYears(new Date(), 17), 'yyyy-MM-dd'),
    };
  }
  return {
    organisation: organisationName?.name,
    dob: profileDetails.dateOfBirth,
  };
};
