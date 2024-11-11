import React, { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { faCircleBolt } from '@fortawesome/pro-duotone-svg-icons';
import TextInput from '../../../TextInput';
import Button from '../../../Button-V2';
import { PromoCodeVariant } from '../../types';

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
    <div className="px-3 py-2">
      <div className="w-full">
        <div>
          <button onClick={onToggle} className="w-full text-left transition-colors duration-200">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                {icon && (
                  <FontAwesomeIcon
                    className="w-5 h-5 mr-2 text-colour-primary dark:text-colour-primary-dark transition-colors duration-200"
                    icon={faCircleBolt as IconProp}
                  />
                )}

                <label
                  htmlFor="promoCodeEntry"
                  className="text-colour-primary dark:text-colour-primary-dark font-typography-body font-typography-body-weight text-typography-body leading-typography-body transition-colors duration-200"
                >
                  {label}
                </label>
              </div>
              <FontAwesomeIcon
                className={`w-3 h-3 text-colour-onSurface dark:text-colour-onSurface-dark transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                icon={isOpen ? faChevronUp : faChevronDown}
              />
            </div>
            {infoMessage && (
              <p className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small transition-colors duration-200">
                {infoMessage}
              </p>
            )}
          </button>
        </div>
        <div
          className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
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
                type={'submit'}
                onClick={() => onApply(value)}
                className="h-[50px] transition-colors duration-200"
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
