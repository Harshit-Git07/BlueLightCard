import { FC } from 'react';
import { BadgeProps } from './types';

const Badge: FC<BadgeProps> = ({ type, text }) => {
  const textColour = () => {
    switch (type) {
      case 'danger':
        return 'text-[#D41121]';
      case 'warning':
        return 'text-[#B35600]';
      case 'success':
        return 'text-[#166F4E]';
      case 'disabled':
        return 'text-[#32363C]';
      default:
        return 'text-[#32363C]';
    }
  };
  const bgColour = () => {
    switch (type) {
      case 'danger':
        return 'bg-[#FFF0F1]';
      case 'warning':
        return 'bg-[#FFF5EC]';
      case 'success':
        return 'bg-[#E1F0EA]';
      case 'disabled':
        return 'bg-[#DCDFE3]';
      default:
        return 'bg-[#DCDFE3]';
    }
  };

  const backgroundColour = bgColour();
  const colour = textColour();

  return (
    <span
      className={`inline-block rounded py-2 px-3 text-xs font-medium rounded-full ${colour} ${backgroundColour}`}
      data-testid="danger-badge"
    >
      {text}
    </span>
  );
};

export default Badge;
