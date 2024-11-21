import { FC, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { cssUtil } from '../../utils/cssUtil';
import { usePlatformAdapter } from '../../adapters';
import { ThemeColorTokens, ThemeVariant } from '../../types';

const ButtonColour: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: `bg-button-primary-default-bg-colour-light dark:bg-button-primary-default-bg-colour-dark`,
      hover: `hover:bg-button-primary-hover-bg-colour-light dark:hover:bg-button-primary-hover-bg-colour-dark hover:text-button-primary-hover-label-colour-light dark:hover:text-button-primary-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-button-primary-default-label-colour-light dark:text-button-primary-default-label-colour-dark`,
      border: 'border-none rounded transition border-2',
      disabled: `disabled:bg-button-primary-disabled-bg-colour-light disabled:dark:bg-button-primary-disabled-bg-colour-dark disabled:text-button-primary-disabled-label-colour-light disabled:dark:text-button-primary-disabled-label-colour-dark`,
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover: `hover:text-button-tertiary-hover-label-colour-light dark:hover:text-button-tertiary-hover-label-colour-dark`,
      text: `text-button-tertiary-default-label-colour-light dark:text-button-tertiary-default-label-colour-dark`,
      border: 'border-none',
      disabled: `disabled:text-button-tertiary-disabled-label-colour-light disabled:dark:text-button-tertiary-disabled-label-colour-dark`,
    },
  },
};

export type ButtonSize = 'Small' | 'Large';

const fontStyles: Record<ButtonSize, string> = {
  Large:
    'text-button-label-font font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font',
  Small:
    'font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold',
};

const sizeStyles: Record<ButtonSize, string> = {
  Large: 'h-10 flex items-center justify-center gap-2',
  Small: 'flex items-center justify-center',
};

const sizeSpecificPadding: Record<ButtonSize, string> = {
  Large: 'py-2 px-6',
  Small: 'py-1 px-3',
};

export interface Props {
  variant: ThemeVariant.Primary | ThemeVariant.Tertiary;
  label?: string;
  copyText: string;
  size: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  defaultStateClassName?: string;
}

const CopyButton: FC<Props> = ({
  variant,
  label = 'Copy',
  copyText,
  size,
  fullWidth = false,
  disabled,
  className,
  defaultStateClassName,
}) => {
  const platformAdapter = usePlatformAdapter();
  const [accountNumberCopied, setAccountNumberCopied] = useState(false);

  const colourToken = ButtonColour[variant].base;

  const sizeSpecificStyles = useMemo(() => {
    const styles = sizeStyles[size];

    // Tertiary variants - no left of right padding is needed as per designs
    if (variant === ThemeVariant.Tertiary) {
      return styles;
    }

    const paddingForSpecificSize = sizeSpecificPadding[size];
    return `${paddingForSpecificSize} ${styles}`;
  }, []);

  const width = fullWidth ? 'w-full' : '';

  const classes = cssUtil([
    sizeSpecificStyles,
    fontStyles[size],
    disabled ? colourToken.disabled : '',
    colourToken.text,
    colourToken.hover,
    colourToken.bg ?? '',
    colourToken.border ?? '',
    defaultStateClassName ?? '',
    width,
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
          className={`${width} ${sizeSpecificStyles} flex items-center justify-center text-colour-success-light dark:text-colour-success-dark`}
        >
          <p className={`${fontStyles[size]} tracking-typography-label-semibold`}>
            Copied to clipboard
          </p>
          <FontAwesomeIcon className="ml-2" icon={faCheckCircle} />
        </div>
      )}
    </div>
  );
};

export default CopyButton;
