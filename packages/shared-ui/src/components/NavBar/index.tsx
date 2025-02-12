import { FC, HTMLAttributes } from 'react';
import NavLink, { Props as NavLinks } from './components/NavLink';
import { toClassNames } from '../../utils/cssUtil';

export type Props = {
  links: NavLinks[];
  className?: HTMLAttributes<HTMLUListElement>['className'];
};

const NavBar: FC<Props> = ({ links, className }) => {
  return (
    <div
      className={toClassNames([
        'mobile-xl:flex mobile-xl:flex-1 mobile-xl:flex-row mobile-xl:gap-5 mobile-xl:h-[72px] mobile-xl:justify-between',
        className,
      ])}
    >
      {links.map((link) => (
        <NavLink key={link.id} {...link} />
      ))}
    </div>
  );
};

export default NavBar;
