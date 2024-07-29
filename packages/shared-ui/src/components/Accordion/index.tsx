import { FC, useState } from 'react';
import MinusSvg from './MinusSvg';
import PlusSvg from './PlusSvg';
import { useAtomValue } from 'jotai';
import { offerSheetAtom } from '../OfferSheet/store';
import { AmplitudeArg } from '../../types';

export type Props = {
  title: string;
  children: React.ReactNode;
  amplitudeDetails?: AmplitudeArg;
};

const Accordion: FC<Props> = ({ title, children, amplitudeDetails }) => {
  const [active, setActive] = useState(false);
  const { amplitudeEvent } = useAtomValue(offerSheetAtom);

  const handleToggle = () => {
    setActive(!active);
    if (!active && amplitudeEvent && amplitudeDetails) {
      amplitudeEvent(amplitudeDetails);
    }
  };

  return (
    <div className="w-full leading-6">
      <button
        className="flex w-full text-left py-3 px-1 items-center border-b-[0.5px] border-b-accordion-divider-colour-light dark:border-b-accordion-divider-colour-dark border-solid"
        onClick={() => handleToggle()}
      >
        <div className="w-full">
          <h4 className="text-accordion-label-colour-light dark:text-accordion-label-colour-dark font-accordion-label-font text-accordion-label-font font-accordion-label-font-weight tracking-accordion-label-font leading-accordion-label-font">
            {title}
          </h4>
        </div>
        <div className="flex max-w-[40px] items-center justify-end text-accordion-icon-colour-light dark:text-accordion-icon-colour-dark">
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
        } py-3 break-words whitespace-pre-wrap text-accordion-text-colour-light dark:text-accordion-text-colour-dark font-accordion-text-font text-accordion-text-font font-accordion-text-font-weight tracking-accordion-text-font leading-accordion-text-font`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
