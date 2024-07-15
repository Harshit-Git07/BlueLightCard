import React from 'react';
import { LinkItem } from './types';
import Link from '../Link/Link';

const LinkList = ({ items, styling }: { items: LinkItem[]; styling?: React.CSSProperties }) => {
  return (
    <ul
      // Direct Styliing to allow the ability to attach to an absolute container as well as being used within a normal list
      style={styling}
      className={`w-max flex flex-1 flex-col bg-dropDownItem-bg-colour dark:bg-dropDownItem-bg-colour-dark border border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark rounded-t-none border-t-2 border-t-colour-primary dark:border-t-colour-primary-dark rounded shadow-dropdownTop`}
    >
      {items.map(({ id, label, url, onClick }, i) => {
        return (
          <li key={id} className="flex h-[40px]">
            <Link
              href={url}
              className={`h-full w-full px-[20px] py-1 flex items-center justify-start text-dropDownItem-text-colour dark:text-dropDownItem-text-colour-dark ${
                i !== items.length - 1 &&
                'border-b border-b-dropDownItem-bg-colour dark:border-b-dropDownItem-bg-colour-dark'
              } w-full text-left items-center focus:outline-none focus:text-dropDownItem-text-active-colour focus:border-b-dropDownItem-border-active-colour focus:border-b hover:border-b hover:bg-dropDownItem-bg-hover-colour hover:text-dropDownItem-text-hover-colour hover:border-b-dropDownItem-divider-hover-colour dark:focus:text-dropDownItem-text-active-colour-dark dark:focus:border-b-dropDownItem-border-active-colour-dark dark:hover:bg-dropDownItem-bg-hover-colour-dark dark:hover:text-dropDownItem-text-hover-colour-dark  dark:hover:border-b-dropDownItem-divider-hover-colour-dark`}
              onClick={onClick}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default LinkList;
