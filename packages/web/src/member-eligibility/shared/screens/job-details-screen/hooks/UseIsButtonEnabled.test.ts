import * as target from './UseIsButtonEnabled';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

jest.mock('@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand');
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((fn) => fn()),
}));

const useIsAusBrandMock = jest.mocked(useIsAusBrand);

describe('australian validation', () => {
  beforeEach(() => {
    useIsAusBrandMock.mockReturnValue(true);
  });

  const baseDetails: EligibilityDetails = {
    flow: 'Sign Up',
    currentScreen: 'Job Details Screen',
    organisation: {
      id: '1',
      label: 'Healthcare Allied Health',
      requiresJobTitle: true,
      requiresJobReference: true,
    },
    jobDetailsAus: {
      isSelfEmployed: true,
    },
  };

  it('should enable button when ABN is valid', () => {
    const details: EligibilityDetails = {
      ...baseDetails,
      jobDetailsAus: {
        ...baseDetails.jobDetailsAus,
        australianBusinessNumber: '12345678901',
      },
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(true);
  });

  it('should disable button when ABN is too short', () => {
    const details: EligibilityDetails = {
      ...baseDetails,
      jobDetailsAus: {
        ...baseDetails.jobDetailsAus,
        australianBusinessNumber: '1234567890',
      },
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });

  it('should disable button when ABN contains non-digits', () => {
    const details: EligibilityDetails = {
      ...baseDetails,
      jobDetailsAus: {
        ...baseDetails.jobDetailsAus,
        australianBusinessNumber: '1234567890a',
      },
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });
});

describe('job title validation', () => {
  beforeEach(() => {
    useIsAusBrandMock.mockReturnValue(false);
  });

  it('should enable button when job title is valid', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      jobTitle: 'Nurse',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(true);
  });

  it('should disable button when job title is too short', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
      jobTitle: 'IT',
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });

  it('should disable button when job title contains special characters', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
        requiresJobTitle: true,
        requiresJobReference: false,
      },
      jobTitle: 'Software Engineer!',
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });
});

describe('job reference validation', () => {
  beforeEach(() => {
    useIsAusBrandMock.mockReturnValue(false);
  });

  it('should enable button when job reference is valid', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      jobTitle: '123',
      organisation: {
        id: '2',
        label: 'NHS',
        requiresJobTitle: false,
        requiresJobReference: false,
      },
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(true);
  });

  it('should disable button when job reference is too short', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
        requiresJobTitle: false,
        requiresJobReference: true,
      },
      jobTitle: '11',
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });

  it('should disable button when job reference contains special characters', () => {
    const details: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
        requiresJobTitle: false,
        requiresJobReference: true,
      },
      jobReference: '!!!!!',
    };

    expect(target.useIsNextButtonEnabled(details)).toBe(false);
  });
});
