import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EmploymentStatusScreen } from '@/root/src/member-eligibility/shared/screens/employment-status-screen/EmploymentStatusScreen';
import { renderWithMockedPlatformAdapter } from '@/root/src/member-eligibility/shared/testing/MockedPlatformAdaptor';

const mockSetEligibilityDetails = jest.fn();
const eligibilityDetailsState: EligibilityDetailsState = [
  {
    flow: 'Sign Up',
    currentScreen: 'Employment Status Screen',
  },
  mockSetEligibilityDetails,
];

describe('EmploymentStatusScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    renderWithMockedPlatformAdapter(
      <EmploymentStatusScreen eligibilityDetailsState={eligibilityDetailsState} />
    );
  });

  it('should render all main section headings and text', () => {
    const headings = [
      screen.getByText('Verify Eligibility'),
      screen.getByText('Provide details about your employment status and job role'),
      screen.getByText('EMPLOYMENT STATUS'),
    ];

    headings.forEach((heading) => {
      expect(heading).toBeInTheDocument();
    });
  });

  it('should handle employed status selection correctly', async () => {
    const employedOption = screen.getByText('Employed');

    act(() => employedOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      employmentStatus: 'Employed',
    });
  });

  it('should handle retired status selection correctly', async () => {
    const retiredOption = screen.getByText('Retired or Bereaved');

    act(() => retiredOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      employmentStatus: 'Retired or Bereaved',
    });
  });

  it('should handle volunteer status selection correctly', async () => {
    const volunteerOption = screen.getByText('Volunteer');

    act(() => volunteerOption.click());

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Job Details Screen',
      employmentStatus: 'Volunteer',
    });
  });

  it('should handle back navigation correctly', async () => {
    const user = userEvent.setup();
    const backButton = screen.getByText('Back');

    await user.click(backButton);

    expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
      flow: 'Sign Up',
      currentScreen: 'Interstitial Screen',
    });
  });
});
