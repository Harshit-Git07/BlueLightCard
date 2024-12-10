import { RenewalModalDesktop } from '@/root/src/member-eligibility/renewal/modal/RenewalModalDesktop';
import { RenewalModalMobile } from '@/root/src/member-eligibility/renewal/modal/RenewalModalMobile';
import { useMedia } from 'react-use';
import { renderWithMockedPlatformAdapter } from '@/root/src/member-eligibility/shared/testing/MockedPlatformAdaptor';

jest.mock('react-use');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const useMediaMock = jest.mocked(useMedia);

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
