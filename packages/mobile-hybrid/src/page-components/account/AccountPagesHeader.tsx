import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fonts, colours } from '@bluelightcard/shared-ui';

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
      className={`relative flex w-full items-center justify-center p-3 border-[1px] ${colours.borderOnSurfaceOutlineSubtle}`}
    >
      {hasBackButton ? (
        <button
          onClick={handleBackClick}
          className={`absolute left-4 w-[fit-content] text-lg ${colours.textPrimary}`}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="xs"
            className={`pr-2 ${colours.textPrimary}`}
          />
          Back
        </button>
      ) : null}
      <h2 className={`text-center ${colours.textOnSurface} ${fonts.titleMedium}`}>{title}</h2>
    </div>
  );
};

export default AccountPagesHeader;
