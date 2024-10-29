import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toast, { getToastIcon } from './';
import { ToastStatus } from './ToastTypes';
import { createStore, Provider } from 'jotai';
import { act, ReactNode } from 'react';
import { toastAtom } from './toastState';
import userEvent from '@testing-library/user-event';
import { faCircleRadiation } from '@fortawesome/pro-solid-svg-icons';

const store = createStore();
const TestHarness = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Toast component', () => {
  // smoke test
  it('should render component without error', () => {
    const { baseElement } = render(<Toast text={'hello'} />);
    expect(baseElement).toBeTruthy();
  });

  describe('states', () => {
    it.each(Object.values(ToastStatus))('renders with status: %s', (s) => {
      const [ico, classes] = getToastIcon(s);
      render(<Toast text={'hello'} status={s} />);
      const img = screen.getByLabelText(`Icon: ${s}`);
      const svg = img.firstChild;
      expect(svg).toHaveClass(classes);
      expect(svg).toHaveAttribute('data-icon', ico.iconName);
    });
  });

  describe('title and text', () => {
    it('should render a title if given', () => {
      render(<Toast text="foo" title="this is a title" />);
      const title = screen.getByText('this is a title');
      expect(title).toHaveClass('font-typography-title-medium-semibold');
    });

    it('should render just main text', () => {
      render(<Toast text="foo" />);
      const txt = screen.getByText('foo');
      expect(txt).toHaveClass('font-typography-body');
      const title = screen.queryByRole('heading', { level: 1 });
      expect(title).toBeNull();
    });
  });

  describe('close button', () => {
    it('should display a close button', () => {
      render(<Toast text="foo" />);
      const btn = screen.getByLabelText('close');
      expect(btn.firstChild).toHaveAttribute('data-icon', 'xmark');
    });

    it('should close the toast by setting the toast prop of the atom to null', async () => {
      store.set(toastAtom, (prev) => ({ ...prev, toast: 'something' }));
      render(
        <TestHarness>
          <Toast text="foo" />
        </TestHarness>,
      );
      const btn = screen.getByLabelText('close');
      await act(async () => {
        await userEvent.click(btn);
      });
      const { toast } = store.get(toastAtom);
      expect(toast).toBeNull();
    });

    it('should NOT display a close button if hasClose is false', () => {
      render(<Toast text="foo" hasClose={false} />);
      const btn = screen.queryByLabelText('close');
      expect(btn).toBeNull();
    });
  });

  describe('children', () => {
    it('should allow buttons etc to be passed as children', async () => {
      const spy = jest.fn();
      render(
        <Toast text="foo">
          <button aria-label={'ok'} onClick={spy}>
            OK
          </button>
        </Toast>,
      );
      const btn = screen.getByLabelText('ok');
      await userEvent.click(btn);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('icon', () => {
    it('should override the icon with another FontAwesome icon', () => {
      render(<Toast text={'hello'} status={ToastStatus.Default} icon={faCircleRadiation} />);
      const img = screen.getByLabelText(`Icon: Default`);
      const svg = img.firstChild;
      expect(svg).toHaveAttribute('data-icon', 'circle-radiation');
    });
  });
});
