import { SharedProps } from '../../types';
import { FC, PropsWithChildren } from 'react';
import MobileDynamicSheet from './components/MobileDynamicSheet';
import DesktopDynamicSheet from './components/DesktopDynamicSheet';

export type Props = SharedProps &
  PropsWithChildren & {
    showCloseButton?: boolean;
    containerClassName?: string;
    height?: string;
  };

const DynamicSheet: FC<Props> = ({ ...props }) => {
  return (
    <>
      <div className="fixed top-0 left-0 hidden laptop:block z-50">
        <DesktopDynamicSheet {...props} />
      </div>
      <div className="fixed top-0 left-0 block laptop:hidden z-50">
        <MobileDynamicSheet {...props} />
      </div>
    </>
  );
};

export default DynamicSheet;
