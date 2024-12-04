import * as target from './UseIsButtonDisabled';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

jest.mock('@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand');
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((fn) => fn()),
}));

const useIsAusBrandMock = jest.mocked(useIsAusBrand);

describe('useIsNextButtonDisabled', () => {
  describe('for non-Australian brand', () => {
    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(false);
    });

    it('should enable button when job title is valid', () => {
      const details: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Job Details Screen',
        jobTitle: 'Software Engineer',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(false);
    });

    it('should disable button when job title is too short', () => {
      const details: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Job Details Screen',
        jobTitle: 'IT',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });

    it('should disable button when job title contains special characters', () => {
      const details: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Job Details Screen',
        jobTitle: 'Software Engineer!',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });
  });

  describe('for Australian Healthcare Allied Health - self employed', () => {
    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(true);
    });

    const baseDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '1',
        label: 'Healthcare Allied Health',
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

      expect(target.useIsNextButtonDisabled(details)).toBe(false);
    });

    it('should disable button when ABN is too short', () => {
      const details: EligibilityDetails = {
        ...baseDetails,
        jobDetailsAus: {
          ...baseDetails.jobDetailsAus,
          australianBusinessNumber: '1234567890',
        },
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });

    it('should disable button when ABN contains non-digits', () => {
      const details: EligibilityDetails = {
        ...baseDetails,
        jobDetailsAus: {
          ...baseDetails.jobDetailsAus,
          australianBusinessNumber: '1234567890a',
        },
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });
  });

  describe('for Australian brand - other cases', () => {
    beforeEach(() => {
      useIsAusBrandMock.mockReturnValue(true);
    });

    const baseDetails: EligibilityDetails = {
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      organisation: {
        id: '2',
        label: 'Other Organisation',
      },
    };

    it('should enable button when job title is valid', () => {
      const details: EligibilityDetails = {
        ...baseDetails,
        jobTitle: 'Software Engineer',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(false);
    });

    it('should disable button when job title is too short', () => {
      const details: EligibilityDetails = {
        ...baseDetails,
        jobTitle: 'IT',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });

    it('should disable button when job title contains special characters', () => {
      const details: EligibilityDetails = {
        ...baseDetails,
        jobTitle: 'Software Engineer!',
      };

      expect(target.useIsNextButtonDisabled(details)).toBe(true);
    });
  });
});
