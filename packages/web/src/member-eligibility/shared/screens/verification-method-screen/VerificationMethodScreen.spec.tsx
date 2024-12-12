import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import { renderWithMockedPlatformAdapter } from '../../testing/MockedPlatformAdaptor';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

const mockSetEligibilityDetails = jest.fn();

describe('VerificationMethodScreen', () => {
  describe('given a single document flow', () => {
    beforeEach(() => {
      const state: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Verification Method Screen',
        currentIdRequirementDetails: [
          {
            title: 'Work Email',
            description: '',
            guidelines: '',
            type: 'email',
            required: false,
          },
          {
            title: 'NHS Smart Card',
            description: '',
            guidelines: '',
            type: 'file upload',
            required: false,
          },
          {
            title: 'Payslip',
            description: '',
            guidelines: '',
            type: 'file upload',
            required: false,
          },
        ],
      };

      renderWithMockedPlatformAdapter(
        <VerificationMethodScreen eligibilityDetailsState={[state, mockSetEligibilityDetails]} />
      );
    });

    it('should render main screen elements', () => {
      expect(screen.getByText('Verify Eligibility')).toBeInTheDocument();
      expect(
        screen.getByText('Verify your eligibility by providing a valid ID')
      ).toBeInTheDocument();
      expect(screen.getByText('CHOOSE VERIFICATION METHOD')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should render verification options', () => {
      ['Work Email', 'NHS Smart Card', 'Payslip'].forEach((option) => {
        expect(screen.getByText(option)).toBeInTheDocument();
      });
    });
  });

  describe('given a multiple document flow', () => {
    beforeEach(() => {
      const state: EligibilityDetails = {
        flow: 'Sign Up',
        currentScreen: 'Verification Method Screen',
        requireMultipleIds: true,
        currentIdRequirementDetails: [
          {
            title: 'NHS Smart Card',
            description: '',
            guidelines: '',
            type: 'file upload',
            required: true,
          },
          {
            title: 'Payslip',
            description: '',
            guidelines: '',
            type: 'file upload',
            required: false,
          },
        ],
      };

      renderWithMockedPlatformAdapter(
        <VerificationMethodScreen eligibilityDetailsState={[state, mockSetEligibilityDetails]} />
      );
    });

    it('should render primary document section', () => {
      expect(
        screen.getByText(/upload your nhs smart card and choose one supporting document/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Primary document')).toBeInTheDocument();
      expect(screen.getByText('CHOOSE A SUPPORTING DOCUMENT')).toBeInTheDocument();
    });
  });
});
