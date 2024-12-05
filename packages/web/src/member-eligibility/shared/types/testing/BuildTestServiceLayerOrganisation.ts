import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

export function buildTestServiceLayerOrganisation({
  organisationId = '1',
  name = 'Organisation 1',
  employmentStatus = ['EMPLOYED'],
  active = true,
  idUploadCount = 1,
  bypassId = false,
  bypassPayment = false,
  trustedDomains = [],
}: Partial<ServiceLayerOrganisation> = {}): ServiceLayerOrganisation {
  return {
    organisationId,
    name,
    employmentStatus,
    active,
    idUploadCount,
    bypassId,
    bypassPayment,
    trustedDomains,
  };
}
