import { FC, PropsWithChildren } from 'react';
import { SharedProps } from '../../types';

export type Props = PropsWithChildren &
  SharedProps & {
    useLegacyRouting?: boolean;
    href?: string;
    children?: React.ReactNode[] | React.ReactNode;
    onClickLink?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };

const Link: FC<Props> = ({ useLegacyRouting = true, href, children, onClickLink, ...props }) => {
  if (useLegacyRouting) {
    return (
      <a className="dark:text-palette-secondary" data-testid="anchor-link" href={href} {...props}>
        {children}
      </a>
    );
  } else if (onClickLink && !href) {
    return (
      <div
        className="font-['MuseoSans'] text-xs font-semibold cursor-pointer text-[#001B80] my-1"
        data-testid="on-click-link"
        onClick={onClickLink}
      >
        {children}
      </div>
    );
  } else {
    return (
      <a
        className="dark:text-palette-secondary"
        data-testid="next-link"
        href={href ? href : ''}
        {...props}
      >
        {children}
      </a>
    );
  }
};

export default Link;
