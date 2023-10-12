import React from 'react';
import { default as NextLink } from 'next/link'; // Aliased Link to NextLink to avoid conflict
import { LinkProps } from './types';

function Link({ useLegacyRouting = true, href, children, ...props }: LinkProps) {
  if (useLegacyRouting) {
    return (
      <a className="dark:text-palette-secondary" data-testid="anchor-link" href={href} {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <NextLink
        className="dark:text-palette-secondary"
        data-testid="next-link"
        href={href}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
}

export default Link;
