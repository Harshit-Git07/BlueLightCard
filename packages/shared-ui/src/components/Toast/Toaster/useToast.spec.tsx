import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useToaster from './useToaster';
import Toast from '../index';
import { createStore, Provider } from 'jotai';
import { act, ReactNode } from 'react';
import { ToastPosition } from '../ToastTypes';
import { initializeToastAtom, toastAtom } from '../toastState';
import { createTimer } from '../../../utils/pausableTimer';

const store = createStore();
const TestHarness = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);
describe('useToaster hook', () => {
  it('should provide the current state of the toastAtom', () => {
    const { result } = renderHook(() => useToaster(), { wrapper: TestHarness });
    const { current } = result;
    expect(current).toHaveProperty('timer', undefined);
    expect(current).toHaveProperty('toast', null);
    expect(current).toHaveProperty('options');
    expect(current.options).toHaveProperty('duration', 7000);
    expect(current.options).toHaveProperty('position', ToastPosition.TopLeft);
  });

  it('should have a closeToast function that resets the toastAtom', () => {
    const t = createTimer(jest.fn(), 1000);
    t.pause();
    store.set(toastAtom, () => ({
      toast: 'something',
      timer: t,
      options: { duration: 100, position: ToastPosition.TopCenter },
    }));
    const { result } = renderHook(() => useToaster(), { wrapper: TestHarness });
    const { current } = result;
    expect(current).toHaveProperty('closeToast');
    const { closeToast } = current;
    act(() => {
      closeToast();
    });
    const updated = store.get(toastAtom);
    expect(updated).toHaveProperty('timer', undefined);
    expect(updated).toHaveProperty('toast', null);
    expect(updated.options).toHaveProperty('duration', 7000);
    expect(updated.options).toHaveProperty('position', ToastPosition.TopLeft);
  });

  it('should have an openToast function that creates in the toastAtom', () => {
    store.set(toastAtom, initializeToastAtom);
    const testToast = <Toast text={'foobar'} />;
    const { result } = renderHook(() => useToaster(), { wrapper: TestHarness });
    const { current } = result;
    expect(current).toHaveProperty('openToast');
    const { openToast } = current;
    act(() => {
      openToast(testToast, { duration: 20000, position: ToastPosition.BottomRight });
    });
    const updated = store.get(toastAtom);
    expect(updated).not.toHaveProperty('timer', undefined);
    expect(updated).toHaveProperty('toast', testToast);
    expect(updated.options).toHaveProperty('duration', 20000);
    expect(updated.options).toHaveProperty('position', ToastPosition.BottomRight);

    clearTimeout(updated.timer?.getTimerId());
  });

  it('should not set a timeout if the duration option is 0', () => {
    store.set(toastAtom, initializeToastAtom);
    const testToast = <Toast text={'foobar'} />;
    const { result } = renderHook(() => useToaster(), { wrapper: TestHarness });
    const { current } = result;
    expect(current).toHaveProperty('openToast');
    const { openToast } = current;
    act(() => {
      openToast(testToast, { duration: 0, position: ToastPosition.BottomRight });
    });
    const updated = store.get(toastAtom);
    expect(updated).toHaveProperty('timer', undefined);
    expect(updated).toHaveProperty('toast', testToast);
    expect(updated.options).toHaveProperty('duration', 0);
  });

  it('should close after duration has elapsed', async () => {
    store.set(toastAtom, initializeToastAtom);
    const testToast = <Toast text={'foobar'} />;
    const { result } = renderHook(() => useToaster(), { wrapper: TestHarness });
    const { current } = result;
    expect(current).toHaveProperty('openToast');
    const { openToast } = current;
    act(() => {
      openToast(testToast, { duration: 50, position: ToastPosition.BottomRight });
    });

    await waitFor(async () => {
      const updated = store.get(toastAtom);
      expect(updated).toHaveProperty('toast', null);
      expect(updated).toHaveProperty('timer', undefined);
    });
  });
});
