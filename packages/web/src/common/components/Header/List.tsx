import Link from '@/components/Link/Link';
import Icon from '../Icon/Icon';
import { FC } from 'react';

const List: FC<{ country: { key: string; name: string; link: string } }> = (props) => {
  return (
    <li
      className="dark:bg-palette-tertiary-dark bg-palette-tertiary-base p-2.5 rounded-lg"
      key={props.country.key}
      data-testid="countryList"
    >
      <Link
        className="flex gap-3 items-center text-shade-greyscale-white"
        href={props.country.link}
        title={props.country.name}
        useLegacyRouting={props.country?.link ? props.country.link.includes('.php') : true}
      >
        <div className="w-[30px] h-[15px] tablet:w-[35px] tablet:h-[20px]">
          <Icon iconKey={props.country.key} />
        </div>
        <div className="mobile:hidden desktop:block">
          <p>{props.country.name}</p>
        </div>
      </Link>
    </li>
  );
};

export default List;
