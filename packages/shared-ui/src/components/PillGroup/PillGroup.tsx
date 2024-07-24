import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PillGroup from '.';
import { PillGroupProps } from './types';

describe('CampaignCard component', () => {
  const args: PillGroupProps = {
    title: 'Title',
    onSelectedPill: () => void 0,
    pillGroup: [
      { id: 1, label: 'Pill 1' },
      { id: 2, label: 'Pill 1' },
      { id: 3, label: 'Pill 1' },
    ],
  };
  it('Should render BrowseCategories component without error', () => {
    render(<PillGroup {...args} />);
  });

  it('Should render BrowseCategories component with a title', () => {
    render(<PillGroup {...args} />);
    const title = screen.getByText(/title/i);
    expect(title).toBeVisible();
  });

  it('Should render BrowseCategories component with three Pills', () => {
    render(<PillGroup {...args} />);
    const button = screen.getAllByRole('button');
    expect(button).toHaveLength(3);
  });
});
