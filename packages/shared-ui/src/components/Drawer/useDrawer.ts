import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';

const useDrawer = () => {
  const { children, showCloseButton } = useAtomValue(drawerAtom);
  const setDrawer = useSetAtom(drawerAtom);

  const open = (children: ReactNode, showCloseButton = true) => {
    setDrawer(() => ({ children, showCloseButton }));
  };

  const close = () => {
    setDrawer(() => initializeDrawerAtom());
  };

  return {
    children,
    showCloseButton,
    open,
    close,
  };
};

export const initializeDrawerAtom = (): DrawerAtom => ({
  children: null,
  showCloseButton: true,
});

export interface DrawerAtom {
  children: null | ReactNode;
  showCloseButton?: boolean;
}

export const drawerAtom = atom(initializeDrawerAtom());

export default useDrawer;
