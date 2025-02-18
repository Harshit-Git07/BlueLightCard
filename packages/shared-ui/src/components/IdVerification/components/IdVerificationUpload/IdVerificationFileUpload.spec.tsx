import '@testing-library/jest-dom';
import { testRender } from '../../IdVerification.spec';
import { IdVerificationMethod } from '../../IdVerificationTypes';
import { screen } from '@testing-library/react';
import { idVerificationText, verificationMethods } from '../../IdVerificationConfig';
import { colours } from '../../../../tailwind/theme';

const memberUuid = 'abcd-1234';
jest.mock('../../../../hooks/useMemberId', () => ({
  __esModule: true,
  default: () => memberUuid,
}));

const selectedMethod = IdVerificationMethod.PAYSLIP;
describe('IdVerificationFileUpload component', () => {
  it('should render the file upload screen', async () => {
    await testRender({ selectedMethod });
    const config = verificationMethods[selectedMethod];
    const detail = screen.getByText(config.detail ?? '', { collapseWhitespace: false });
    expect(detail).toBeInTheDocument();

    const btn = screen.getByLabelText(`Button for ${config.title}`);
    expect(btn).toHaveClass(colours.borderPrimary);

    const txt = screen.getByText(idVerificationText.docsWillBeDeleted);
    expect(txt).toBeInTheDocument();
  });

  it('should render disable the next button until files are selected', async () => {
    await testRender({ selectedMethod });
    const btn = screen.getByRole('button', { name: 'Next' });
    expect(btn).toBeDisabled();
  });
});
