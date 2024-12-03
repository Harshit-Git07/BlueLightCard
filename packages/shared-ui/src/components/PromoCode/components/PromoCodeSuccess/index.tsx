import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/pro-duotone-svg-icons';
import { colours, fonts } from '../../../../tailwind/theme';

interface PromoCodeSuccessProps {
  value: string;
  onRemove: () => void;
}

const PromoCodeSuccess: React.FC<PromoCodeSuccessProps> = ({ value, onRemove }) => (
  <div className="px-[16px] py-[12px] transition-all duration-200 ease-in-out">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-[12px]">
        <FontAwesomeIcon
          className={`${colours.onSuccessBright} w-[20px] h-[20px] transition-colors duration-200`}
          icon={faCircleCheck as IconProp}
        />

        <div>
          <p className={`${fonts.body} ${colours.textOnSurface} transition-colors duration-200`}>
            {value}
          </p>

          <p
            className={`${fonts.bodySmall} ${colours.textOnSurfaceSubtle} transition-colors duration-200`}
          >
            ID Upload Skipped!
          </p>
        </div>
      </div>

      <div>
        <button className={`${fonts.button} ${colours.textPrimary}`} onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  </div>
);

export default PromoCodeSuccess;
