import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileCardProps } from '../../ProfileCard/types';
import ProfileCard from '../../ProfileCard/ProfileCard';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import userEvent from '@testing-library/user-event';

describe('ProfileCard component', () => {
  let props: ProfileCardProps;
  let user: UserEvent;
  beforeEach(() => {
    props = {
      user_name: 'Joe Bloggs',
      user_ms_role: 'Manager',
      data_pairs: [
        {
          label: 'Email',
          value: 'joebloggs@abc.co.uk',
        },
        {
          label: 'password',
          value: '***********',
        },
      ],
      user_image: 'https://via.placeholder.com/106x106',
    };
    user = userEvent.setup();
  });
  it('should render ProfileCard component', () => {
    render(<ProfileCard {...props} />);
  });
  it('should render ProfileCard component with correct user name', () => {
    render(<ProfileCard {...props} />);
    const userName = screen.getByText(props.user_name);
    expect(userName).toBeInTheDocument();
  });
  it('should render ProfileCard component with correct user role', () => {
    render(<ProfileCard {...props} />);
    const userRole = screen.getByText(props.user_ms_role);
    expect(userRole).toBeInTheDocument();
  });
  it('should render ProfileCard with correct data_pairs', () => {
    render(<ProfileCard {...props} />);
    const email = screen.getByText(props.data_pairs[0].value);
    const password = screen.getByText(props.data_pairs[1].value);
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });
  it('should render ProfileCard component with image', () => {
    render(<ProfileCard {...props} />);
    const userImage = screen.getByAltText('Profile Picture');
    expect(userImage).toBeInTheDocument();
  });
  it('Profile Card should contain button', () => {
    render(<ProfileCard {...props} />);
    const button = screen.getByRole('button', { name: "Why can't I edit?" });
    expect(button).toBeInTheDocument();
  });
  it('Profile Card should contain edit modal', async () => {
    render(<ProfileCard {...props} />);
    const button = screen.getByRole('button', { name: "Why can't I edit?" });
    await act(() => user.click(button));
    const modal = screen.getByRole('complementary');
    expect(modal).toBeInTheDocument();
  });
});
