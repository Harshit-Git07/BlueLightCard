import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';
import { useAtomValue } from 'jotai';
import { offerSheetAtom } from '../../../OfferSheet/store';

export type Props = PropsWithChildren & {
  showCloseButton?: boolean;
  onClose?: () => void;
  outsideClickClose?: boolean;
  containerClassName?: string;
  width?: string;
};

const DesktopDynamicSheet: FC<Props> = ({
  children,
  showCloseButton = false,
  outsideClickClose = true,
  containerClassName = '',
  width = '24rem',
}) => {
  const { isOpen, onClose } = useAtomValue(offerSheetAtom);

  return (
    <div className="absolute w-[100vw] bg-transparent">
      <div
        className={`${
          !isOpen ? 'hidden opacity-0' : 'opacity-100'
        } absolute w-[100vw] h-[100vh] bg-[#00000088] transition-opacity duration-1000`}
        onClick={() => outsideClickClose && onClose && onClose()}
      ></div>
      <div
        className={`absolute h-[100vh] bg-white flex flex-col space-y-2 ${
          isOpen ? 'translate-x-[-100%]' : 'translate-x-0'
        } transition-transform duration-300`}
        // We use styles here as we want to enable the value to be dynamic. Tailwind cleans up unused values and therefore dynamic values are likely to be removed.
        style={{ width: width, right: `-${width}` }}
      >
        {showCloseButton && (
          <div className="w-full flex justify-end p-4">
            <FontAwesomeIcon
              icon={faX}
              className="cursor-pointer"
              onClick={() => onClose && onClose()}
            />
          </div>
        )}
        <div className={`${containerClassName} flex-1 w-full h-full overflow-scroll pb-40`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DesktopDynamicSheet;
