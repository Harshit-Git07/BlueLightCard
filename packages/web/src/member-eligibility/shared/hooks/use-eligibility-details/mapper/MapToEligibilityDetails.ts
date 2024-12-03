import {
  EligibilityDetails,
  EligibilityDetailsMember,
  EligibilityEmployer,
  EligibilityOrganisation,
  EmploymentStatus,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { ServiceLayerMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/ServiceLayerMemberProfile';
import { getEmployerFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetEmployer';
import { getOrganisationFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetOrganisation';

type EligibilityDetailsWithoutFlowAndScreen = Omit<EligibilityDetails, 'flow' | 'currentScreen'>;

export async function mapToEligibilityDetails(
  memberProfile: ServiceLayerMemberProfile
): Promise<EligibilityDetailsWithoutFlowAndScreen> {
  return {
    member: getMemberDetails(memberProfile),
    employmentStatus: getEmploymentStatus(memberProfile),
    organisation: await getOrganisation(memberProfile),
    employer: await getEmployer(memberProfile),
    jobTitle: memberProfile.jobTitle,
    promoCode: getPromoCode(memberProfile),
    skipAccountDetails: false, // TODO: Find out how to extract this
    requireMultipleIds: false, // TODO: Find out how to extract this
    canSkipIdVerification: false, // TODO: Find out how to extract this
    canSkipPayment: false, // TODO: Find out how to extract this
  };
}

function getMemberDetails(memberProfile: ServiceLayerMemberProfile): EligibilityDetailsMember {
  return {
    id: memberProfile.memberId,
    firstName: memberProfile.firstName,
    surname: memberProfile.lastName,
    dob: new Date(memberProfile.dateOfBirth),
  };
}

function getEmploymentStatus(
  memberProfile: ServiceLayerMemberProfile
): EmploymentStatus | undefined {
  // TODO: Find out what these actually resolve to
  switch (memberProfile.status) {
    case 'Employed':
      return 'Employed';
    case 'Retired':
      return 'Retired or Bereaved';
    case 'Volunteer':
      return 'Volunteer';
  }
}

async function getOrganisation(
  memberProfile: ServiceLayerMemberProfile
): Promise<EligibilityOrganisation | undefined> {
  if (!memberProfile.organisationId) return undefined;

  const serviceLayerOrganisation = await getOrganisationFromServiceLayer(
    memberProfile.organisationId
  );
  if (!serviceLayerOrganisation) return undefined;

  return {
    id: serviceLayerOrganisation.organisationId,
    label: serviceLayerOrganisation.name,
  };
}

async function getEmployer(
  memberProfile: ServiceLayerMemberProfile
): Promise<EligibilityEmployer | undefined> {
  if (!memberProfile.organisationId || !memberProfile.employerId) return undefined;

  const serviceLayerEmployer = await getEmployerFromServiceLayer(
    memberProfile.organisationId,
    memberProfile.employerId
  );
  if (!serviceLayerEmployer) return undefined;

  return {
    id: serviceLayerEmployer.employerId,
    label: serviceLayerEmployer.name,
  };
}

function getPromoCode(memberProfile: ServiceLayerMemberProfile): string | undefined {
  const lastApplication = memberProfile.applications?.at(-1);
  if (!lastApplication) return undefined;

  // TODO: Find out the promo code structure
  return undefined;
}
