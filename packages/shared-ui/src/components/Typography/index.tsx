import { ReactNode, FC } from 'react';

type TypographyProps = {
  variant:
    | 'display-large-text'
    | 'display-medium-text'
    | 'display-small-text'
    | 'headline'
    | 'headline-bold'
    | 'headline-small-bold'
    | 'title-large'
    | 'title-medium'
    | 'title-medium-semibold'
    | 'title-small'
    | 'body'
    | 'body-light'
    | 'body-semibold'
    | 'body-small'
    | 'body-small-semibold'
    | 'label'
    | 'label-semibold'
    | 'button';
  children: ReactNode;
  className?: string;
};

const Typography: FC<TypographyProps> = ({ variant, className, children }) => {
  const defaultClasses = 'text-heading-colour dark:text-heading-colour-dark';
  let classes;
  switch (variant) {
    case 'display-large-text':
      classes = `${defaultClasses} font-typography-display-large font-typography-display-large-weight text-typography-display-large leading-typography-display-large tracking-typography-display-large ${className}`;
      break;
    case 'display-medium-text':
      classes = `${defaultClasses} font-typography-display-medium font-typography-display-medium-weight text-typography-display-medium leading-typography-display-medium tracking-typography-display-medium ${className}`;
      break;
    case 'display-small-text':
      classes = `${defaultClasses} font-typography-display-small font-typography-display-small-weight text-typography-display-small leading-typography-display-small tracking-typography-display-small ${className}`;
      break;
    case 'headline':
      classes = `${defaultClasses} font-typography-headline font-typography-headline-weight text-typography-headline leading-typography-headline tracking-typography-headline ${className}`;
      break;
    case 'headline-bold':
      classes = `${defaultClasses} font-typography-headline-bold font-typography-headline-bold-weight text-typography-headline-bold leading-typography-headline-bold tracking-typography-headline-bold ${className}`;
      break;
    case 'headline-small-bold':
      classes = `${defaultClasses} font-typography-headline-small-bold font-typography-headline-small-bold-weight text-typography-headline-small-bold leading-typography-headline-small-bold tracking-typography-headline-small-bold ${className}`;
      break;
    case 'title-large':
      classes = `${defaultClasses} font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large ${className}`;
      break;
    case 'title-medium':
      classes = `${defaultClasses} font-typography-title-medium font-typography-title-medium-weight text-typography-title-medium leading-typography-title-medium tracking-typography-title-medium ${className}`;
      break;
    case 'title-medium-semibold':
      classes = `${defaultClasses} font-typography-title-medium-semibold font-typography-title-medium-semibold-weight text-typography-title-medium-semibold leading-typography-title-medium-semibold tracking-typography-title-medium-semibold ${className}`;
      break;
    case 'title-small':
      classes = `${defaultClasses} font-typography-title-small font-typography-title-small-weight text-typography-title-small leading-typography-title-small tracking-typography-title-small ${className}`;
      break;
    case 'body':
      classes = `${defaultClasses} font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body ${className}`;
      break;
    case 'body-light':
      classes = `${defaultClasses} font-typography-body-light font-typography-body-light-weight text-typography-body-light leading-typography-body-light tracking-typography-body-light ${className}`;
      break;
    case 'body-semibold':
      classes = `${defaultClasses} font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold leading-typography-body-semibold tracking-typography-body-semibold ${className}`;
      break;
    case 'body-small':
      classes = `${defaultClasses} font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small tracking-typography-body-small ${className}`;
      break;
    case 'body-small-semibold':
      classes = `${defaultClasses} font-typography-body-small-semibold font-typography-body-small-semibold-weight text-typography-body-small-semibold leading-typography-body-small-semibold tracking-typography-body-small-semibold ${className}`;
      break;
    case 'label':
      classes = `${defaultClasses} font-typography-label font-typography-label-weight text-typography-label leading-typography-label tracking-typography-label ${className}`;
      break;
    case 'label-semibold':
      classes = `${defaultClasses} font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold tracking-typography-label-semibold ${className}`;
      break;
    case 'button':
      classes = `${defaultClasses} font-typography-button font-typography-button-weight text-typography-button leading-typography-button tracking-typography-button ${className}`;
      break;
  }
  return <div className={classes}>{children}</div>;
};

export default Typography;
