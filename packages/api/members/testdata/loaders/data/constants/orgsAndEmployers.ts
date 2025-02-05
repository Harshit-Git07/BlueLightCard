import { IdRequirementsModel } from '@blc-mono/shared/models/members/idRequirementsModel';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';

export const defaultTrustedDomains = ['instil.co', 'bluelightcard.co.uk'];
export const hasEmployersOrgId = 'f16aa72d-7510-4550-917e-29652cc0fb69';

export const singleIdRequirements: IdRequirementsModel = {
  minimumRequired: 1,
  supportedDocuments: [
    {
      idKey: 'workEmail',
      type: IdType.TRUSTED_DOMAIN,
      title: 'Work Email',
      description: 'The fastest way to verify your employment status',
      guidelines: '',
      required: false,
    },
    {
      idKey: 'birthCertificate',
      type: IdType.IMAGE_UPLOAD,
      title: 'Birth Certificate',
      description: 'Used to verify your date of birth and legal name',
      guidelines: 'Please upload a clear image of your birth certificate with all details visible.',
      required: false,
    },
  ],
};

export const multiIdRequirements: IdRequirementsModel = {
  minimumRequired: 1,
  supportedDocuments: [
    {
      idKey: 'birthCertificate',
      type: IdType.IMAGE_UPLOAD,
      title: 'Birth Certificate',
      description: 'Used to verify your date of birth and legal name',
      guidelines: 'Please upload a clear image of your birth certificate with all details visible.',
      required: true,
    },
    {
      idKey: 'drivingLicence',
      type: IdType.IMAGE_UPLOAD,
      title: 'Driving Licence',
      description: 'Used to verify your face',
      guidelines: 'Please upload a clear image of the front of the driving license',
      required: false,
    },
    {
      idKey: 'passport',
      type: IdType.IMAGE_UPLOAD,
      title: 'Passport',
      description: 'Used to verify your face',
      guidelines:
        'Please upload a clear image of the page of your passport that includes your face',
      required: false,
    },
  ],
};
