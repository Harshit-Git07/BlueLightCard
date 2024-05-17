import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/pro-solid-svg-icons';
import { useCSSMerge, useCSSConditional } from '../../../../hooks/useCSS';
import { useAtomValue } from 'jotai';
import { offerSheetAtom } from '../../../OfferSheet/store';

export type Props = PropsWithChildren & {
  showCloseButton?: boolean;
  outsideClickClose?: boolean;
  containerClassName?: string;
};

const MobileDynamicSheet: FC<Props> = ({
  children,
  outsideClickClose = true,
  showCloseButton = false,
  containerClassName = '',
}) => {
  const { isOpen, onClose, height } = useAtomValue(offerSheetAtom);

  const containerDynCss = useCSSConditional({
    'opacity-100': isOpen,
    'hidden opacity-0': !isOpen,
  });
  const containerCss = useCSSMerge(
    'absolute w-full h-full transition-opacity duration-1000 bg-[#00000088]',
    containerDynCss,
  );

  const animatedDynCss = useCSSConditional({
    'translate-y-[-100%]': isOpen,
    'translate-y-0': !isOpen,
  });
  const animatedCss = useCSSMerge(
    'absolute w-full flex flex-col space-y-2 rounded-t-3xl transition-transform duration-1000 bg-white',
    animatedDynCss,
  );

  return (
    <div className="absolute w-full h-full bg-transparent">
      <div className={containerCss} onClick={() => outsideClickClose && onClose && onClose()}></div>
      <div
        className={animatedCss}
        // We use styles here as we want to enable the value to be dynamic.
        // Tailwind cleans up unused values and therefore dynamic values are likely to be removed.
        style={{ height: height, bottom: `-${height}` }}
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

export default MobileDynamicSheet;
