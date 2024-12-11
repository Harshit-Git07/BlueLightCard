import { useDrawer } from '../../index';
import Toast from '../Toast';
import { ToastPosition, ToastStatus } from '../Toast/ToastTypes';
import useToaster from '../Toast/Toaster/useToaster';
import { useSetAtom } from 'jotai/index';
import { initializeRequestNewCardAtom, requestNewCardAtom } from './requestNewCardAtom';

const DoneScreen = () => {
  const { close } = useDrawer();
  const setAtom = useSetAtom(requestNewCardAtom);
  const { openToast } = useToaster();
  openToast(
    <Toast
      title={'Requested a new card'}
      text={'It will be processed in 3-5 working days and deliver to you after.'}
      status={ToastStatus.Success}
    />,
    {
      position: ToastPosition.TopRight,
    },
  );
  close();
  setAtom(initializeRequestNewCardAtom());
  return <></>;
};

export default DoneScreen;
