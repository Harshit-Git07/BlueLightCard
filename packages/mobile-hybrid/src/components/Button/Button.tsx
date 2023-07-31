import { FC } from 'react';
import { ButtonProps } from '@/components/Button/types';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';

const Button: FC<ButtonProps> = ({ text, variant = ThemeVariant.Primary, onClick, disabled }) => {
  const Theme = variant;

  const buttonClasses = cssUtil([
    disabled ? 'opacity-25 cursor-not-allowed' : '',
    'm-2 px-4 py-2 rounded-lg font-semibold ',
    Theme === 'primary'
      ? 'shadow-md active:bg-primary-dukeblue-700 bg-primary-dukeblue-900 text-neutral-white dark:bg-primary-vividskyblue-700 dark:text-primary-dukeblue-900'
      : '',
    Theme === 'secondary'
      ? 'active:bg-primary-dukeblue-700 dark:active:bg-primary-vividskyblue-700 border border-primary-dukeblue-900 text-primary-dukeblue-900 dark:border-primary-vividskyblue-700 dark:text-primary-vividskyblue-700'
      : '',
  ]);

  return (
    <>
      <button className={buttonClasses} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </>
  );
};

export default Button;
