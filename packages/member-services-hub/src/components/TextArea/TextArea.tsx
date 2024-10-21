'use client';
import { ChangeEvent, FC, useState } from 'react';
import { TextAreaProps } from './types';
import { ZodSchema } from 'zod';
import getSchema from '@/app/_zodSchemas/zodSchemaLibrary';

const TextArea: FC<TextAreaProps> = ({
  label,
  disabled,
  placeholder,
  icon,
  width,
  validationType,
  validationSuccessMessage,
  value,
  onChange,
}) => {
  const [status, setStatus] = useState('none');
  const [validationMessage, setValidationMessage] = useState('');
  const [showStatus, showStatusSet] = useState(false);
  const iconSpacing = icon !== undefined && disabled !== true ? 'ps-[2.3rem] pr-4' : 'px-4';
  const disabledTailwind = disabled !== undefined ? tailwindForDisabled(disabled) : '';
  const errorOveride =
    status === undefined || status === 'none' || disabled !== undefined || disabled === false
      ? `focus:border-blue-400 active:border-blue-400 hover:border-blue-400`
      : ``;
  const widthField = width !== undefined ? width : '250px';
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
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    validationCheck(newValue, setStatus, showStatusSet, validationType, setValidationMessage);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <>
      <label data-testid="text-area-label" className="mb-[10px] block text-base font-medium text-dark">
        {label}
      </label>
      <div className={`relative`}>
        <div className={`absolute w-4 mr-2 translate-y-[65%] translate-x-3`}>
          {icon !== undefined && disabled !== true ? icon : <div className="pb-4"></div>}
        </div>
        <textarea
          rows={5}
          placeholder={placeholder !== undefined ? placeholder : ''}
          className={`w-[${widthField}] ${iconSpacing} pt-3 ${disabledTailwind} ${borderStatusColour} bg-transparent rounded-md border border-stroke p-5 text-dark-6 outline-none transition ${errorOveride}`}
          disabled={disabled !== undefined ? disabled : false}
          maxLength={150}
          value={value}
          onChange={handleChange}
        ></textarea>
        <div className={`${textStatusColour}`}>
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

export default TextArea;
