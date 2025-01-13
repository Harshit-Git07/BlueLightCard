import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/pro-regular-svg-icons';
import { AccountDetails } from '@bluelightcard/shared-ui';
import LeftNavigationLinks from './LeftNavigationLinks';

type Props = {
  isOpen: boolean;
  accountNumber: string | undefined;
  firstName: string;
  lastName: string;
  onLinkSelection: (href: string) => void;
  onCloseDrawer: () => void;
};

const LeftNavigation = ({
  isOpen,
  accountNumber,
  firstName,
  lastName,
  onLinkSelection,
  onCloseDrawer,
}: Props) => {
  return (
    <div
      className={`
        absolute tablet:relative z-10 flex flex-col h-full bg-white delay-400 duration-500 ease-in-out transition-all tablet:animate-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full tablet:translate-x-0'}
      `}
    >
      <div className="block tablet:hidden text-right">
        <button onClick={onCloseDrawer}>
          <FontAwesomeIcon icon={faClose} size="lg" />
        </button>
      </div>

      <div className="block tablet:hidden pl-4 my-5 w-[350px]">
        <AccountDetails accountNumber={accountNumber} firstName={firstName} lastName={lastName} />
      </div>

      <div className="w-[350px] tablet:w-[198px] desktop:w-[294px]">
        <LeftNavigationLinks onSelection={onLinkSelection} />
      </div>
    </div>
  );
};

export default LeftNavigation;
