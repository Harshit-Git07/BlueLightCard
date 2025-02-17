import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import {
  defaultTrustedDomains,
  hasEmployersOrgId,
  multiIdRequirements,
  singleIdRequirements,
} from '@blc-mono/members/testdata/loaders/data/constants/orgsAndEmployers';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import {
  ORGANISATION,
  organisationKey,
} from '@blc-mono/members/application/repositories/base/repository';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdRequirementsModel } from '@blc-mono/shared/models/members/idRequirementsModel';

export type OrganisationModelForDynamo = OrganisationModel & DynamoRow;

export const organisations: OrganisationModelForDynamo[] = [
  buildOrganisation({
    organisationId: hasEmployersOrgId,
    name: 'Has employers',
  }),
  buildOrganisation({
    organisationId: '7bb70b55-a123-455f-85ac-0486637c3699',
    name: 'No promocode',
  }),
  buildOrganisation({
    organisationId: '455cd16d-06a1-4cf2-b6e6-159da32231d2',
    name: 'Promocode: Skip ID',
    bypassId: true,
  }),
  buildOrganisation({
    organisationId: '039253f9-2e19-4dd3-8256-bbcde2f3ae5c',
    name: 'Promocode: Skip payment',
    bypassPayment: true,
  }),
  buildOrganisation({
    organisationId: 'b23dc25f-6f8e-4c8f-949d-7fcd8aa81951',
    name: 'Promocode: Skip both',
    bypassId: true,
    bypassPayment: true,
  }),
  buildOrganisation({
    organisationId: 'a7c95932-bcb0-4cbb-9b73-50ca6ffec010',
    name: 'Multi-ID',
    idRequirements: multiIdRequirements,
  }),
];

interface OrganisationModelBuilder
  extends Partial<
    Omit<
      OrganisationModelForDynamo,
      | 'pk'
      | 'sk'
      | 'organisationId'
      | 'name'
      | 'employedIdRequirements'
      | 'retiredIdRequirements'
      | 'volunteerIdRequirements'
    >
  > {
  organisationId: string;
  name: string;
  idRequirements?: IdRequirementsModel;
}

function buildOrganisation({
  organisationId,
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
  ...organisation
}: OrganisationModelBuilder): OrganisationModelForDynamo {
  return {
    ...organisation,
    pk: organisationKey(organisationId),
    organisationId,
    sk: ORGANISATION,
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
