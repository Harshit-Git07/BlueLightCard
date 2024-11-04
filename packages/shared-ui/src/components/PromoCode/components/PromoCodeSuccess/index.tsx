import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/pro-duotone-svg-icons';
import Button from '../../../Button-V2';
import { ThemeVariant } from '../../../../types';

interface PromoCodeSuccessProps {
  value: string;
  onRemove: () => void;
}

const PromoCodeSuccess: React.FC<PromoCodeSuccessProps> = ({ value, onRemove }) => (
  <div className="px-4 py-3 transition-all duration-200 ease-in-out">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <FontAwesomeIcon
          className="w-5 h-5 text-colour-onSuccess-bright dark:text-colour-onSuccess-bright-dark transition-colors duration-200"
          icon={faCircleCheck as IconProp}
        />
        <div>
          <p className="font-typography-body font-typography-body-weight text-typography-body leading-typography-body text-colour-onSurface dark:text-colour-onSurface-dark transition-colors duration-200">
            {value}
          </p>
          <p className="font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark transition-colors duration-200">
            ID Upload Skipped!
          </p>
        </div>
      </div>
      <div>
        <Button
          variant={ThemeVariant.Tertiary}
          onClick={onRemove}
          className="transition-colors duration-300"
        >
          Remove
        </Button>
      </div>
    </div>
  </div>
);

export default PromoCodeSuccess;
