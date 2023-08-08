import { FC } from 'react';
import { ListPanelProps } from './types';
import { cssUtil } from '@/utils/cssUtil';

const ListPanel: FC<ListPanelProps> = ({ visible, children, onClose }) => {
  const rootClass = cssUtil([
    'w-full h-full fixed transition-all duration-500 ease-in-out top-0 pb-2',
    'overflow-y-scroll bg-white dark:bg-neutral-black',
    visible ? 'visible opacity-100' : 'invisible opacity-0',
  ]);
  return (
    <div className={rootClass}>
      <button
        className="text-primary-dukeblue-700 dark:text-primary-vividskyblue-700 absolute top-3 right-5 font-museo font-semibold"
        onClick={onClose}
      >
        Close
      </button>
      <div className="mt-7">{children}</div>
    </div>
  );
};

export default ListPanel;
