import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fonts, colours, Toaster, Drawer } from '@bluelightcard/shared-ui';

interface AccountPagesHeaderProps {
  title: string;
  hasBackButton?: boolean;
}

const AccountPagesHeader = ({ title, hasBackButton = true }: AccountPagesHeaderProps) => {
  const lifecycleEvent = new InvokeNativeLifecycle();

  const handleBackClick = () => {
    try {
      lifecycleEvent.lifecycleEvent('onBackPressed');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`w-full grid grid-cols-12 p-[16px] border-[1px] ${colours.borderOnSurfaceOutlineSubtle}`}
    >
      <Drawer />
      <Toaster />
      {hasBackButton ? (
        <button
          onClick={handleBackClick}
          className={`col-span-2 w-[fit-content] ${colours.textPrimary}`}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="xs"
            className={`pr-[2px] ${colours.textPrimary} `}
          />
          Back
        </button>
      ) : null}
      <h2
        className={`text-center ${colours.textOnSurface} ${fonts.titleMedium}
        ${hasBackButton ? 'col-span-8' : 'col-span-12'}`}
      >
        {title}
      </h2>
    </div>
  );
};

export default AccountPagesHeader;
