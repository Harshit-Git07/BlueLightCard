import CompanyAbout from './CompanyAbout';
import { CompanyAboutProps } from './types';

import { render, screen } from '@testing-library/react';

describe('CompanyAbout component', () => {
  const props = {
    CompanyName: 'Company Name',
    CompanyDescription: 'Company Description',
  };
  it('should render component without error', () => {
    render(<CompanyAbout {...props} />);

    const companyAboutName = screen.getByText('Company Name');
    expect(companyAboutName).toBeTruthy();
  });

  it('should render empty company about', () => {
    const props = {
      CompanyName: '',
      CompanyDescription: '',
    };
    render(<CompanyAbout {...props} />);

    const companyAboutName = screen.findAllByText('Company Name');
    expect(companyAboutName).toMatchSnapshot();
  });
});
