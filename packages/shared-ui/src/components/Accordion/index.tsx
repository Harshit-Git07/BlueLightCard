import { FC, useState } from 'react';
import MinusSvg from './MinusSvg';
import PlusSvg from './PlusSvg';

export type Props = {
  title: string;
  children: React.ReactNode;
};

const Accordion: FC<Props> = ({ title, children }) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };
  return (
    <div className="w-full leading-6">
      <button
        className="flex w-full text-left py-3 px-1 items-center border-b-[0.5px] border-b-[#DCDCDC] border-solid"
        onClick={() => handleToggle()}
      >
        <div className="w-full">
          <h4 className="font-['MuseoSans'] text-base font-medium text-[#1C1D22]">{title}</h4>
        </div>
        <div className="flex max-w-[40px] items-center justify-end">
          {active ? (
            <div style={{ width: 14, height: 14 }}>
              <MinusSvg />
            </div>
          ) : (
            <div style={{ width: 15, height: 15 }}>
              <PlusSvg />
            </div>
          )}
        </div>
      </button>

      <div
        className={`duration-200 ease-in-out ${
          active ? 'block' : 'hidden'
        } font-['MuseoSans'] py-3 text-base break-words font-light leading-5 whitespace-pre-wrap`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
