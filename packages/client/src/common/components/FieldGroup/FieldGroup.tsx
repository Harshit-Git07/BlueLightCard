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
    [invalid || isPasswordWeak, 'text-fieldGroup-danger'],
    [isPasswordStrong, 'text-fieldGroup-success'],
  ]);
  const onIconButtonClick = () => {
    if (onTogglePasswordVisible) {
      onTogglePasswordVisible(!passwordVisible);
    }
  };
  return (
    <div className="mb-3">
      <div className="flex mb-2">
        <label className="flex-1" htmlFor={controlId}>
          {labelText}
        </label>
        {password && (
          <FontAwesomeIcon
            className="mt-1.5 mr-3"
            icon={passwordToggleIcon}
            role="button"
            size="sm"
            title="Toggle password visibility"
            aria-label="Toggle password visibility"
            onClick={onIconButtonClick}
          />
        )}
      </div>
      <div className="mb-1.5">
        {children}
        {message && (
          <div className={`${feedbackMessageColor}`}>
            {_showPasswordCriteria ? (
              <div>
                <small>{passwordStrength}</small>
                <ul className="mt-3">
                  {message.map((msg, index) => {
                    const liClasses = cssUtil([
                      msg.invalid ? 'text-fieldGroup-danger' : 'text-fieldGroup-success',
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
