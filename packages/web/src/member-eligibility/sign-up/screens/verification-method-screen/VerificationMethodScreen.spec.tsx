import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { VerificationMethodScreen } from './VerificationMethodScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

const mockSetEligibilityDetails = jest.fn();
const eligibilityDetailsState: EligibilityDetailsState = [
  {
    currentScreen: 'Job Details Screen',
  },
  mockSetEligibilityDetails,
];

const renderVerificationMethodScreen = () => {
  jest.clearAllMocks();
  return render(<VerificationMethodScreen eligibilityDetailsState={eligibilityDetailsState} />);
};

describe('VerificationMethodScreen', () => {
  it('should render all headings correctly', () => {
    renderVerificationMethodScreen();

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
    renderVerificationMethodScreen();

    const options = ['Work Email', 'NHS Smart Card', 'Payslip', 'Work ID Card'];

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should render all verification descriptions correctly', () => {
    renderVerificationMethodScreen();

    const descriptions = [
      'We will send you a verification email in the next step',
      'Upload a picture of your NHS Smart Card',
      'Upload a picture of your Payslip',
      'Upload a picture of your work ID card',
    ];

    descriptions.forEach((description) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('should render the Fast tag for work email option', () => {
    renderVerificationMethodScreen();
    expect(screen.getByText('Fast')).toBeInTheDocument();
  });

  it('should handle work email verification method selection', () => {
    renderVerificationMethodScreen();
    const workEmailOption = screen.getByText('Work Email');

    act(() => workEmailOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Work Email Verification Screen',
    });
  });

  it('should handle file upload verification method selections', () => {
    renderVerificationMethodScreen();

    const fileUploadOptions = ['NHS Smart Card', 'Payslip', 'Work ID Card'];

    fileUploadOptions.forEach((option) => {
      const optionElement = screen.getByText(option);
      act(() => optionElement.click());

      expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
        currentScreen: 'File Upload Verification Screen',
        fileVerificationType: option,
      });

      jest.clearAllMocks();
    });
  });

  it('should handle back navigation correctly', () => {
    renderVerificationMethodScreen();
    const backButton = screen.getByText('Back');

    act(() => backButton.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Job Details Screen',
    });
  });

  it('should preserve existing eligibility details when navigating', () => {
    const detailedState: EligibilityDetailsState = [
      {
        currentScreen: 'Job Details Screen',
        employmentStatus: 'Employed',
        jobTitle: 'Doctor',
      },
      mockSetEligibilityDetails,
    ];

    render(<VerificationMethodScreen eligibilityDetailsState={detailedState} />);
    const workEmailOption = screen.getByText('Work Email');

    act(() => workEmailOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      currentScreen: 'Work Email Verification Screen',
      employmentStatus: 'Employed',
      jobTitle: 'Doctor',
    });
  });
});
