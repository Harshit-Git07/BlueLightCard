import { GetIdRequirementDocsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import {
  ID_REQUIREMENT,
  idRequirementKey,
} from '@blc-mono/members/application/repositories/base/repository';

// TODO: This will need to change to the full `SupportedDocumentModel` type later, for some reason there is duplication on the org/employer...
export type SupportedDocumentModelForDynamo = GetIdRequirementDocsModel & DynamoRow;

export const idRequirements: SupportedDocumentModelForDynamo[] = [
  buildIdRequirementDoc({
    idKey: 'workEmail',
    description: 'Work Email',
    type: IdType.TRUSTED_DOMAIN,
  }),
  buildIdRequirementDoc({
    idKey: 'birthCertificate',
    description: 'Birth Certificate',
  }),
  buildIdRequirementDoc({
    idKey: 'drivingLicence',
    description: 'Driving Licence',
  }),
  buildIdRequirementDoc({
    idKey: 'passport',
    description: 'Passport',
  }),
];

interface GetIdRequirementDocsModelBuilder
  extends Partial<Omit<SupportedDocumentModelForDynamo, 'pk' | 'sk' | 'idKey' | 'description'>> {
  idKey: string;
  description: string;
}

function buildIdRequirementDoc({
  idKey,
  description,
  type = IdType.IMAGE_UPLOAD,
  ...card
}: GetIdRequirementDocsModelBuilder): SupportedDocumentModelForDynamo {
  return {
    ...card,
    pk: idRequirementKey(idKey),
    idKey,
    sk: ID_REQUIREMENT,
    description,
    type,
  };
}
