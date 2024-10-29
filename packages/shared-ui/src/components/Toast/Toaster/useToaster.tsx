import { useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';
import { initializeToastAtom, toastAtom, toastDefaultOptions } from '../toastState';
import { ToastOptions } from '../ToastTypes';
import { createTimer } from '../../../utils/pausableTimer';

const useToaster = () => {
  const toastValue = useAtomValue(toastAtom);
  const setToastAtom = useSetAtom(toastAtom);

  const { timer } = toastValue;

  const closeToast = () => {
    timer?.pause();
    setToastAtom(initializeToastAtom);
  };

  const openToast = (toast: ReactNode, opts: Partial<ToastOptions> = {}) => {
    const options = { ...toastDefaultOptions, ...opts };
    const { duration } = options;
    timer?.pause();
    if (duration > 0) {
      const newTimer = createTimer(() => {
        closeToast();
      }, duration);

      setToastAtom((state) => ({ toast, timer: newTimer, options }));
      return;
    }

    setToastAtom((state) => ({ toast, timer: undefined, options }));
  };

  return { ...toastValue, openToast, closeToast };
};

export default useToaster;
