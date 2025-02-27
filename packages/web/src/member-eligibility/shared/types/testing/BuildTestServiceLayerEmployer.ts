import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';

export function buildTestServiceLayerEmployer({
  organisationId = '1',
  employerId = '1',
  name = 'Employer 1',
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
        title: 'Employee ID',
        idKey: 'employee_id',
        description: 'Employee identification',
        guidelines: 'Please upload your employee ID',
        type: IdType.IMAGE_UPLOAD,
        required: true,
      },
    ],
  },
  volunteerIdRequirements = {
    minimumRequired: 1,
    supportedDocuments: [
      {
        title: 'Volunteer Badge',
        idKey: 'volunteer_badge',
        description: 'Volunteer identification',
        guidelines: 'Please upload your volunteer badge',
        type: IdType.IMAGE_UPLOAD,
        required: false,
      },
    ],
  },
  retiredIdRequirements = {
    minimumRequired: 1,
    supportedDocuments: [
      {
        title: 'Retiree Card',
        idKey: 'retiree_card',
        description: 'Retiree identification',
        guidelines: 'Please upload your retiree card',
        type: IdType.IMAGE_UPLOAD,
        required: true,
      },
    ],
  },
  isJobReferenceMandatory = false,
  isJobTitleMandatory = true,
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
    employedIdRequirements,
    volunteerIdRequirements,
    retiredIdRequirements,
    isJobReferenceMandatory,
    isJobTitleMandatory,
  };
}
