import { render, screen, act, queryByAttribute } from '@testing-library/react';
import '@testing-library/jest-dom';
import EligibilityCard from '../../EligibilityCard/EligibilityCard';
import { EligibilityCardProps } from '../../EligibilityCard/Types';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

const getById = queryByAttribute.bind(null, 'id');

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      push: jest.fn(),
    };
  },
}));
describe('EligibilityCard component', () => {
  let props: EligibilityCardProps;
  let user: UserEvent;
  const router = useRouter();
  beforeEach(() => {
    props = {
      isLoading: false,
      steps: 2,
      formSubmitted: jest.fn(),
      onNext: jest.fn(),
      onSubmit: jest.fn(),
      quit: jest.fn(),
      eligible: '',
      setEligible: jest.fn(),
      employment: 'Employed',
      setEmployment: jest.fn(),
      loading: false,
      setLoading: jest.fn(),
      organisation: 'NHS',
      setOrganisation: jest.fn(),
      employer: 'Health Education England',
      setEmployer: jest.fn(),
      otherOrg: '',
      setOtherOrg: jest.fn(),
      otherEmp: '',
      setOtherEmp: jest.fn(),
      jobRole: '',
      setJobRole: jest.fn(),
      orgDetails: {},
      setOrgDetails: jest.fn(),
      acceptedId: '',
      setAcceptedId: jest.fn(),
      employers: [],
      setEmployers: jest.fn(),
      currentStep: 1,
      setCurrentStep: jest.fn(),
      orgOptions: [],
      setOrgOptions: jest.fn(),
      empOptions: [],
      setEmpOptions: jest.fn(),
      acceptedMethods: [],
      setAcceptedMethods: jest.fn(),
      visible: true,
      setVisible: jest.fn(),
    };
    user = userEvent.setup();
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<EligibilityCard {...props} />);

      //first element in the returned array will be the EligibilityCard component itself.
      const eligibility_card = screen.getAllByRole('article')[0];
      expect(eligibility_card).toBeTruthy();
    });
  });
  describe('disabled button rendering', () => {
    it('Next button should be disabled while form is incomplete', () => {
      render(<EligibilityCard {...props} />);
      const next_button = screen.getByRole('button', { name: 'Next' });

      if (props.employment != '') {
        if (props.empOptions.length == 0) {
          if (props.organisation == '') {
            expect(next_button).toBeDisabled();
          }
        } else {
          if (props.employer == '' || props.organisation == '' || props.jobRole == '') {
            expect(next_button).toBeDisabled();
          }
        }
      } else {
        expect(next_button).toBeDisabled();
      }
    });
    it('Submit button should be disabled while form is incomplete', () => {
      render(<EligibilityCard {...props} currentStep={2} />);
      const submit_button = screen.getByRole('button', { name: 'Submit' });

      expect(submit_button).toBeDisabled();
    });

    it('Back and Quit buttons should be displayed on step 2', () => {
      const dom = render(<EligibilityCard {...props} currentStep={2} />);
      const back_button = getById(dom.container, 'back_button');
      const quit_button = getById(dom.container, 'quit_button');

      expect(back_button).toBeVisible();
      expect(quit_button).toBeVisible();
    });
  });

  describe('EligibilityCard event handling', () => {
    it('should invoke event when quit button is clicked', async () => {
      render(<EligibilityCard {...props} />);
      const button = screen.getAllByRole('button', { name: 'Quit' })[0];
      await act(() => user.click(button));

      //buttons will gain focus when clicked, so it should be a solid indicator of click
      expect(button).toHaveFocus();
    });
    it('should invoke event when finish button is clicked', async () => {
      render(<EligibilityCard {...props} currentStep={3} />);
      const button = screen.getByRole('button', { name: 'Finish' });
      await act(() => user.click(button));
      //buttons will gain focus when clicked, so it should be a solid indicator of click event
      expect(button).toHaveFocus();
    });
    it('should invoke event when next button is clicked', async () => {
      render(<EligibilityCard {...props} jobRole="Nurse" />);
      const button = screen.getByRole('button', { name: 'Next' });
      await act(() => user.click(button));
      expect(props.onNext).toHaveBeenCalled();
    });
    it('should invoke event when submit button is clicked', async () => {
      render(<EligibilityCard {...props} currentStep={2} acceptedId="Payslip" />);
      const button = screen.getByRole('button', { name: 'Submit' });
      await act(() => user.click(button));
      expect(props.onSubmit).toHaveBeenCalled();
    });
    it('should invoke event when back button is clicked', async () => {
      render(<EligibilityCard {...props} currentStep={2} />);
      const this_step = 2;
      const button = screen.getByRole('button', { name: 'Back' });
      await act(() => user.click(button));
      expect(props.currentStep).toBeLessThan(this_step);
    });
    it('should invoke event when sign-up now button is clicked', async () => {
      render(<EligibilityCard {...props} currentStep={3} eligible="Yes" />);
      const button = screen.getByRole('button', { name: 'Sign up now' });
      await act(() => user.click(button));
      //check screen to ensure that eligibility card is no longer rendered, button should no longer be rendered.
      expect(button).toBeInTheDocument();
    });
  });
});
