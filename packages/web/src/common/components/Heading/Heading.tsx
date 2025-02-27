import React, { FC } from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading: FC<HeadingProps> = ({ headingLevel, children, className }) => {
  const Heading = headingLevel;
  const defaultStyles =
    'text-colour-onSurface dark:text-colour-onSurface-dark mb-2 font-bold font-["MuseoSans"]';
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
export default Heading;
