import React from 'react';
import MobileDynamicSheet from './MobileDynamicSheet';
import DesktopDynamicSheet from './DesktopDynamicSheet';
import { DynamicSheetProps } from './types';

const DynamicSheet: React.FC<DynamicSheetProps> = (props) => {
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
