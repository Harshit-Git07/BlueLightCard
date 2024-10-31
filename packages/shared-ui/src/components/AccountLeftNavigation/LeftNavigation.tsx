import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/pro-regular-svg-icons';
import UserDetails from './UserDetails';
import LeftNavigationLinks from './LeftNavigationLinks';

type Props = {
  isOpen: boolean;
  onLinkSelection: (href: string) => void;
  onCloseDrawer: () => void;
};

const LeftNavigation = ({ isOpen, onLinkSelection, onCloseDrawer }: Props) => {
  return (
    <>
      <div
        className={`mobile:block tablet:hidden absolute z-10 flex flex-col gap-3 w-[370px] h-full p-4 bg-white delay-400 duration-500 ease-in-out transition-all ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-right">
          <button onClick={onCloseDrawer}>
            <FontAwesomeIcon icon={faClose} size="lg" />
          </button>
        </div>

        <UserDetails />

        <LeftNavigationLinks onSelection={onLinkSelection} />
      </div>

      <div className="mobile:hidden tablet:block">
        <LeftNavigationLinks onSelection={onLinkSelection} />
      </div>
    </>
  );
};

export default LeftNavigation;
