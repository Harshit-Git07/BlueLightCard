'use client';
import { FC, useState } from 'react';
import { InputFieldProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/pro-regular-svg-icons';
import { ZodSchema } from 'zod';
import getSchema from '@/app/_zodSchemas/zodSchemaLibrary';

const InputField: FC<InputFieldProps> = ({
  label,
  disabled,
  placeholder,
  icon,
  width,
  validationType,
  validationSuccessMessage,
}) => {
  const [status, setStatus] = useState('none');
  const [validationMessage, setValidationMessage] = useState('');
  const widthField = width !== undefined ? width : '250px';
  const [showStatus, showStatusSet] = useState(false);
  const iconSpacing = icon !== undefined && disabled !== true ? 'ps-[2.3rem] pr-4' : 'px-4';
  const disabledTailwind = disabled !== undefined ? tailwindForDisabled(disabled) : '';
  const statusIcon = status !== undefined && status !== '' && disabled !== true ? iconForStatus(status) : '';
  const errorOveride =
    status === undefined || status === 'none' || disabled !== undefined || disabled === false
      ? `focus:border-blue-400 active:border-blue-400 hover:border-blue-400`
      : ``;
  let borderStatusColour = 'border-dark';
  let textStatusColour = 'text-dark';
  let statusMessage = '';

  if (disabled !== true) {
    switch (status) {
      case 'success':
        borderStatusColour = 'border-green-400';
        textStatusColour = 'text-green-400';
        statusMessage = validationSuccessMessage !== undefined ? validationSuccessMessage : '';
        break;
      case 'error':
        borderStatusColour = 'border-red-400';
        textStatusColour = 'text-red-400';
        statusMessage = validationMessage;
        break;
      default:
        borderStatusColour = 'border-dark';
        textStatusColour = 'text-dark';
        statusMessage = '';
        break;
    }
  }

  return (
    <>
      <label data-testid="input-label" className="mb-[10px] block text-base font-medium text-dark">
        {label}
      </label>
      <div className={`relative`}>
        <div className={`absolute w-4 mr-2 translate-y-3 translate-x-3`}>
          {icon !== undefined && disabled !== true ? icon : <div className="pb-4"></div>}
        </div>
        <input
          type="text"
          placeholder={placeholder !== undefined ? placeholder : ''}
          className={`w-[${widthField}] ${iconSpacing} ${disabledTailwind} ${borderStatusColour} bg-transparent rounded-md border-2 border-stroke py-[10px] pr-[40px] text-dark-6 outline-none transition ${errorOveride}`}
          disabled={disabled !== undefined ? disabled : false}
          maxLength={50}
          onChange={(e) => {
            validationCheck(e.target.value, setStatus, showStatusSet, validationType, setValidationMessage);
          }}
        />
        <div className={`${textStatusColour}`}>
          <div className="float-right pr-6">
            <div className={`w-4 absolute -translate-y-[150%] float-right`}>
              {status !== undefined && status !== 'none' && statusMessage !== '' ? statusIcon : ''}
            </div>
          </div>
          <div>
            <p>{status !== undefined && showStatus === true && disabled !== true ? statusMessage : ''}</p>
          </div>
        </div>
      </div>
    </>
  );
};

function tailwindForDisabled(disabled: boolean) {
  if (disabled === true) {
    //grey
    return 'disabled:cursor-default disabled:bg-[#e8eae8] disabled:border-gray-2';
  } else {
    return '';
  }
}

function iconForStatus(status: string) {
  if (status === 'success') {
    return <FontAwesomeIcon icon={faCircleCheck} />;
  } else {
    return <FontAwesomeIcon icon={faCircleExclamation} />;
  }
}

function validationCheck(
  value: string,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  showStatusSet: React.Dispatch<React.SetStateAction<boolean>>,
  validationType: string | undefined,
  setValidationMessage: React.Dispatch<React.SetStateAction<string>>
) {
  if (validationType !== undefined && value !== '') {
    let zodValidation: ZodSchema | undefined = getSchema(validationType);
    let response = zodValidation?.safeParse(value);
    if (response?.success !== undefined && response?.success === true) {
      setStatus('success');
      showStatusSet(true);
    } else {
      let error = response?.error.errors[0].message;
      setStatus('error');
      showStatusSet(true);
      setValidationMessage(error !== undefined ? error : '');
    }
  } else {
    setStatus('none');
    showStatusSet(false);
    setValidationMessage('');
  }
}

export default InputField;