import { FC } from 'react';
import { BadgeProps } from './types';

const Badge: FC<BadgeProps> = ({ label, color, size }) => {
  return (
    <div
      className={`w-fit rounded-tl-lg rounded-br-lg flex items-center justify-center font-semibold font-['MuseoSans'] text-[#202125] ${
        color.includes('bg-') ? color : ''
      } ${size === 'large' ? 'absolute top-2 left-2 px-6 py-2 text-base' : 'px-2 py-0.5 text-xs'}`}
    >
      {label}
    </div>
  );
};

export default Badge;
