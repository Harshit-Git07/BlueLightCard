import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { cssUtil } from '../../utils/cssUtil';
import { usePlatformAdapter } from '../../adapters';

const BUTTON_TERTIARY = 'button-tertiary';

const colourToken = {
  hover: `hover:text-${BUTTON_TERTIARY}-hover-label-colour-light dark:hover:text-${BUTTON_TERTIARY}-hover-label-colour-dark`,
  text: `text-${BUTTON_TERTIARY}-default-label-colour-light dark:text-${BUTTON_TERTIARY}-default-label-colour-dark`,
  border: 'border-none',
  disabled: `disabled:text-${BUTTON_TERTIARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_TERTIARY}-disabled-label-colour-dark`,
};

const font =
  'font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold';

const padding = 'py-1 px-3';

export interface Props {
  copyText: string;
  disabled?: boolean;
  className?: string;
}

const CopyButton: FC<Props> = ({ copyText, disabled, className }) => {
  const platformAdapter = usePlatformAdapter();

  const [accountNumberCopied, setAccountNumberCopied] = useState(false);

  const classes = cssUtil([
    font,
    padding,
    disabled ? colourToken.disabled : '',
    colourToken.text,
    !disabled ? colourToken.hover : '',
    colourToken.border,
    className ?? '',
  ]);

  const clickHandler = async () => {
    return platformAdapter
      .writeTextToClipboard(copyText)
      .then(() => {
        setAccountNumberCopied(true);

        setTimeout(() => {
          setAccountNumberCopied(false);
        }, 4000);

        return true;
      })
      .catch(() => false);
  };

  return (
    <>
      {!accountNumberCopied ? (
        <button
          type="button"
          name="copy"
          aria-label="copy"
          disabled={disabled}
          className={`${classes} text-button-label-font font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font`}
          onClick={clickHandler}
        >
          Copy
          <FontAwesomeIcon className="ml-2" icon={faCopy} />
        </button>
      ) : (
        <div className="ml-3 mt-1.5 flex items-center text-colour-success-light dark:text-colour-success-dark">
          <div className={`${font} tracking-typography-label-semibold`}>Copied to clipboard</div>
          <FontAwesomeIcon className="ml-2" icon={faCheckCircle} size="xs" />
        </div>
      )}
    </>
  );
};

export default CopyButton;
