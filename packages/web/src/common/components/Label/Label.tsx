import { FC } from 'react';
import { LabelProps } from './types';
import labelConfig from './labelConfig';

const Label: FC<LabelProps> = ({ text, type, className = '' }) => {
  const { textColor, backgroundColor } = labelConfig[type];

  return (
    <div className={`${backgroundColor} ${className} inline-flex rounded-full px-3 py-1`}>
      <p
        className={`${textColor} font-["MuseoSans"] flex items-center text-xs font-bold leading-4`}
      >
        {text}
      </p>
    </div>
  );
};

export default Label;
