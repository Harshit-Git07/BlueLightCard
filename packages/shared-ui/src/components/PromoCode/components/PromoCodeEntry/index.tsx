import React, { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { faCircleBolt } from '@fortawesome/pro-duotone-svg-icons';
import TextInput from '../../../TextInput';
import Button from '../../../Button-V2';
import { PromoCodeVariant } from '../../types';
import { colours, fonts } from '../../../../tailwind/theme';

interface PromoCodeEntryProps {
  name?: string;
  value?: string;
  maxChars?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onApply: (value: string) => void;
  placeholder: string;
  label: string;
  errorMessage?: string;
  infoMessage?: string;
  icon?: boolean;
  isOpen: boolean;
  currentVariant: PromoCodeVariant;
  onToggle: () => void;
}

const PromoCodeEntry: React.FC<PromoCodeEntryProps> = ({
  name,
  value = '',
  maxChars,
  onChange,
  onKeyDown,
  onApply,
  placeholder = 'Enter promo code',
  label = 'Add your promo code',
  errorMessage,
  infoMessage,
  icon = false,
  isOpen,
  currentVariant,
  onToggle,
}) => {
  const hasError = currentVariant === 'error' || errorMessage;

  return (
    <div className="px-[12px] py-[8px]">
      <div className="w-full">
        <div>
          <button className="w-full text-left transition-colors duration-200" onClick={onToggle}>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                {icon && (
                  <FontAwesomeIcon
                    className="w-[20px] h-[20px] mr-[8px] text-colour-primary dark:text-colour-primary-dark transition-colors duration-200"
                    icon={faCircleBolt as IconProp}
                  />
                )}

                <label
                  className={`${colours.textPrimary} ${fonts.body} transition-colors duration-200`}
                  htmlFor="promoCodeEntry"
                >
                  {label}
                </label>
              </div>

              <FontAwesomeIcon
                className={`${colours.textOnSurface} ${isOpen ? 'rotate-180' : ''} w-[12px] h-[12px] transition-transform duration-200`}
                icon={isOpen ? faChevronUp : faChevronDown}
              />
            </div>

            {infoMessage && (
              <p
                className={`${colours.textOnSurfaceSubtle} ${fonts.bodySmall} transition-colors duration-200`}
              >
                {infoMessage}
              </p>
            )}
          </button>
        </div>

        <div
          className={`${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid transition-all duration-200 ease-in-out`}
        >
          <div className="overflow-hidden">
            <div className="flex gap-2 mt-2">
              <div className="flex-grow">
                <TextInput
                  id="promoCodeEntry"
                  name={name}
                  isValid={!hasError}
                  value={value}
                  maxLength={maxChars}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  message={errorMessage}
                />
              </div>

              <Button
                className="h-[50px] transition-colors duration-200"
                type="submit"
                disabled={value === ''}
                onClick={() => onApply(value)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeEntry;
