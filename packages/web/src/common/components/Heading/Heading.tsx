import React, { FC } from 'react';
import HeadingV2 from './v2';
import { env } from '@bluelightcard/shared-ui';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: FC<HeadingProps> = ({ headingLevel, children, className }) => {
  const Heading = headingLevel;
  const defaultStyles =
    'text-palette-primary dark:text-palette-secondary mb-2 font-bold font-["MuseoSans"]';
  let size;
  switch (Heading) {
    case 'h1':
      size = 'text-3xl';
      break;
    case 'h2':
      size = 'text-2xl';
      break;
    case 'h3':
      size = 'text-xl';
      break;
    case 'h4':
      size = 'text-lg';
      break;
    case 'h5':
      size = 'text-md';
      break;
    case 'h6':
      size = 'text-sm';
      break;
  }

  const classes = `${size} ${defaultStyles} ${className} `;
  return <Heading className={classes}>{children}</Heading>;
};

export default env.FLAG_NEW_TOKENS ? HeadingV2 : Heading;
