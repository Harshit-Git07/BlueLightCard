import renderer from 'react-test-renderer';
import { render, fireEvent, act } from '@testing-library/react';
import ShareButton from './';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { useMedia } from 'react-use';

jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

Object.defineProperty(global, 'navigator', {
  value: {
    clipboard: { writeText: jest.fn() },
    share: jest.fn(),
  },
  writable: true,
});

describe('ShareButton component', () => {
  const shareDetails = {
    name: 'Test Name',
    description: 'Test Description',
    url: 'https://www.test-url.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render ShareButton component with no errors', () => {
    const platformAdapter = useMockPlatformAdapter();
    const component = renderer.create(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} />
      </PlatformAdapterProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should display Share text and icon when shareBtnState is "share"', () => {
    const platformAdapter = useMockPlatformAdapter();
    (useMedia as jest.Mock).mockReturnValue(false); // not mobile

    const { getByText, getByTestId } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} />
      </PlatformAdapterProvider>,
    );
    expect(getByText(/share/i)).toBeTruthy();
    expect(getByTestId('font-awesome-share-icon')).toBeTruthy();
  });

  it('Should display custom share label when shareBtnState is "share" and shareLabel prop is custom', () => {
    const platformAdapter = useMockPlatformAdapter();
    (useMedia as jest.Mock).mockReturnValue(false); // not mobile

    const { getByText, getByTestId } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} shareLabel="Share offer" />
      </PlatformAdapterProvider>,
    );
    expect(getByText(/share offer/i)).toBeTruthy();
    expect(getByTestId('font-awesome-share-icon')).toBeTruthy();
  });

  it('Should display Link copied text and check icon when shareBtnState is "success"', async () => {
    const platformAdapter = useMockPlatformAdapter();
    (useMedia as jest.Mock).mockReturnValue(false); // not mobile
    (global.navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined); // copy is successful

    const { getByText, getByTestId } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} />
      </PlatformAdapterProvider>,
    );

    fireEvent.click(getByText('Share'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 500)); // wait for state update
    });

    expect(getByText('Link copied')).toBeTruthy();
    expect(getByTestId('check-icon')).toBeTruthy();
  });

  it('Should copy link when on mobile and navigator.share is not available', async () => {
    const platformAdapter = useMockPlatformAdapter();
    (useMedia as jest.Mock).mockReturnValue(true); // mobile
    Reflect.deleteProperty(global.navigator, 'share'); // navigator.share is not available
    (global.navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined); // copy is successful

    const { getByText, getByTestId } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} />
      </PlatformAdapterProvider>,
    );

    fireEvent.click(getByText('Share'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 500)); // wait for state update
    });

    expect(getByText('Link copied')).toBeTruthy();
    expect(getByTestId('check-icon')).toBeTruthy();
  });

  it('Should display Failed to copy text and error icon when copy is unsuccessful', async () => {
    const platformAdapter = useMockPlatformAdapter();
    (useMedia as jest.Mock).mockReturnValue(false); // not mobile
    Reflect.deleteProperty(global.navigator, 'clipboard'); // copy is unsuccessful

    const { getByText, queryByText, getByTestId } = render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <ShareButton shareDetails={shareDetails} />
      </PlatformAdapterProvider>,
    );

    fireEvent.click(getByText('Share'));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 500)); // wait for state update
    });

    expect(queryByText('Failed to copy')).toBeTruthy();
    expect(getByTestId('font-awesome-error-icon')).toBeTruthy();
  });
});
