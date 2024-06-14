import { FC } from 'react';
import { ListPanelProps } from '@/components/ListPanel/types';
import { cssUtil } from '@/utils/cssUtil';

const ListPanel: FC<ListPanelProps> = ({ visible, children, onClose }) => {
  const rootClass = cssUtil([
    'w-full h-full fixed transition-all duration-500 ease-in-out z-50 top-0 pb-5 pt-5',
    'overflow-y-scroll bg-colour-surface-light dark:bg-colour-surface-dark',
    visible ? 'visible opacity-100 ' : 'invisible opacity-0',
  ]);
  return (
    <div className={rootClass}>
      <button
        className="text-heading-link-colour-light dark:text-heading-link-colour-dark absolute top-3 right-5"
        onClick={onClose}
      >
        Close
      </button>
      <div className="mt-7">{children}</div>
    </div>
  );
};

export default ListPanel;
