import '@testing-library/jest-dom';

// import { IdVerificationMethod } from '../../IdVerificationTypes';
import { screen } from '@testing-library/react';
import { idVerificationText } from '../../IdVerificationConfig';

// const memberId = 'abcd-1234';
// const verificationMethod = IdVerificationMethod.PAYSLIP;
describe('IdVerificationFileUpload component', () => {
  it.skip('should render the file upload screen', async () => {
    // await testRender({ memberId, verificationMethod });
    // const detail = screen.getByText(config.detail ?? '', { collapseWhitespace: false });
    // expect(detail).toBeInTheDocument();
    //
    // const btn = screen.getByLabelText(`Button for ${config.title}`);
    // expect(btn).toHaveClass(colours.borderPrimary);

    const txt = screen.getByText(idVerificationText.docsWillBeDeleted);
    expect(txt).toBeInTheDocument();
  });

  it.skip('should render disable the next button until files are selected', async () => {
    // await testRender({ memberId, verificationMethod });
    const btn = screen.getByRole('button', { name: 'Next' });
    expect(btn).toBeDisabled();
  });
});
