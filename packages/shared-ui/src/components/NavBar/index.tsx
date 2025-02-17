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
        className,
        'tablet:flex tablet:flex-1 tablet:flex-row tablet:gap-5 tablet:h-[72px] tablet:justify-between',
      ])}
    >
      {links.map((link) => (
        <NavLink key={link.id} {...link} />
      ))}
    </div>
  );
};

export default NavBar;
