import {
  AusAddress,
  EligibilityDetails,
  EligibilityDetailsAddress,
  EligibilityDetailsApplication,
  EligibilityDetailsMember,
  EligibilityEmployer,
  EligibilityJobDetailsAus,
  EligibilityOrganisation,
  EmploymentStatus,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { getEmployerFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetEmployer';
import { getOrganisationFromServiceLayer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/service-layer/GetOrganisation';
import { BRANDS } from '@/types/brands.enum';
import { BRAND } from '@/root/global-vars';
import { toEligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/mapper/ToEligibilityEmployer';
import { toEligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/mapper/ToEligibilityOrganisation';
import {
  ServiceLayerApplication,
  ServiceLayerMemberProfile,
} from '@/root/src/member-eligibility/shared/hooks/use-member-profile/types/ServiceLayerMemberProfile';

type EligibilityDetailsWithoutFlowAndScreen = Omit<EligibilityDetails, 'flow' | 'currentScreen'>;

export async function mapToEligibilityDetails(
  memberProfile: ServiceLayerMemberProfile
): Promise<EligibilityDetailsWithoutFlowAndScreen> {
  const employmentStatus = getEmploymentStatus(memberProfile);

  const organisation = await getOrganisation(memberProfile, employmentStatus);
  const employer = await getEmployer(memberProfile);
  const promoCode = getPromoCode(memberProfile);
  const address = getAddressDetails(memberProfile);

  return {
    member: getMemberDetails(memberProfile),
    address,
    employmentStatus,
    organisation,
    employer,
    jobTitle: memberProfile.jobTitle,
    jobReference: memberProfile.jobReference,
    promoCode,
    jobDetailsAus: getJobDetailsAus(memberProfile),
    canSkipIdVerification: getCanSkipIdVerification(organisation, employer, promoCode),
    canSkipPayment: getCanSkipPaymentVerification(organisation, employer, promoCode),
    hasSkippedAccountDetails: address !== undefined,
    hasJumpedStraightToPayment: canSkipStraightToPayment(memberProfile),
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
  memberProfile: ServiceLayerMemberProfile,
  employmentStatus: EmploymentStatus | undefined
): Promise<EligibilityOrganisation | undefined> {
  if (!memberProfile.organisationId) return undefined;

  const serviceLayerOrganisation = await getOrganisationFromServiceLayer(
    memberProfile.organisationId
  );
  if (!serviceLayerOrganisation) return undefined;

  return toEligibilityOrganisation(serviceLayerOrganisation, employmentStatus);
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

  return toEligibilityEmployer(serviceLayerEmployer);
}

function getPromoCode(memberProfile: ServiceLayerMemberProfile): string | undefined {
  const lastApplication = memberProfile.applications?.at(-1);
  if (!lastApplication) return undefined;

  // TODO: Find out the promo code structure
  return undefined;
}

function getJobDetailsAus(
  memberProfile: ServiceLayerMemberProfile
): EligibilityJobDetailsAus | undefined {
  const employerName = memberProfile.employerName;
  if (!employerName) return undefined;

  return {
    employerAus: employerName,
  };
}

function getCanSkipIdVerification(
  organisation: EligibilityOrganisation | undefined,
  employer: EligibilityEmployer | undefined,
  promoCode: string | undefined
): boolean {
  if (!promoCode) return false;

  if (employer) {
    return employer.promoCodeEffect === 'Bypass ID';
  }

  if (organisation) {
    return organisation.promoCodeEffect === 'Bypass ID';
  }

  return false;
}

function getCanSkipPaymentVerification(
  organisation: EligibilityOrganisation | undefined,
  employer: EligibilityEmployer | undefined,
  promoCode: string | undefined
): boolean {
  if (!promoCode) return false;

  if (employer) {
    return employer.promoCodeEffect === 'Bypass Payment';
  }

  if (organisation) {
    return organisation.promoCodeEffect === 'Bypass Payment';
  }

  return false;
}

function canSkipStraightToPayment(memberProfile: ServiceLayerMemberProfile): boolean {
  const lastApplication = memberProfile.applications?.at(-1);
  if (!lastApplication) return false;

  return (
    lastApplication.trustedDomainValidated ||
    (lastApplication.documents !== undefined && lastApplication.documents.length > 0)
  );
}
