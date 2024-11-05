import { FC } from 'react';
import { BadgeProps } from './types';

const Badge: FC<BadgeProps> = ({ type, text }) => {
  const colourStyle = {
    danger: 'outline-red-600 text-red-600',
    warning: 'outline-amber-600 text-amber-600',
    success: 'outline-green-700 text-green-700',
    info: 'outline-cyan-700 text-cyan-700',
    default: 'outline-gray-700 text-gray-700',
  };

  return (
    <span
      className={`inline-block py-1 px-3 text-xs font-semibold rounded-full outline outline-1 ${colourStyle[type]}`}
      data-testid={`${type}-badge`}
    >
      {text}
    </span>
  );
};

export default Badge;
