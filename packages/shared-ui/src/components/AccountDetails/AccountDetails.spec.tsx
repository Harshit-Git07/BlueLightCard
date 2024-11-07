import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import renderer from 'react-test-renderer';
import AccountDetails from './index';

describe('AccountDetails', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  it('should render AccountDetails correctly', () => {
    const props = {
      alertType: 'success',
      title: 'Success Alert',
      description: 'This is a success message.',
    };

    const component = renderer.create(
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <AccountDetails accountNumber="BLC0000000" firstName="Name" lastName="Last-name" />
      </PlatformAdapterProvider>,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
