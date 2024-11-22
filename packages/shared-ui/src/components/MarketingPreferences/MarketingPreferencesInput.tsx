import { FC, ReactNode, SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colours, fonts } from '../../tailwind/theme';
import CheckBoxInput from '../Checkbox/CheckBoxInput';
import { IconDefinition } from '@fortawesome/sharp-solid-svg-icons';

interface MarketingPreferencesInputProps {
  id: string;
  title: string;
  icon: IconDefinition;
  children: ReactNode;
  onChange: (e: SyntheticEvent) => void;
  isChecked: boolean;
}

export const MarketingPreferencesInput: FC<MarketingPreferencesInputProps> = ({
  id,
  title,
  icon,
  children,
  onChange,
  isChecked,
}) => {
  return (
    <label htmlFor={`marketing-preferences-${id}`} className={'flex items-center my-[24px] grow'}>
      <FontAwesomeIcon
        icon={icon}
        className={`w-[24px] h-[24px] laptop:w-[32px] laptop:h-[32px] ${colours.textOnSurface} self-start laptop:self-center`}
      />
      <div className={'pl-2 laptop:pl-3 grow'}>
        <h3 className={`${fonts.body} ${colours.textOnSurface}`}>{title}</h3>
        {children}
      </div>
      <div
        className={
          'pl-4 tablet:pl-0 tablet:w-[90px] tablet:min-w-[90px] tablet:flex tablet:justify-center'
        }
      >
        <CheckBoxInput
          id={`marketing-preferences-${id}`}
          onChange={onChange}
          isChecked={isChecked}
        />
      </div>
    </label>
  );
};
