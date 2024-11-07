import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { cssUtil } from '../../utils/cssUtil';
import { usePlatformAdapter } from '../../adapters';
import { ThemeColorTokens, ThemeVariant } from '../../types';

const fontCss =
  'font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold';

const ButtonColour: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: `bg-button-primary-default-bg-colour-light dark:bg-button-primary-default-bg-colour-dark`,
      hover: `hover:bg-button-primary-hover-bg-colour-light dark:hover:bg-button-primary-hover-bg-colour-dark hover:text-button-primary-hover-label-colour-light dark:hover:text-button-primary-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-button-primary-default-label-colour-light dark:text-button-primary-default-label-colour-dark`,
      border: 'border-none rounded transition border-2',
      padding: 'py-2 px-3',
      disabled: `disabled:bg-button-primary-disabled-bg-colour-light disabled:dark:bg-button-primary-disabled-bg-colour-dark disabled:text-button-primary-disabled-label-colour-light disabled:dark:text-button-primary-disabled-label-colour-dark`,
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover: `hover:text-button-tertiary-hover-label-colour-light dark:hover:text-button-tertiary-hover-label-colour-dark`,
      text: `text-button-tertiary-default-label-colour-light dark:text-button-tertiary-default-label-colour-dark`,
      border: 'border-none',
      padding: 'py-0',
      disabled: `disabled:text-button-tertiary-disabled-label-colour-light disabled:dark:text-button-tertiary-disabled-label-colour-dark`,
    },
  },
};

export interface Props {
  variant: ThemeVariant.Primary | ThemeVariant.Tertiary;
  label?: string;
  copyText: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  defaultStateClassName?: string;
}

const CopyButton: FC<Props> = ({
  variant,
  label = 'Copy',
  copyText,
  fullWidth = false,
  disabled,
  className,
  defaultStateClassName,
}) => {
  const platformAdapter = usePlatformAdapter();
  const [accountNumberCopied, setAccountNumberCopied] = useState(false);

  const colourToken = ButtonColour[variant].base;
  const width = fullWidth ? 'w-full' : '';

  const classes = cssUtil([
    fontCss,
    disabled ? colourToken.disabled : '',
    colourToken.text,
    colourToken.hover,
    colourToken.bg ?? '',
    colourToken.border ?? '',
    colourToken.padding,
    defaultStateClassName ?? '',
    width,
    'text-button-label-font font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font',
  ]);

  const clickHandler = async () => {
    return platformAdapter
      .writeTextToClipboard(copyText)
      .then(() => {
        setAccountNumberCopied(true);

        setTimeout(() => {
          setAccountNumberCopied(false);
        }, 2000);

        return true;
      })
      .catch(() => false);
  };

  return (
    <div className={`${className} flex items-center`}>
      {!accountNumberCopied ? (
        <button
          type="button"
          name="copy"
          aria-label="copy"
          disabled={disabled}
          className={classes}
          onClick={clickHandler}
        >
          {label}
          <FontAwesomeIcon className="ml-2" icon={faCopy} />
        </button>
      ) : (
        <div
          className={`${colourToken.padding} ${width} flex items-center justify-center text-colour-success-light dark:text-colour-success-dark`}
        >
          <p className={`${fontCss} tracking-typography-label-semibold`}>Copied to clipboard</p>
          <FontAwesomeIcon className="ml-2" icon={faCheckCircle} size="xs" />
        </div>
      )}
    </div>
  );
};

export default CopyButton;
