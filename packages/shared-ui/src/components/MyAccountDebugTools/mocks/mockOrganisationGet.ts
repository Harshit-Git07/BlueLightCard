import { sleep } from '../../../utils/sleep';

const mockOrganisationResponse = {
  organisationId: '05e843e2-7967-4e40-b2af-8bf5a766ee60',
  name: 'Reserved Armed Forces',
  type: 'RESERVED',
  active: true,
  employmentStatus: ['EMPLOYED'],
  employedIdRequirements: {
    minimumRequired: 1,
    supportedDocuments: [
      {
        idKey: 'email',
        type: 'EMAIL',
        guidelines: 'Something about email address',
        required: false,
        title: 'Work Email',
        description: 'Provide your work email to be verified',
      },
      {
        idKey: 'passport',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Must show your full name',
        required: false,
        title: 'Passport',
        description: 'Upload a photo of your Passport',
      },
      {
        idKey: 'p60',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Must show your full name',
        required: false,
        title: 'P60',
        description: 'Upload an image of your P60',
      },
    ],
  },
  retiredIdRequirements: {
    minimumRequired: 2,
    supportedDocuments: [
      {
        idKey: 'passport',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Must show your full name',
        required: true,
        title: 'Passport',
        description: 'Upload a photo of your Passport',
      },
      {
        idKey: 'p60',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Upload an image of your P60',
        required: false,
        title: 'P60',
        description: 'Upload an image of your P60',
      },
    ],
  },
  volunteerIdRequirements: {
    minimumRequired: 1,
    supportedDocuments: [
      {
        idKey: 'passport',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Must show passport stuff info',
        required: false,
        title: 'Passport',
        description: 'Upload a photo of your Passport',
      },
      {
        idKey: 'p60',
        type: 'IMAGE_UPLOAD',
        guidelines: 'Upload an image of your P60',
        title: 'P60',
        description: 'Upload an image of your P60',
        required: false,
      },
    ],
  },
  idUploadCount: 1,
  bypassPayment: false,
  bypassId: false,
  lastUpdated: '2024-10-06T16:53:40.537Z',
};

export const mockOrganisationGet = async () => {
  await sleep(500);
  return {
    status: 200,
    data: mockOrganisationResponse,
  };
};
