import { FC } from 'react';
import { config } from '../OfferSheet/types';

export type Props = {
  type: string;
  text: string | undefined;
  className?: string;
};

const labelConfig: config = {
  //TODO::Not whitelabel with design tokens revisit
  normal: {
    textColor: 'text-[#202125]',
    backgroundColor: 'bg-[#ECEFF2]',
  },
  alert: {
    textColor: 'text-white',
    backgroundColor: 'bg-[#D41121]',
  },
};

const Label: FC<Props> = ({ text, type, className = '' }) => {
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
