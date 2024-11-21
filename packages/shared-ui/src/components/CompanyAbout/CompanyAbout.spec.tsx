import CompanyAbout from '.';
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

    const companyAboutName = screen.queryByText('Company Name');
    expect(companyAboutName).toBeNull();
  });
});
