import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CampaignCard, { CampaignCardProps } from '.';

describe('CampaignCard component', () => {
  const args: CampaignCardProps = {
    linkUrl: 'www.samsung.com',
    name: 'Samsung',
    image: '/assets/forest.jpeg',
  };
  it('Should render CampaignCard component without error', () => {
    render(<CampaignCard {...args} />);
  });

  it('Should render CampaignCard component with an image', () => {
    render(<CampaignCard {...args} />);
    const image = screen.getByRole('img');
    expect(image).toBeTruthy();
  });

  it('Should register click events for the CampaignCard', () => {
    const onClick = jest.fn();
    render(<CampaignCard {...args} onClick={onClick} />);

    const image = screen.getByRole('img');
    fireEvent.click(image);

    expect(onClick).toHaveBeenCalled();
  });
});
