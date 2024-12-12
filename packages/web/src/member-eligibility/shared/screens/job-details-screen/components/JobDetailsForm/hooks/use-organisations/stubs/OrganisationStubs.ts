import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

// TODO: Remove this later, but for fuzzy frontend purposes it allows us to test multi-id easily on mobile
export const organisationNoEmployersStub: EligibilityOrganisation = {
  id: 'no-employers-stub',
  label: 'No employers stub',
  idRequirements: [],
};

export const organisationPromocodeStub: EligibilityOrganisation = {
  id: 'promocode-stub',
  label: 'Promocode stub',
  idRequirements: [],
};

export const organisationMultiIdStub: EligibilityOrganisation = {
  id: 'multi-id-stub',
  label: 'Multi-ID stub',
  idRequirements: [
    {
      title: 'Required ID',
      description: 'Required ID',
      guidelines: 'Upload an image of your required ID',
      type: 'file upload',
      required: true,
    },
    {
      title: 'Secondary ID',
      description: 'Secondary ID',
      guidelines: 'Secondary ID',
      type: 'file upload',
      required: false,
    },
    {
      title: 'Another option ID',
      description: 'Another option ID',
      guidelines: 'Another option ID',
      type: 'file upload',
      required: false,
    },
  ],
};

export const healthcareAlliedStub: EligibilityOrganisation = {
  id: '6',
  label: 'Healthcare Allied Health',
  idRequirements: [
    {
      title: 'HCPC Number',
      description: 'HCPC Number',
      guidelines: 'Upload your HCPC registration',
      type: 'file upload',
      required: false,
    },
  ],
};

export const sppaStub: EligibilityOrganisation = {
  id: '7',
  label: 'SPPA Headed Letter',
  idRequirements: [
    {
      title: 'SPPA Headed Letter',
      description: 'SPPA Headed Letter',
      guidelines: '',
      type: 'file upload',
      required: false,
    },
  ],
};

export const fuzzyFrontendActionStubs: EligibilityOrganisation[] = [
  organisationNoEmployersStub,
  organisationPromocodeStub,
  organisationMultiIdStub,
  healthcareAlliedStub,
  sppaStub,
];

export const organisationsStub: EligibilityOrganisation[] = [
  {
    id: '1',
    label: 'Police',
    idRequirements: [
      {
        title: 'Id Card',
        description: 'Id Card',
        guidelines: 'Upload your Id card',
        type: 'file upload',
        required: false,
      },
    ],
  },
  {
    id: '2',
    label: 'NHS',
    idRequirements: [
      {
        title: 'NHS Email',
        description: 'NHS Email',
        guidelines: 'Verify your NHS email',
        type: 'email',
        required: false,
      },
    ],
  },
  {
    id: '3',
    label: 'Blood Bikes',
    idRequirements: [
      {
        title: 'Blood Bikes ID',
        description: 'Blood Bikes ID',
        guidelines: 'Upload your Blood Bikes ID',
        type: 'file upload',
        required: false,
      },
    ],
  },
  {
    id: '4',
    label: 'Ambulance',
    idRequirements: [
      {
        title: 'Ambulance ID',
        description: 'Ambulance ID',
        guidelines: 'Upload your Ambulance Service ID',
        type: 'file upload',
        required: false,
      },
    ],
  },
  {
    id: '5',
    label: 'Dentist',
    idRequirements: [
      {
        title: 'GDC Number',
        description: 'GDC Number',
        guidelines: 'Upload your GDC registration',
        type: 'file upload',
        required: false,
      },
    ],
  },
  {
    id: '6',
    label: 'Healthcare Allied Health',
    idRequirements: [
      {
        title: 'HCPC Number',
        description: 'HCPC Number',
        guidelines: 'Upload your HCPC registration',
        type: 'file upload',
        required: false,
      },
    ],
  },
  ...fuzzyFrontendActionStubs,
];
