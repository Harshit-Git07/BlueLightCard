import { brand } from '../../utils/brand';

const regionText = brand === 'blc-au' ? 'State' : 'County';

export const copy = {
  title: 'Personal Information',
  nameSection: {
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    buttonText: 'Change name',
  },
  dateOfBirthLabel: 'Date of birth',
  gender: {
    label: 'Gender',
    placeholder: 'Gender',
  },
  email: {
    label: 'Email',
    buttonText: 'Change email',
  },
  password: {
    label: 'Password',
    buttonText: 'Change password',
  },
  biometrics: {
    label: 'Biometrics',
    buttonText: 'See biometrics settings',
  },
  phoneNumberLabel: 'Phone number',
  county: {
    label: regionText,
    placeholder: regionText,
    tooltip: `Select your ${regionText} to discover local offers nearby`,
  },
  service: {
    label: 'Service',
    buttonText: 'Change service',
  },
  division: { label: 'Division', placeholder: 'Division' },
  saveButtonText: 'Save',
} as const;
