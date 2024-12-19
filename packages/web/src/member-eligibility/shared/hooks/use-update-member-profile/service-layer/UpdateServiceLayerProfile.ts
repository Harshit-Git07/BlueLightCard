import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { isAusAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/IsAusAddress';
import { components } from '@bluelightcard/shared-ui/generated/MembersApi';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';

type Request = Omit<
  components['schemas']['UpdateProfileModel'],
  'spareEmailValidated' | 'emailValidated'
>;

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
      employerName: undefined, // TODO: Add AUS specific employer name here?
      jobTitle: eligibilityDetails.jobTitle,
      jobReference: eligibilityDetails.jobReference,
    };
    const result = await fetch(
      `${serviceLayerUrl}/members/${eligibilityDetails.member.id}/profile`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );

    if (!result.ok) {
      console.error('Failed to update member application for unknown reason', result.body);
      return undefined;
    }
  } catch (error) {
    console.error('Failed to create member application', error);
    return undefined;
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

function getEmploymentStatus(eligibilityDetails: EligibilityDetails): Request['employmentStatus'] {
  switch (eligibilityDetails.employmentStatus) {
    case 'Employed':
      return 'EMPLOYED';
    case 'Retired or Bereaved':
      return 'RETIRED';
    default:
      return 'VOLUNTEER';
  }
}
