import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import userEvent from '@testing-library/user-event';
import VerticalMenuItem from './index';
import VerticalMenuItemProps from './types';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => (
    <span data-testid="font-awesome-icon" data-icon={icon.iconName}>
      FontAwesomeIcon
    </span>
  ),
}));

describe('VerticalMenuItem component', () => {
  const defaultOnClickProps: VerticalMenuItemProps = {
    label: 'test',
    onClick: () => undefined,
    selected: false,
  };

  const defaultHRefProps: VerticalMenuItemProps = {
    label: 'test',
    href: '/',
    selected: false,
  };

  const defaultIconProps: VerticalMenuItemProps = {
    label: 'test',
    href: '/',
    selected: false,
    icon: faArrowUpRightFromSquare,
  };

  // smoke test
  it('should render without error', async () => {
    const { baseElement: onClickElement } = render(<VerticalMenuItem {...defaultOnClickProps} />);
    expect(onClickElement).toBeTruthy();

    const { baseElement: hrefElement } = render(<VerticalMenuItem {...defaultHRefProps} />);
    expect(hrefElement).toBeTruthy();
  });

  it('triggers onClick fn when clicked', async () => {
    const mockFn = jest.fn();
    render(<VerticalMenuItem {...defaultOnClickProps} onClick={mockFn} />);

    const textToClick = screen.getByText('test');
    await userEvent.click(textToClick);

    expect(mockFn).toHaveBeenCalled();
  });

  it('renders a link when passed href', async () => {
    render(<VerticalMenuItem {...defaultHRefProps} />);

    const linkItem = screen.getByRole('link');

    expect(linkItem).toBeTruthy();
  });

  it('renders an icon when passed icon', async () => {
    const { getByTestId } = render(<VerticalMenuItem {...defaultIconProps} />);

    const icon = getByTestId('font-awesome-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should not render an icon by default', async () => {
    const { queryByTestId } = render(<VerticalMenuItem {...defaultOnClickProps} />);

    const icon = queryByTestId('font-awesome-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('matches snapshot in its default state', async () => {
    const { container } = render(<VerticalMenuItem {...defaultOnClickProps} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot in its selected state', async () => {
    const { container } = render(<VerticalMenuItem {...defaultOnClickProps} selected />);

    expect(container).toMatchSnapshot();
  });

  it('should be accessible', async () => {
    render(<VerticalMenuItem {...defaultOnClickProps} />);
    const btn = screen.getByLabelText(defaultOnClickProps.label);
    expect(btn).toHaveAttribute('aria-label', defaultOnClickProps.label);
  });
});
