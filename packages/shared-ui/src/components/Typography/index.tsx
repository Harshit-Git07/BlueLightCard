import { FC, ReactNode } from 'react';

import { fonts } from '../../tailwind/theme';

const variantClasses = {
  'display-large-text': fonts.displayLargeText,
  'display-medium-text': fonts.displayMediumText,
  'display-small-text': fonts.displaySmallText,
  headline: fonts.headline,
  'headline-bold': fonts.headlineBold,
  'headline-small-bold': fonts.headlineSmallBold,
  'title-large': fonts.titleLarge,
  'title-medium': fonts.titleMedium,
  'title-medium-semibold': fonts.titleMediumSemiBold,
  'title-small': fonts.titleSmall,
  body: fonts.body,
  'body-light': fonts.bodyLight,
  'body-semibold': fonts.bodySemiBold,
  'body-small': fonts.bodySmall,
  'body-small-semibold': fonts.bodySmallSemiBold,
  label: fonts.label,
  'label-semibold': fonts.labelSemiBold,
  button: fonts.button,
};

type TypographyProps = {
  variant: keyof typeof variantClasses;
  children: ReactNode;
  className?: string;
};

const Typography: FC<TypographyProps> = ({ variant, className, children }) => {
  const defaultClasses = 'text-heading-colour dark:text-heading-colour-dark';
  const classes = variantClasses[variant];
  return <div className={`${defaultClasses} ${classes} ${className}`}>{children}</div>;
};

export default Typography;
