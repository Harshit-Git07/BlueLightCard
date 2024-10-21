import { render, screen } from '@testing-library/react';
import { FilterDrawerProps } from '@/components/FilterDrawer/types';
import FilterDrawer from '@/components/FilterDrawer/FilterDrawer';
import React from 'react';
import Checkbox from '@/components/FilterDrawer/FilterCheckbox';
import Select from '@/components/FilterDrawer/FilterSelect';
import PersonalDetails from '@/components/FilterDrawer/FilterPersonalDetails';
import CardNumber from '@/components/FilterDrawer/FilterCardNumber';
import DateToFrom from '@/components/FilterDrawer/FilterDateToFrom';

describe('Filter Drawer component', () => {
  let props: FilterDrawerProps;
  const mockSetIsDrawerOpen = jest.fn();

  describe('smoke test', () => {
    beforeEach(() => {
      props = {
        heading: 'Filters',
        isOpen: true,
        setIsOpen: mockSetIsDrawerOpen,
        component: [
          {
            title: 'User Status',
            content: [
              <Checkbox
                key={'userAwaitingApproval'}
                id={'userAwaitingApproval'}
                label={'Awaiting Approval'}
              />,
              <Checkbox key={'userAwaitingId'} id={'userAwaitingId'} label={'Awaiting ID'} />,
              <Checkbox key={'userBanned'} id={'userBanned'} label={'Banned'} />,
              <Checkbox key={'userAnonymised'} id={'userAnonymised'} label={'Anonymised'} />,
            ],
          },
          {
            title: 'Trust',
            content: [
              <Select
                id={'selectTrust'}
                key={'selectTrust'}
                placeHolder={'Please Select a Trust'}
                values={[
                  { label: 'Trust One', value: 'Trust One' },
                  { label: 'Trust Two', value: 'Trust Two' },
                  { label: 'Trust Three', value: 'Trust Three' },
                  { label: 'Trust Four', value: 'Trust Four' },
                ]}
              />,
            ],
          },
          {
            title: 'Service',
            content: [
              <Select
                id={'selectService'}
                key={'selectService'}
                placeHolder={'Please Select a Service'}
                values={[
                  { label: 'Service One', value: 'Service One' },
                  { label: 'Service Two', value: 'Service Two' },
                  { label: 'Service Three', value: 'Service Three' },
                  { label: 'Service Four', value: 'Service Four' },
                ]}
              />,
            ],
          },
          {
            title: 'Personal Details',
            content: [<PersonalDetails key={'personalDetails'} />],
          },
          {
            title: 'Card Number',
            content: [<CardNumber key={'cardNumber'} />],
          },
          {
            title: 'Sign Up date',
            content: [<DateToFrom key={'signUpRange'} />],
          },
          {
            title: 'Card Status',
            content: [
              <Checkbox
                key={'cardAwaitingApproval'}
                id={'cardAwaitingApproval'}
                label={'Awaiting Approval'}
              />,
              <Checkbox key={'cardAwaitingId'} id={'cardAwaitingId'} label={'Awaiting ID'} />,
              <Checkbox key={'cardBanned'} id={'cardBanned'} label={'Banned'} />,
              <Checkbox key={'cardAnonymised'} id={'cardAnonymised'} label={'Anonymised'} />,
            ],
          },
        ],
      };
      render(<FilterDrawer {...props} data-testid="filter-drawer" />);
    });

    it('should render component without error', () => {
      const filterDrawer = screen.getByTestId('filter-drawer');
      console.log('filterDrawer: ', filterDrawer);
      expect(filterDrawer).toBeTruthy();
    });
  });

  describe('behaviour test', () => {
    it('should call onClick when button is clicked', () => {
      render(<FilterDrawer {...props} data-testid="filter-drawer" />);
      const button = screen.getByTestId('filter-drawer-toggle');
      button.click();
      expect(mockSetIsDrawerOpen).toHaveBeenCalledTimes(1);
    });
  });
});
