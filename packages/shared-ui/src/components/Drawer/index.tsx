import useDrawer from './useDrawer';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';
import { conditionalStrings } from '../../utils/conditionalStrings';

const Drawer = () => {
  const { children, close, showCloseButton = true } = useDrawer();
  const isOpen = !!children;

  const keyListener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyListener);
    return () => {
      window.removeEventListener('keydown', keyListener);
    };
  }, []);

  const onClose = (e: SyntheticEvent) => {
    e.preventDefault();
    close();
  };

  const blackoutClasses = conditionalStrings({
    'duration-500 fixed top-0 left-0 right-0 bottom-0 z-50 bg-[#00000088] transition-opacity cursor-default':
      true,
    'opacity-100': isOpen,
    'opacity-0 pointer-events-none': !isOpen,
  });

  const sidebarMobile = 'w-full rounded-t-3xl laptop:rounded-none';
  const sidebarLaptop = 'laptop:w-[384px]';

  const sidebarClasses = conditionalStrings({
    'flex flex-col duration-500 fixed bottom-0 z-[100] bg-colour-surface dark:bg-colour-surface-dark transition-top transition-right':
      true,
    [sidebarMobile]: true,
    [sidebarLaptop]: true,
    'top-[100%] laptop:top-0 right-0 laptop:-right-[384px]': !isOpen,
    'top-[10%] laptop:top-0 right-0': isOpen,
  });

  return (
    <div className={'fixed top-0 left-0 z-50'} aria-label={'sidebar'} aria-hidden={!isOpen}>
      <button className={blackoutClasses} onClick={onClose} />
      <aside className={sidebarClasses}>
        {isOpen && showCloseButton ? (
          <div className="flex w-full justify-end p-4 text-colour-onSurface dark:text-colour-onSurface-dark">
            <button className="cursor-pointer" onClick={onClose} aria-label={'close'}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        ) : null}
        {isOpen ? (
          <div className={'grow-1 overflow-y-auto'} aria-live={'polite'} aria-atomic={true}>
            {children}
          </div>
        ) : null}
      </aside>
    </div>
  );
};

export default Drawer;
