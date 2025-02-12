import { toClassNames } from '../../../utils/cssUtil';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';
import { NavLink } from './NavLink';

type Props = {
  links: NavLink[];
  className?: HTMLAttributes<HTMLUListElement>['className'];
};

const tokens = {
  ul: {
    bgColor:
      'bg-dropDownItem-subitem-bg-colour dark:bg-dropDownItem-subitem-bg-colour-dark mobile-xl:bg-dropDownItem-bg-colour mobile-xl:dark:bg-dropDownItem-bg-colour-dark',
    border:
      'border-t border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark rounded-t-none rounded-b border-t-colour-primary dark:border-t-colour-primary-dark mobile-xl:border mobile-xl:border-t-2',
    shadow: 'mobile-xl:shadow-dropdownTop',
  },
  link: {
    font: 'font-dropDownItem-label-font font-dropDownItem-label-font-weight',
    text: 'text-dropDownItem-label-font text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark',
    lineHeight: 'leading-dropDownItem-label-font',
    letterSpacing: 'tracking-dropDownItem-label-font',
    border:
      'mobile-xl:border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark',
    interaction: {
      focus:
        'focus:outline-none focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour focus:border-b dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark',
      hover:
        'hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark dark:hover:border-b-dropDownItem-divider-hover-colour-dark mobile-xl:hover:border-b',
    },
  },
} as const;

const LinkList: FC<Props> = ({ links, className }, idx) => {
  return (
    <ul
      className={toClassNames([
        className,
        'flex flex-1 flex-col z-20',
        tokens.ul.bgColor,
        tokens.ul.border,
        tokens.ul.shadow,
      ])}
    >
      {links.map((link) => (
        <li key={link.id} className="flex h-[40px]">
          <Link
            href={link.url ?? ''}
            className={toClassNames([
              'w-full px-[20px] py-1 flex items-center justify-start',
              tokens.link.font,
              tokens.link.text,
              tokens.link.lineHeight,
              tokens.link.letterSpacing,
              tokens.link.interaction.focus,
              tokens.link.interaction.hover,
              idx !== links.length - 1 ? tokens.link.border : null,
            ])}
            onClick={link.onClick}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
