import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';

export function buildTestServiceLayerEmployer({
  organisationId = '1',
  employerId = '1',
  name = 'Employer 1',
  employmentStatus = ['EMPLOYED'],
  active = true,
  idUploadCount = 1,
  bypassId = false,
  bypassPayment = false,
  trustedDomains = [],
}: Partial<ServiceLayerEmployer> = {}): ServiceLayerEmployer {
  return {
    organisationId,
    employerId,
    name,
    employmentStatus,
    active,
    idUploadCount,
    bypassId,
    bypassPayment,
    trustedDomains,
  };
}
