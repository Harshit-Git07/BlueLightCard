import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalNavigation, {
  NavItem,
  DropdownItem,
  Divider,
} from '../../GlobalNavigation/GlobalNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrid2 } from '@fortawesome/pro-regular-svg-icons';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import userEvent from '@testing-library/user-event';

describe('GlobalNavigation component', () => {
  it('should render GlobalNavigation component', () => {
    render(<GlobalNavigation />);
  });
});

describe('NavItem component', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should render NavItem component with correct props', () => {
    render(
      <NavItem
        link="/#"
        icon={<FontAwesomeIcon icon={faGrid2} />}
        menu="Dashboard"
        submenu={false}
      />,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
  it('clicking on NavItem should render DropdownItem component', async () => {
    render(
      <NavItem link="/#" icon={<FontAwesomeIcon icon={faGrid2} />} menu="Dashboard" submenu={true}>
        <DropdownItem link="/#" menu="Test" />
      </NavItem>,
    );
    const button = screen.getByText('Dashboard');
    await act(() => user.click(button));
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  it('DropdownItem component renders with correct props', () => {
    const { getByText } = render(<DropdownItem link="/#" menu="Submenu Item 1" />);
    expect(getByText('Submenu Item 1')).toBeInTheDocument();
  });

  it('Divider component renders without errors', () => {
    render(<Divider />);
  });
});
