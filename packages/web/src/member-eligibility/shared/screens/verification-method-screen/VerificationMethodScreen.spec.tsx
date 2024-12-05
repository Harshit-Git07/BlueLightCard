import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { renderWithMockedPlatformAdapter } from '../../testing/MockedPlatformAdaptor';

const mockSetEligibilityDetails = jest.fn();
const eligibilityDetailsState: EligibilityDetailsState = [
  {
    flow: 'Sign Up',
    currentScreen: 'Job Details Screen',
  },
  mockSetEligibilityDetails,
];

describe('VerificationMethodScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    renderWithMockedPlatformAdapter(
      <VerificationMethodScreen eligibilityDetailsState={eligibilityDetailsState} />
    );
  });

  it('should render all headings correctly', () => {
    const headings = [
      'Verify Eligibility',
      'Verify your eligibility by providing a valid ID',
      'CHOOSE VERIFICATION METHOD',
    ];

    headings.forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
  });

  it('should render all verification options correctly', () => {
    const options = ['Work Email', 'NHS Smart Card', 'Payslip', 'Work ID Card'];

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should render all verification descriptions correctly', () => {
    const descriptions = [
      'We will send you a verification email in the next step',
      'Upload a picture of your NHS Smart Card',
      'Upload a picture of your Payslip',
      'Upload a picture of your Work ID Card',
    ];

    descriptions.forEach((description) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('should render the Fast tag for work email option', () => {
    expect(screen.getByText('Fast')).toBeInTheDocument();
  });

  it('should handle work email verification method selection', () => {
    const workEmailOption = screen.getByText('Work Email');

    act(() => workEmailOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Work Email Verification Screen',
    });
  });

  it('should handle file upload verification method selections', () => {
    const fileUploadOptions = ['NHS Smart Card', 'Payslip', 'Work ID Card'];

    fileUploadOptions.forEach((option) => {
      const optionElement = screen.getByText(option);
      act(() => optionElement.click());

      expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
        flow: 'Sign Up',
        currentScreen: 'File Upload Verification Screen',
        fileVerificationType: option,
      });

      jest.clearAllMocks();
    });
  });

  it('should handle back navigation correctly', () => {
    const backButton = screen.getByText('Back');

    act(() => backButton.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
    });
  });
});

describe('VerificationMethodScreen eligibility details object', () => {
  it('should preserve existing eligibility details when navigating', () => {
    const detailedState: EligibilityDetailsState = [
      {
        flow: 'Sign Up',
        currentScreen: 'Job Details Screen',
        employmentStatus: 'Employed',
        jobTitle: 'Doctor',
      },
      mockSetEligibilityDetails,
    ];

    renderWithMockedPlatformAdapter(
      <VerificationMethodScreen eligibilityDetailsState={detailedState} />
    );

    const workEmailOption = screen.getByText('Work Email');

    act(() => workEmailOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Work Email Verification Screen',
      employmentStatus: 'Employed',
      jobTitle: 'Doctor',
    });
  });
});
