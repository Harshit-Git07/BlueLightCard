import useToaster from './useToaster';
import { conditionalStrings } from '../../../utils/conditionalStrings';
import { ToastPosition } from '../ToastTypes';

export const getToastClasses = (position: ToastPosition) => {
  const { TopLeft, TopCenter, TopRight, BottomCenter, BottomRight } = ToastPosition;
  const always = true;
  const isRight = position === TopRight || position === BottomRight;
  const isCenter = [TopCenter, BottomCenter].includes(position);
  const isLeft = !isCenter && !isRight;
  const isTop = [TopLeft, TopCenter, TopRight].includes(position);

  return conditionalStrings({
    'fixed z-[1000] w-full max-w-[713px]': always,
    'left-[64px]': isLeft,
    'left-1/2 -translate-x-1/2': isCenter,
    'right-[64px]': isRight,
    'top-[64px]': isTop,
    'bottom-0': !isTop,
  });
};

export const Toaster = () => {
  const { toast, options } = useToaster();
  if (!toast) return null;

  const { position } = options;
  const toastClass = getToastClasses(position);
  return (
    <div className={toastClass} data-testid={'toaster'}>
      {toast}
    </div>
  );
};

export default Toaster;
export { default as useToaster } from './useToaster';
