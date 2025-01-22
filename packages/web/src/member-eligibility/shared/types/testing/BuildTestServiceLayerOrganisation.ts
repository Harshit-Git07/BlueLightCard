import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';

export function buildTestServiceLayerOrganisation({
  organisationId = '1',
  name = 'Organisation 1',
  employmentStatus = [EmploymentStatus.EMPLOYED],
  active = true,
  idUploadCount = 1,
  bypassId = false,
  bypassPayment = false,
  trustedDomains = [],
  employedIdRequirements = {
    minimumRequired: 1,
    supportedDocuments: [
      {
        title: 'Work Email',
        idKey: 'Work Email',
        description: '',
        guidelines: 'Must be work email',
        type: IdType.TRUSTED_DOMAIN,
        required: true,
      },
    ],
  },
  volunteerIdRequirements = {
    minimumRequired: 1,
    supportedDocuments: [
      {
        title: 'Volunteer Card',
        idKey: 'Volunteer Card',
        description: '',
        guidelines: 'Upload volunteer card',
        type: IdType.IMAGE_UPLOAD,
        required: false,
      },
    ],
  },
  retiredIdRequirements = {
    minimumRequired: 1,
    supportedDocuments: [
      {
        title: 'ID Card',
        idKey: 'ID Card',
        guidelines: 'Upload ID card',
        description: '',
        type: IdType.IMAGE_UPLOAD,
        required: true,
      },
    ],
  },
}: Partial<ServiceLayerOrganisation> = {}): ServiceLayerOrganisation {
  return {
    isSelfEmployed: false,
    organisationId,
    name,
    employmentStatus,
    active,
    idUploadCount,
    bypassId,
    bypassPayment,
    trustedDomains,
    employedIdRequirements,
    volunteerIdRequirements,
    retiredIdRequirements,
  };
}
