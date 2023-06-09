import { FC } from 'react';
import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { FieldGroupProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
import { decider } from '@/utils/decider';
import { cssUtil } from '@/utils/cssUtil';

const FieldGroup: FC<FieldGroupProps> = ({
  labelText,
  controlId,
  children,
  invalid,
  message,
  password,
  passwordVisible = false,
  onTogglePasswordVisible,
}) => {
  const passwordToggleIcon = passwordVisible ? faEye : faEyeSlash;
  const _showPasswordCriteria = Array.isArray(message);
  const isPasswordWeak = Array.isArray(message) && !!message.find((msg) => !!msg.invalid);
  const isPasswordStrong = Array.isArray(message) && !message.find((msg) => !!msg.invalid);
  const passwordStrength = decider([
    [isPasswordWeak, 'Weak'],
    [isPasswordStrong, 'Strong'],
  ]);
  const feedbackMessageColor = decider([
    [invalid || isPasswordWeak, 'text-palette-danger-base dark:text-palette-danger-dark'],
    [isPasswordStrong, 'text-palette-success-base dark:text-palette-success-dark'],
  ]);
  const onIconButtonClick = () => {
    if (onTogglePasswordVisible) {
      onTogglePasswordVisible(!passwordVisible);
    }
  };
  return (
    <div className="mb-3">
      <div className="flex mb-2">
        <label
          className="text-font-neutral-base dark:text-font-neutral-dark flex-1"
          htmlFor={controlId}
        >
          {labelText}
        </label>
        {password && (
          <FontAwesomeIcon
            className="mt-1.5 dark:text-palette-neutral-dark mr-3"
            icon={passwordToggleIcon}
            role="button"
            size="sm"
            title="Toggle password visibility"
            aria-label="Toggle password visibility"
            onClick={onIconButtonClick}
          />
        )}
      </div>
      <div className="text-font-neutral-base mb-1.5">
        {children}
        {message && (
          <div className={`${feedbackMessageColor}`}>
            {_showPasswordCriteria ? (
              <div>
                <small className="">{passwordStrength}</small>
                <ul className="mt-3">
                  {message.map((msg, index) => {
                    const liClasses = cssUtil([
                      msg.invalid
                        ? 'text-palette-danger-base dark:text-palette-danger-dark'
                        : 'text-palette-success-base dark:text-palette-success-dark',
                      'flex items-center gap-1.5',
                    ]);
                    return (
                      <li className={liClasses} key={`pci_${index}`}>
                        <FontAwesomeIcon icon={msg.invalid ? faCircleXmark : faCircleCheck} />
                        {msg.message}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <small role={invalid ? 'alert' : undefined}>{message}</small>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldGroup;
