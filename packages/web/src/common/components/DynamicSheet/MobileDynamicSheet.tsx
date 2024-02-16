import React from 'react';
import { DynamicSheetProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';

const MobileDynamicSheet: React.FC<DynamicSheetProps> = ({
  children,
  isOpen = false,
  outsideClickClose = true,
  onClose,
  showCloseButton = false,
  containerClassName = '',
  height = '80%',
}) => {
  return (
    <div className="absolute h-[100vh] bg-transparent">
      <div
        className={`${
          !isOpen ? 'hidden opacity-0' : 'opacity-100'
        } absolute w-[100vw] h-[100vh] bg-[#00000088] transition-opacity duration-1000`}
        onClick={() => outsideClickClose && onClose && onClose()}
      ></div>
      <div
        className={`absolute w-[100vw] bg-gray-100 flex flex-col space-y-2 rounded-t-3xl ${
          isOpen ? 'translate-y-[-100%]' : 'translate-y-0'
        } transition-transform duration-300`}
        // We use styles here as we want to enable the value to be dynamic.
        // Tailwind cleans up unused values and therefore dynamic values are likely to be removed.
        style={{ height: height, bottom: `-${height}` }}
      >
        {showCloseButton && (
          <div className="w-full flex justify-end p-4">
            <FontAwesomeIcon
              icon={faX}
              className="cursor-pointer"
              onClick={() => onClose && onClose()}
            />
          </div>
        )}

        <div className={`${containerClassName} flex-1 w-full h-full overflow-scroll`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileDynamicSheet;
