import { FC } from 'react';
import { ListPanelProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const ListPanel: FC<ListPanelProps> = ({ visible, children, onClose }) => {
  const rootClass = cssUtil([
    'w-full absolute transition-[height] duration-500 ease-in-out bottom-0',
    'overflow-auto bg-white dark:bg-neutral-black',
    visible ? 'h-full' : 'h-0',
  ]);
  return (
    <div className={rootClass}>
      <button
        className="text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 absolute top-2 right-5 font-museo font-semibold"
        onClick={onClose}
      >
        Close
      </button>
      <div className="mt-5">{children}</div>
    </div>
  );
};

export default ListPanel;
