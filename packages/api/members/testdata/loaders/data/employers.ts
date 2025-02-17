import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { EmployerModel } from '@blc-mono/shared/models/members/employerModel';
import {
  defaultTrustedDomains,
  hasEmployersOrgId,
  multiIdRequirements,
  singleIdRequirements,
} from '@blc-mono/members/testdata/loaders/data/constants/orgsAndEmployers';
import {
  employerKey,
  organisationKey,
} from '@blc-mono/members/application/repositories/base/repository';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdRequirementsModel } from '@blc-mono/shared/models/members/idRequirementsModel';

export type EmployerModelForDynamo = EmployerModel & DynamoRow;

export const employers: EmployerModelForDynamo[] = [
  buildEmployer({
    organisationId: hasEmployersOrgId,
    employerId: '2eaf96c7-757a-4893-9747-e174b3cc8d52',
    name: 'No promocode',
  }),
  buildEmployer({
    organisationId: hasEmployersOrgId,
    employerId: 'fbdf3e19-19bd-495d-b82d-f6bf07540ba0',
    name: 'Promocode: Skip ID',
    bypassId: true,
  }),
  buildEmployer({
    organisationId: hasEmployersOrgId,
    employerId: '1a11d9d1-98cf-4dd8-8121-936e78dc2a84',
    name: 'Promocode: Skip payment',
    bypassPayment: true,
  }),
  buildEmployer({
    organisationId: hasEmployersOrgId,
    employerId: 'efe697c8-a3da-4230-91e3-c39d2f7356fb',
    name: 'Promocode: Skip both',
    bypassId: true,
    bypassPayment: true,
  }),
  buildEmployer({
    organisationId: hasEmployersOrgId,
    employerId: '1a6eae04-8b8a-4d27-9d7c-2ae15fba5f5d',
    name: 'Multi-ID',
    idRequirements: multiIdRequirements,
  }),
];

interface EmployerModelBuilder
  extends Partial<
    Omit<
      EmployerModelForDynamo,
      | 'pk'
      | 'sk'
      | 'organisationId'
      | 'employerId'
      | 'name'
      | 'employedIdRequirements'
      | 'retiredIdRequirements'
      | 'volunteerIdRequirements'
    >
  > {
  organisationId: string;
  employerId: string;
  name: string;
  idRequirements?: IdRequirementsModel;
}

function buildEmployer({
  organisationId,
  employerId,
  name,
  active = true,
  employmentStatus = [
    EmploymentStatus.EMPLOYED,
    EmploymentStatus.RETIRED,
    EmploymentStatus.VOLUNTEER,
  ],
  trustedDomains = defaultTrustedDomains,
  idRequirements = singleIdRequirements,
  lastUpdated = '2024-10-06T17:00:41.277Z',
  ...employer
}: EmployerModelBuilder): EmployerModelForDynamo {
  return {
    ...employer,
    pk: organisationKey(organisationId),
    organisationId,
    sk: employerKey(employerId),
    employerId,
    name,
    active,
    employmentStatus,
    trustedDomains,
    employedIdRequirements: idRequirements,
    retiredIdRequirements: idRequirements,
    volunteerIdRequirements: idRequirements,
    lastUpdated,
  };
}
