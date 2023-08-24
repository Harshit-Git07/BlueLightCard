import { FC, useState } from 'react';
import { CountrySelectorProps } from './types';
import Icon from '../Icon/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import List from './List';

const SelectCountry: FC<CountrySelectorProps> = ({
  countries = [
    {
      key: 'uk',
      name: 'United Kingdom',
      link: '/',
    },
    {
      key: 'aus',
      name: 'Australia',
      link: '/',
    },
  ],
  countryKey = 'uk',
}) => {
  const selectedCountry = countries?.find((country) => country.key === countryKey);
  const [expanded, setExpanded] = useState(false);

  const handleSelectorClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="relative">
      {!!(countries && selectedCountry) && (
        <div className="relative z-10">
          <button
            title={selectedCountry.name}
            className="flex gap-3 w-full items-center dark:bg-palette-tertiary-dark bg-palette-tertiary-base p-2.5 rounded-lg text-palette-tertiary-on-base"
            onClick={handleSelectorClick}
          >
            <div className="tablet:w-[35px] tablet:h-[20px]">
              <Icon iconKey={selectedCountry.key} />
            </div>
            <div className="mobile:hidden desktop:block mr-5">
              <p>United Kingdom</p>
            </div>

            <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} size="sm" />
          </button>
          <ul className={`${!expanded ? 'hidden ' : ''}absolute top-12 w-full`}>
            {countries
              .filter((country) => country.key !== countryKey)
              .map((country, index) => (
                <List key={index} country={country} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectCountry;
