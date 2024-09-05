import '@testing-library/jest-dom';
import { render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../CampaignBanner.stories';

const { Default } = composeStories(stories);

describe('CampaignBanner', () => {
  it('renders the banner', async () => {
    const { container } = render(<Default />);

    const [_, bannerButton] = await within(container).findAllByRole('button');
    const image = bannerButton.querySelector('div > div > img');

    expect(bannerButton).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/_next/image?url=%2Fspin_to_win.jpg&w=3840&q=75');
  });

  it('calls the onClick event when the banner is clicked', async () => {
    const onClick = jest.fn();
    const { container } = render(<Default onClick={onClick} />);

    const [_, bannerButton] = await within(container).findAllByRole('button');
    const image = bannerButton.querySelector('div > div > img');

    if (!image) throw new Error('Banner image is not in the document');

    await userEvent.click(image);

    expect(onClick).toHaveBeenCalledWith({
      id: '1',
      content: {
        imageURL: '/spin_to_win.jpg',
        iframeURL: 'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f',
      },
    });
  });
});
