import React from 'react';
import MobileDynamicSheet from './MobileDynamicSheet';
import DesktopDynamicSheet from './DesktopDynamicSheet';
import { DynamicSheetProps } from './types';

const DynamicSheet: React.FC<DynamicSheetProps> = (props) => {
  return (
    <>
      <div className="relative hidden laptop:block z-50">
        <DesktopDynamicSheet {...props} />
      </div>
      <div className="relative block laptop:hidden z-50">
        <MobileDynamicSheet {...props} />
      </div>
    </>
  );
};

export default DynamicSheet;
