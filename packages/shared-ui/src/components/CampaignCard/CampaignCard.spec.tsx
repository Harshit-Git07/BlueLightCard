import { render, screen } from '@testing-library/react';
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
});
