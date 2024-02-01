import { FC } from 'react';
import { LabelProps } from './types';
import labelConfig from './labelConfig';

const Label: FC<LabelProps> = ({ text, type }) => {
  const { textColor, backgroundColor } = labelConfig[type];

  return (
    <div className={`${backgroundColor} inline-flex rounded-full px-3 py-1`}>
      <p className={`${textColor} font-["MuseoSans"] flex items-center text-sm font-semibold`}>
        {text}
      </p>
    </div>
  );
};

export default Label;
