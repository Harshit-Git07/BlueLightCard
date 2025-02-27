import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { isAusAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/IsAusAddress';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { UpdateProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

type Request = Omit<UpdateProfileModel, 'spareEmailValidated' | 'emailValidated'>;

export async function updateServiceLayerProfile(
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  try {
    if (!eligibilityDetails.member?.id) {
      console.error('No member id available so cannot update application');
      return undefined;
    }

    const request: Request = {
      firstName: eligibilityDetails.member?.firstName,
      lastName: eligibilityDetails.member?.surname,
      dateOfBirth: getDateOfBirth(eligibilityDetails) as string, // TODO: Forcing this to be a string as we won't always have it
      county: getCounty(eligibilityDetails),
      employmentStatus: getEmploymentStatus(eligibilityDetails),
      organisationId: eligibilityDetails.organisation?.id,
      employerId: eligibilityDetails.employer?.id,
      employerName: eligibilityDetails.jobDetailsAus?.employerAus,
      jobTitle: eligibilityDetails.jobTitle,
      jobReference: eligibilityDetails.jobReference,
    };
    return await fetchWithAuth(
      `${serviceLayerUrl}/members/${eligibilityDetails.member.id}/profile`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    console.error('Failed to create member application', error);
    throw error;
  }
}

function getCounty(eligibilityDetails: EligibilityDetails): string | undefined {
  if (isAusAddress(eligibilityDetails.address)) {
    return eligibilityDetails.address.state;
  }

  return eligibilityDetails.address?.county;
}

function getDateOfBirth(eligibilityDetails: EligibilityDetails): string | undefined {
  return eligibilityDetails.member?.dob?.toISOString()?.split('T')?.[0];
}

function getEmploymentStatus(eligibilityDetails: EligibilityDetails): EmploymentStatus {
  switch (eligibilityDetails.employmentStatus) {
    case 'Employed':
      return EmploymentStatus.EMPLOYED;
    case 'Retired or Bereaved':
      return EmploymentStatus.RETIRED;
    default:
      return EmploymentStatus.VOLUNTEER;
  }
}
