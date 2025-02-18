import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { idVerificationText } from '../../IdVerificationConfig';

describe('IdVerificationFileUpload component', () => {
  it.skip('should render the file upload screen', async () => {
    const txt = screen.getByText(idVerificationText.docsWillBeDeleted);
    expect(txt).toBeInTheDocument();
  });

  it.skip('should render disable the next button until files are selected', async () => {
    const btn = screen.getByRole('button', { name: 'Next' });
    expect(btn).toBeDisabled();
  });
});
