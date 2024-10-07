import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerticalMenuItem, { Props } from './';
import userEvent from '@testing-library/user-event';

describe('VerticalMenuItem component', () => {
  const defaultOnClickProps: Props = {
    label: 'test',
    onClick: () => undefined,
    selected: false,
  };

  const defaultHRefProps: Props = {
    label: 'test',
    href: '/',
    selected: false,
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

  it('matches snapshot in its default state', async () => {
    const { container } = render(<VerticalMenuItem {...defaultOnClickProps} />);

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot in its selected state', async () => {
    const { container } = render(<VerticalMenuItem {...defaultOnClickProps} selected />);

    expect(container).toMatchSnapshot();
  });
});
