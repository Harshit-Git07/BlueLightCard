import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { FC } from 'react';

const SearchButton: FC<{ displaySearch: () => void }> = (props) => {
  return (
    <div className="flex" data-testid="searchNav">
      <p className="mr-2 self-center text-[#666] font-semibold tablet:block mobile:hidden">
        Search by company <i className="font-normal">or</i> phrase{' '}
        <span>
          <FontAwesomeIcon icon={faArrowRight} size="lg" />
        </span>
      </p>
      <div
        className="bg-palette-accent-3 text-shade-greyscale-white w-[52px] h-[52px] cursor-pointer flex"
        onClick={props.displaySearch}
        data-testid="searchBtn"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="w-full self-center" />
      </div>
    </div>
  );
};

export default SearchButton;
