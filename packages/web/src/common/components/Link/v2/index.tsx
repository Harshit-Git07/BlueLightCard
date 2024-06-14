import React, { FC } from 'react';
import { default as NextLink } from 'next/link'; // Aliased Link to NextLink to avoid conflict
import { LinkProps } from './types';

const Link: FC<LinkProps> = ({
  useLegacyRouting = true,
  href,
  children,
  onClickLink,
  ...props
}) => {
  if (useLegacyRouting) {
    return (
      <a
        className="dark:text-palette-secondary"
        data-testid="anchor-link"
        href={onClickLink ? '#' : href}
        onClick={onClickLink}
        {...props}
      >
        {children}
      </a>
    );
  } else if (onClickLink && !href) {
    return (
      <div
        className="font-['MuseoSans'] text-xs font-semibold cursor-pointer text-colour-blc-duke-700 dark:text-colour-greyscale-white my-1"
        data-testid="on-click-link"
        onClick={onClickLink}
      >
        {children}
      </div>
    );
  } else {
    return (
      <NextLink
        className="dark:text-palette-secondary"
        data-testid="next-link"
        href={href ? href : ''}
        onClick={onClickLink}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
};

export default Link;
