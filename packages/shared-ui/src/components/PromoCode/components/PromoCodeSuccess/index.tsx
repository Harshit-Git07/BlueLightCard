import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/pro-duotone-svg-icons';
import { colours, fonts } from '../../../../tailwind/theme';
import { PromoCodeVariant } from '../../types';

interface PromoCodeSuccessProps {
  value: string;
  variant: PromoCodeVariant;
  onRemove: () => void;
}

const PromoCodeSuccess: React.FC<PromoCodeSuccessProps> = ({ value, variant, onRemove }) => {
  const successText = useMemo(() => {
    switch (variant) {
      case 'success-skip-id':
        return 'ID Upload Skipped!';
      case 'success-skip-id-and-payment':
        return 'ID Upload & Payment Skipped!';
      case 'success-skip-payment':
        return 'Payment Skipped!';
      default:
        return '';
    }
  }, [variant]);

  return (
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
              {successText}
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
};

export default PromoCodeSuccess;
