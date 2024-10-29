import '@testing-library/jest-dom';
import { createStore, Provider } from 'jotai';
import { ReactNode, act } from 'react';
import Toaster, { getToastClasses } from './index';
import Toast from '../index';
import { render, screen } from '@testing-library/react';
import { toastAtom, toastDefaultOptions } from '../toastState';
import { ToastPosition } from '../ToastTypes';

const store = createStore();
const TestHarness = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('Toaster', () => {
  it("should render nothing when the toastAtom's  toast prop is set to null", () => {
    const { container } = render(
      <TestHarness>
        <Toaster />
      </TestHarness>,
    );
    expect(container.firstChild).toBeNull();

    const { toast } = store.get(toastAtom);
    expect(toast).toBeNull();
  });

  it("should render a toast component when toastAtom's toast prop is set", async () => {
    render(
      <TestHarness>
        <Toaster />
      </TestHarness>,
    );
    const toast = <Toast text={'foobar'} />;
    act(() => {
      store.set(toastAtom, (prev) => ({ ...prev, toast }));
    });
    const txt = screen.getByText('foobar');
    expect(txt).not.toBeNull();
  });

  it.each(Object.values(ToastPosition))('Position: %s', (position) => {
    render(
      <TestHarness>
        <Toaster />
      </TestHarness>,
    );
    const toast = <Toast text={'foobar'} title={position} />;
    const classes = getToastClasses(position);
    act(() => {
      store.set(toastAtom, (prev) => ({
        ...prev,
        toast,
        options: { ...toastDefaultOptions, position },
      }));
    });
    const div = screen.getByTestId('toaster');
    expect(div).toHaveClass(classes);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent(position);
  });
});
