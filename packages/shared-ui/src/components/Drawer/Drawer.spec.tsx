import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Drawer from './index';
import { createStore, Provider } from 'jotai';
import { act } from 'react';
import useDrawer, { drawerAtom, initializeDrawerAtom } from './useDrawer';

const store = createStore();
const TestHarness = () => {
  return (
    <Provider store={store}>
      <Drawer />
      <TestLaunchButton />
    </Provider>
  );
};

const TestLaunchButton = () => {
  const { open } = useDrawer();
  const onOpen = () => {
    open(<h2>OPENED FROM BUTTON</h2>);
  };
  return (
    <button onClick={onOpen} aria-label={'open'}>
      OPEN
    </button>
  );
};

describe('Drawer', () => {
  beforeEach(() => {
    store.set(drawerAtom, () => initializeDrawerAtom());
  });

  it('should render an empty/closed drawer', () => {
    render(<TestHarness />);
    const sidebar = screen.getByLabelText('sidebar') as HTMLElement;
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('aria-hidden', 'true');

    const blackout = sidebar.firstChild;
    expect(blackout).toHaveClass('opacity-0 pointer-events-none');

    const aside = sidebar.children[1];
    expect(aside).toHaveClass('tablet:-right-[384px]');
    expect(aside.children.length).toEqual(0);

    const btn = within(sidebar).queryByRole('button');
    expect(btn).toBeNull();
  });

  it('should render an open drawer', () => {
    store.set(drawerAtom, { children: <h1>HelloWorld</h1>, showCloseButton: true });
    render(<TestHarness />);

    const sidebar = screen.getByLabelText('sidebar') as HTMLElement;
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('aria-hidden', 'false');

    const blackout = sidebar.firstChild;
    expect(blackout).toHaveClass('opacity-100');

    const aside = sidebar.children[1];
    expect(aside).toHaveClass('right-0');
    expect(aside.children.length).toEqual(2);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    const helloWorld = screen.getByText('HelloWorld');
    expect(helloWorld).toBeInTheDocument();
  });

  it('should close when X is clicked', async () => {
    store.set(drawerAtom, { children: <h1>HelloWorld</h1>, showCloseButton: true });
    render(<TestHarness />);

    const btn = screen.getByLabelText('close');
    await act(async () => {
      await userEvent.click(btn);
    });

    await waitFor(async () => {
      expect(store.get(drawerAtom)).toHaveProperty('children', null);
    });
  });

  it('should close when overlay is clicked', async () => {
    store.set(drawerAtom, { children: <h1>HelloWorld</h1>, showCloseButton: true });
    render(<TestHarness />);

    const sidebar = screen.getByLabelText('sidebar') as HTMLElement;
    const blackout = sidebar.firstChild as HTMLElement;

    await act(async () => {
      await userEvent.click(blackout);
    });

    await waitFor(async () => {
      expect(store.get(drawerAtom)).toHaveProperty('children', null);
    });
  });

  it('should close when escape is pressed', async () => {
    store.set(drawerAtom, { children: <h1>HelloWorld</h1>, showCloseButton: true });
    render(<TestHarness />);

    await act(async () => {
      await userEvent.keyboard('[Escape]');
    });

    await waitFor(async () => {
      expect(store.get(drawerAtom)).toHaveProperty('children', null);
    });
  });

  describe('useDrawer', () => {
    it('should open using the hook', async () => {
      render(<TestHarness />);
      const btn = screen.getByLabelText('open');

      await act(async () => {
        await userEvent.click(btn);
      });

      await waitFor(() => {
        const text = screen.getByText('OPENED FROM BUTTON');
        expect(text).toBeInTheDocument();
      });
    });
  });
});
