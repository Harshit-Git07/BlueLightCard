import { FC } from 'react';
import { ButtonProps } from '@/components/Button/types';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';

const Button: FC<ButtonProps> = ({ text, variant = ThemeVariant.Primary, onClick, disabled }) => {
  const Theme = variant;

  const buttonClasses = cssUtil([
    disabled ? 'opacity-25 cursor-not-allowed' : '',
    'm-2 px-4 py-2 rounded-lg font-semibold ',
    'shadow-md bg-button-primary-bg-colour text-button-onPrimary-label-colour dark:bg-button-primary-bg-colour-dark dark:text-button-onPrimary-label-colour-dark',
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
