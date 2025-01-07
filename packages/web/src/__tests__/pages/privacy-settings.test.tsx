import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import PrivacySettingsPage, { supportLink } from '../../pages/privacy-settings';
import { BRANDS } from '@/types/brands.enum';

describe('PrivacySettingsPage', () => {
  const supportLink =
    'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969';

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Privacy heading', () => {
    render(<PrivacySettingsPage />);
    const heading = screen.getByRole('heading', { name: /privacy/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders Request your data access section with button and description', () => {
    render(<PrivacySettingsPage />);

    expect(screen.getByText('Request your data access')).toBeInTheDocument();

    expect(
      screen.getByText('Access all the data we hold on you anytime you wish.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request your data/i })).toBeInTheDocument();
    const downloadIcon = document.querySelector('[data-icon="download"]');
    expect(downloadIcon).toBeInTheDocument();
  });

  test('renders Delete your account section with button and description', () => {
    render(<PrivacySettingsPage />);

    expect(screen.getByText('Delete your account')).toBeInTheDocument();

    expect(
      screen.getByText(
        'You can delete your account anytime. This will remove your personal data and end your access to the Blue Light Card community and its exclusive offers.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument();
    const trashIcon = document.querySelector('[data-icon="trash"]');
    expect(trashIcon).toBeInTheDocument();
  });

  test('opens support link in a new tab when "Request your data" button is clicked', () => {
    render(<PrivacySettingsPage />);
    const requestButton = screen.getByRole('button', { name: /request your data/i });

    fireEvent.click(requestButton);
    expect(window.open).toHaveBeenCalledWith(supportLink, '_blank', 'noopener,noreferrer');
  });

  test('opens support link in a new tab when "Delete account" button is clicked', () => {
    render(<PrivacySettingsPage />);
    const deleteButton = screen.getByRole('button', { name: /delete account/i });

    fireEvent.click(deleteButton);
    expect(window.open).toHaveBeenCalledWith(supportLink, '_blank', 'noopener,noreferrer');
  });
});

describe('SupportLink', () => {
  it('returns the correct URL for BLC_UK', () => {
    expect(supportLink(BRANDS.BLC_UK)).toBe(
      'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969'
    );
  });

  it('returns the correct URL for DDS_UK', () => {
    expect(supportLink(BRANDS.DDS_UK)).toBe(
      'https://support.defencediscountservice.co.uk/hc/en-gb/requests/new?ticket_form_id=25146038943889'
    );
  });

  it('returns the correct URL for BLC_AU', () => {
    expect(supportLink(BRANDS.BLC_AU)).toBe(
      'https://support-zendesk.bluelightcard.com.au/hc/en-gb/requests/new?ticket_form_id=28000130152593'
    );
  });

  it('returns the default URL when brand is not recognized', () => {
    expect(supportLink('UNKNOWN_BRAND' as any)).toBe(
      'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969'
    );
  });
});
