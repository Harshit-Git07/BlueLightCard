import { act, render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../OfferDetailsContext.stories';
import { PlatformAdapterProvider, useMockPlatformAdapter } from 'src/adapters';

const { View, ShowOfferSheet, ShowOfferLink } = composeStories(stories);

describe('ViewOfferProvider', () => {
  test('it renders the given children', () => {
    const screen = render(<View />);

    const viewOfferButton = screen.getByText('View Offer');

    expect(viewOfferButton).not.toBeNull();
    expect(screen.asFragment()).toMatchSnapshot();
  });

  test('it renders the offer sheet', async () => {
    const screen = render(<ShowOfferSheet />);

    await act(async () => {
      await ShowOfferSheet.play({ canvasElement: screen.container });
    });

    expect(screen.asFragment()).toMatchSnapshot();
  });

  test('it renders the offer link', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter();

    const screen = render(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <ShowOfferLink />
      </PlatformAdapterProvider>,
    );

    await act(async () => {
      await ShowOfferLink.play({ canvasElement: screen.container });
    });

    expect(screen.asFragment()).toMatchSnapshot();
  });
});
