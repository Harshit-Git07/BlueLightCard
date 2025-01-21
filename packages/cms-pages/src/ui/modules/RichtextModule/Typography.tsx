import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const TYPOGRAPHY_STYLES = {
  normal:
    'text-typography-body font-typography-body-weight leading-typography-body tracking-typography-body',
  h1: 'text-typography-display-small font-typography-display-small-weight leading-typography-display-small tracking-typography-display-small',
  h2: 'text-typography-headline-bold font-typography-headline-bold-weight leading-typography-headline-bold tracking-typography-headline-bold',
  h3: 'text-typography-headline font-typography-headline-weight leading-typography-headline tracking-typography-headline',
  h4: 'text-typography-title-large font-typography-title-large-weight leading-typography-title-large tracking-typography-title-large',
  h5: 'text-typography-title-medium-semibold font-typography-title-medium-semibold-weight leading-typography-title-medium-semibold tracking-typography-title-medium-semibold',
  h6: 'text-typography-title-small font-typography-title-small-weight leading-typography-title-small tracking-typography-title-small',
  blockquote:
    'border-l-2 pl-4 font-typography-body-light text-typography-body-light tracking-typography-body-light leading-typography-body-light',
};

const DEFAULT_STYLES =
  'tablet:text-typography-headline tablet:font-typography-headline-weight tablet:tracking-typography-headline tablet:leading-typography-headline';

export type TypographyProps = {
  headingLevel: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote';
  children: ReactNode;
};

const Typography: FC<TypographyProps> = ({ headingLevel, children }) => {
  const typographyStyle = TYPOGRAPHY_STYLES[headingLevel] ?? DEFAULT_STYLES;

  const classes = cn(
    'text-heading-colour dark:text-heading-colour-dark mb-2 dark:text-colour-onSurface-dark',
    typographyStyle,
  );

  const ComponentTag = headingLevel === 'normal' ? 'p' : headingLevel;

  return <ComponentTag className={classes}>{children}</ComponentTag>;
};

export default Typography;
