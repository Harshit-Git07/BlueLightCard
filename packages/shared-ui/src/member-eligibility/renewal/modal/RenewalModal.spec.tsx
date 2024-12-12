import { RenewalModalDesktop } from './RenewalModalDesktop';
import { RenewalModalMobile } from './RenewalModalMobile';
import { renderWithMockedPlatformAdapter } from './testing/MockedPlatformAdaptor';
import { useMedia } from 'react-use';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-use', () => ({
  useMedia: jest.fn(), // Mock useMedia
}));

const useMediaMock = useMedia as jest.Mock;

describe('snapshot test', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(false);
  });

  it('renders a the desktop renewal modal', () => {
    const component = renderWithMockedPlatformAdapter(<RenewalModalDesktop></RenewalModalDesktop>);

    expect(component).toMatchSnapshot();
  });

  it('renders a the mobile renewal modal', () => {
    const component = renderWithMockedPlatformAdapter(<RenewalModalMobile></RenewalModalMobile>);
    expect(component).toMatchSnapshot();
  });
});
