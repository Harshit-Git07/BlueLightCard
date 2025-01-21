import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import { idVerificationText } from '../../IdVerificationConfig';
import { act } from 'react';
import { userEvent } from '@storybook/testing-library';
import { colours } from '../../../../../tailwind/theme';

// const memberId = 'abcd-1234';
describe('IdVerificationMethods component', () => {
  describe('Single id verification', () => {
    it.skip('should render the method selection options when not doubleId', async () => {
      // await testRender({ memberId });
      expect(screen.getByText(idVerificationText.intro.default)).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Payslip')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for NHS Smart Card')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work ID Card')).toBeInTheDocument();
    });

    it.skip('should enable the next button when a choice is made', async () => {
      // const { store } = await testRender({ memberId });
      const btn = screen.getByRole('button', { name: 'Next' });
      expect(btn).toBeDisabled();

      const payslip = screen.getByLabelText('Button for Payslip');
      await act(() => userEvent.click(payslip));

      expect(btn).toBeEnabled();
      await act(() => userEvent.click(btn));

      expect(screen.getByText('Upload from your device or camera')).toBeInTheDocument();
      // const atomValue = store.get(idVerificationAtom);
      // expect(atomValue).toHaveProperty('verificationMethod', IdVerificationMethod.PAYSLIP);
    });
  });

  describe('Double Id verification', () => {
    it.skip('should render supporting options alongside a primary id (doubleId', async () => {
      // await testRender({ memberId, isDoubleId: true });
      expect(screen.getByText(idVerificationText.intro.withSupporting)).toBeInTheDocument();
      expect(screen.getByText('Choose a supporting document')).toBeInTheDocument();
      const workContract = screen.getByLabelText('Button for Work Contract');
      expect(workContract).toBeInTheDocument();
      expect(within(workContract).getByText('Primary document')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Payslip')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for NHS Smart Card')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work ID Card')).toBeInTheDocument();
    });

    it.skip('should enable the next button when a supporting choice is made', async () => {
      // const { store } = await testRender({ memberId, isDoubleId: true });
      const workContract = screen.getByLabelText('Button for Work Contract');
      expect(workContract).toHaveClass(colours.borderPrimary);

      const btn = screen.getByRole('button', { name: 'Next' });
      expect(btn).toBeDisabled();

      const nhs = screen.getByLabelText('Button for NHS Smart Card');
      await act(() => userEvent.click(nhs));

      expect(btn).toBeEnabled();
      await act(() => userEvent.click(btn));

      expect(screen.getByText('Upload from your device or camera')).toBeInTheDocument();
      // const atomValue = store.get(idVerificationAtom);
      // expect(atomValue).toHaveProperty('verificationMethod', IdVerificationMethod.NHS_SMART_CARD);
    });
  });
});
