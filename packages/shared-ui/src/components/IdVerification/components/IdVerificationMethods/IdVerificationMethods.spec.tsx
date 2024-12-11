import '@testing-library/jest-dom';
import { testRender } from '../../IdVerification.spec';
import { screen, within } from '@testing-library/react';
import { idVerificationText } from '../../IdVerificationConfig';
import { act } from 'react';
import { userEvent } from '@storybook/testing-library';
import { idVerificationAtom } from '../../idVerificationAtom';
import { IdVerificationMethod } from '../../IdVerificationTypes';
import { colours } from '../../../../tailwind/theme';

const memberUuid = 'abcd-1234';
describe('IdVerificationMethods component', () => {
  describe('Single id verification', () => {
    it('should render the method selection options when not doubleId', async () => {
      await testRender({ memberUuid });
      expect(screen.getByText(idVerificationText.intro.default)).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Payslip')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for NHS Smart Card')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work ID Card')).toBeInTheDocument();
    });

    it('should enable the next button when a choice is made', async () => {
      const { store } = await testRender({ memberUuid });
      const btn = screen.getByRole('button', { name: 'Next' });
      expect(btn).toBeDisabled();

      const payslip = screen.getByLabelText('Button for Payslip');
      await act(() => userEvent.click(payslip));

      expect(btn).toBeEnabled();
      await act(() => userEvent.click(btn));

      expect(screen.getByText('Upload from your device or camera')).toBeInTheDocument();
      const atomValue = store.get(idVerificationAtom);
      expect(atomValue).toHaveProperty('selectedMethod', IdVerificationMethod.PAYSLIP);
    });
  });

  describe('Double Id verification', () => {
    it('should render supporting options alongside a primary id (doubleId', async () => {
      await testRender({ memberUuid, isDoubleId: true });
      expect(screen.getByText(idVerificationText.intro.withSupporting)).toBeInTheDocument();
      expect(screen.getByText('Choose a supporting document')).toBeInTheDocument();
      const workContract = screen.getByLabelText('Button for Work Contract');
      expect(workContract).toBeInTheDocument();
      expect(within(workContract).getByText('Primary document')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Payslip')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for NHS Smart Card')).toBeInTheDocument();
      expect(screen.getByLabelText('Button for Work ID Card')).toBeInTheDocument();
    });

    it('should enable the next button when a supporting choice is made', async () => {
      const { store } = await testRender({ memberUuid, isDoubleId: true });
      const workContract = screen.getByLabelText('Button for Work Contract');
      expect(workContract).toHaveClass(colours.borderPrimary);

      const btn = screen.getByRole('button', { name: 'Next' });
      expect(btn).toBeDisabled();

      const nhs = screen.getByLabelText('Button for NHS Smart Card');
      await act(() => userEvent.click(nhs));

      expect(btn).toBeEnabled();
      await act(() => userEvent.click(btn));

      expect(screen.getByText('Upload from your device or camera')).toBeInTheDocument();
      const atomValue = store.get(idVerificationAtom);
      expect(atomValue).toHaveProperty('selectedMethod', IdVerificationMethod.NHS_SMART_CARD);
    });
  });
});
