import { FC, useState } from 'react';
import alertBoxConfig from './alertBoxConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { AlertBoxProps } from './types';

const AlertBox: FC<AlertBoxProps> = ({ alertType, title, description }) => {
  const [show, setShow] = useState(true);

  const { textColor, backgroundColor } = alertBoxConfig[alertType];

  return (
    <div
      className={`${backgroundColor} ${textColor} w-full py-[0.75rem] px-[2rem] flex justify-between m-2 rounded-4 ${
        !show && 'hidden'
      }`}
    >
      <div className="flex">
        <p>
          <strong>{title}</strong>
        </p>
        <p className="pl-1">{description}</p>
      </div>

      <button onClick={() => setShow(false)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default AlertBox;
