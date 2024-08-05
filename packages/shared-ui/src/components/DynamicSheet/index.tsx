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
      <div className="fixed top-0 left-0 right-0 bottom-0 hidden laptop:block z-50">
        <DesktopDynamicSheet {...props} />
      </div>
      {/* translucent bg is added here instead of in the component because it doesnt appear that vw and vh work on hybrid, 
      so background positioning does not function in the same way */}
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000088] block laptop:hidden z-50">
        <MobileDynamicSheet {...props} />
      </div>
    </>
  );
};

export default DynamicSheet;
