import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmploymentStatusScreen from './EmploymentStatusScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

const mockSetEligibilityDetails = jest.fn();
const eligibilityDetailsState: EligibilityDetailsState = [
  {
    currentScreen: 'Interstitial Screen',
  },
  mockSetEligibilityDetails,
];

const renderEmploymentStatusScreen = () => {
  jest.clearAllMocks();
  return render(<EmploymentStatusScreen eligibilityDetailsState={eligibilityDetailsState} />);
};

it('should render all main section headings and text', () => {
  renderEmploymentStatusScreen();

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
  renderEmploymentStatusScreen();
  const employedOption = screen.getByText('Employed');

  act(() => employedOption.click());

  expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
    currentScreen: 'Job Details Screen',
    employmentStatus: 'Employed',
  });
});

it('should handle retired status selection correctly', async () => {
  renderEmploymentStatusScreen();
  const retiredOption = screen.getByText('Retired');

  act(() => retiredOption.click());

  expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
    currentScreen: 'Job Details Screen',
    employmentStatus: 'Retired',
  });
});

it('should handle volunteer status selection correctly', async () => {
  renderEmploymentStatusScreen();
  const volunteerOption = screen.getByText('Volunteer');

  act(() => volunteerOption.click());

  expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
    currentScreen: 'Job Details Screen',
    employmentStatus: 'Volunteer',
  });
});

it('should handle back navigation correctly', async () => {
  renderEmploymentStatusScreen();
  const user = userEvent.setup();
  const backButton = screen.getByText('Back');

  await user.click(backButton);

  expect(mockSetEligibilityDetails).toHaveBeenCalledWith({
    currentScreen: 'Interstitial Screen',
  });
});
