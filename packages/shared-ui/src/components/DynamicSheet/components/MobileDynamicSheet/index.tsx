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
  const { isOpen, onClose } = useAtomValue(offerSheetAtom);

  const containerDynCss = useCSSConditional({
    'opacity-100': isOpen,
    'hidden opacity-0': !isOpen,
  });
  const containerCss = useCSSMerge('absolute w-[100vw] h-[100vh]', containerDynCss);

  const animatedDynCss = useCSSConditional({
    'translate-y-[-100%]': isOpen,
    'hidden translate-y-0': !isOpen,
  });
  const animatedCss = useCSSMerge(
    'fixed w-[100vw] flex flex-col space-y-2 rounded-t-3xl transition-transform duration-1000 bg-colour-surface-light dark:bg-colour-surface-dark overflow-hidden',
    animatedDynCss,
  );

  return (
    <div className="absolute h-100 bg-transparent">
      <div className={containerCss} onClick={() => outsideClickClose && onClose && onClose()}></div>
      <div className={`${animatedCss} h-[90%] bottom-[-90%]`}>
        {showCloseButton && (
          <div className="w-full flex justify-end p-4 text-colour-onSurface-light dark:text-colour-onSurface-dark">
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
