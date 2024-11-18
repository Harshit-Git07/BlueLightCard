import Link from '@/components/Link/Link';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';

describe('Custom Link component which allows for legacy routing', () => {
  it('should use an anchor tag when useLegacyRouting is true', () => {
    render(
      <Link useLegacyRouting={true} href="/test">
        Test
      </Link>
    );

    const element = screen.getByTestId('anchor-link');
    expect(element).toBeTruthy();
  });

  it('should include onClick handler when useLegacyRouting is true', () => {
    const onClickLinkMock = jest.fn();

    render(
      <Link useLegacyRouting={true} href="/test" onClickLink={onClickLinkMock}>
        Test
      </Link>
    );

    const element = screen.getByTestId('anchor-link');
    element.click();

    expect(onClickLinkMock).toHaveBeenCalled();
  });

  it('should use an Next Link when useLegacyRouting is false', () => {
    render(
      <Link useLegacyRouting={false} href="/test">
        Test
      </Link>
    );

    const element = screen.getByTestId('next-link');
    expect(element).toBeTruthy();
  });

  it('should use an Next Link with click handler when useLegacyRouting is false and href present', () => {
    const onClickLinkMock = jest.fn();

    render(
      <Link useLegacyRouting={false} href="/test" onClickLink={onClickLinkMock}>
        Test
      </Link>
    );

    const element = screen.getByTestId('next-link');
    element.click();

    expect(onClickLinkMock).toHaveBeenCalled();
  });

  it('should use a div when there is no href and an onLinkClick function is passed on', () => {
    render(
      <Link useLegacyRouting={false} onClickLink={() => {}}>
        Test
      </Link>
    );

    const element = screen.getByTestId('on-click-link');
    expect(element).toBeTruthy();
  });
});
