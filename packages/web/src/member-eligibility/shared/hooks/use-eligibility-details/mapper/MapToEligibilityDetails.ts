import {
  AusAddress,
  EligibilityDetails,
  EligibilityDetailsAddress,
  EligibilityDetailsApplication,
  EligibilityDetailsMember,
  EligibilityEmployer,
  EligibilityOrganisation,
  EmploymentStatus,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { getEmployerFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetEmployer';
import { getOrganisationFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetOrganisation';
import { BRANDS } from '@/types/brands.enum';
import { BRAND } from '@/root/global-vars';
import {
  ServiceLayerApplication,
  ServiceLayerMemberProfile,
} from '@bluelightcard/shared-ui/member-eligibility/service-layer/member-profile/types/ServiceLayerMemberProfile';

type EligibilityDetailsWithoutFlowAndScreen = Omit<EligibilityDetails, 'flow' | 'currentScreen'>;

export async function mapToEligibilityDetails(
  memberProfile: ServiceLayerMemberProfile
): Promise<EligibilityDetailsWithoutFlowAndScreen> {
  return {
    member: getMemberDetails(memberProfile),
    address: getAddressDetails(memberProfile),
    employmentStatus: getEmploymentStatus(memberProfile),
    organisation: await getOrganisation(memberProfile),
    employer: await getEmployer(memberProfile),
    jobTitle: memberProfile.jobTitle,
    promoCode: getPromoCode(memberProfile),
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
    application: getApplicationDetails(memberProfile),
  };
}

function getApplicationDetails(
  memberProfile: ServiceLayerMemberProfile
): EligibilityDetailsApplication | undefined {
  const latestApplication = memberProfile.applications?.at(-1);
  if (!latestApplication) return undefined;

  return {
    id: latestApplication.applicationId,
  };
}

function getAddressDetails(
  memberProfile: ServiceLayerMemberProfile
): EligibilityDetailsAddress | undefined {
  const latestApplication = memberProfile.applications?.at(-1);
  if (!latestApplication) return undefined;

  if (BRAND === BRANDS.BLC_AU) {
    return getAusAddressDetails(memberProfile, latestApplication);
  }

  return getUkAddressDetails(memberProfile, latestApplication);
}

function getAusAddressDetails(
  memberProfile: ServiceLayerMemberProfile,
  latestApplication: ServiceLayerApplication
): AusAddress | undefined {
  if (
    latestApplication.address1 === undefined ||
    latestApplication.city === undefined ||
    latestApplication.postcode === undefined ||
    memberProfile.county === undefined
  ) {
    return undefined;
  }

  return {
    line1: latestApplication.address1,
    line2: latestApplication.address2,
    city: latestApplication.city,
    state: memberProfile.county,
    postcode: latestApplication.postcode,
  };
}

function getUkAddressDetails(
  memberProfile: ServiceLayerMemberProfile,
  latestApplication: ServiceLayerApplication
): UkAddress | undefined {
  if (
    latestApplication.address1 === undefined ||
    latestApplication.city === undefined ||
    latestApplication.postcode === undefined ||
    memberProfile.county === undefined
  ) {
    return undefined;
  }

  return {
    line1: latestApplication.address1,
    line2: latestApplication.address2,
    city: latestApplication.city,
    county: memberProfile.county,
    postcode: latestApplication.postcode,
  };
}

function getEmploymentStatus(
  memberProfile: ServiceLayerMemberProfile
): EmploymentStatus | undefined {
  // TODO: Find out what these actually resolve to
  switch (memberProfile.employmentStatus) {
    case 'EMPLOYED':
      return 'Employed';
    case 'RETIRED':
      return 'Retired or Bereaved';
    case 'VOLUNTEER':
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
