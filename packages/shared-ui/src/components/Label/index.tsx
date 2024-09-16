import type { FC } from 'react';

export type Props = {
  type: 'normal' | 'alert';
  text: string | undefined;
  className?: string;
};

const labelConfig = {
  normal: {
    textColor: 'text-tag-label-colour-light dark:text-tag-label-colour-dark',
    backgroundColor: 'bg-tag-bg-colour-light dark:bg-tag-bg-colour-dark',
  },
  alert: {
    textColor: 'text-shade-greyscale-white dark:text-shade-greyscale-white-dark',
    backgroundColor: 'bg-colour-system-red-500 dark:bg-colour-system-red-500-dark',
  },
};

const Label: FC<Props> = ({ text, type = 'normal', className = '' }) => {
  const { textColor, backgroundColor } = labelConfig[type];

  return (
    <div className={`${backgroundColor} ${className} inline-flex rounded-full px-3 py-1`}>
      <p
        className={`${textColor} font-tag-label-font text-tag-label-font font-tag-label-font-weight tracking-tag-label-font leading-tag-label-font rounded-full whitespace-nowrap flex items-center`}
      >
        {text}
      </p>
    </div>
  );
};

export default Label;
