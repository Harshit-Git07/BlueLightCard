import { FC, MouseEventHandler, ReactNode } from 'react';
import { ToastStatus } from './ToastTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { colours, fonts } from '../../tailwind/theme';
import {
  faCheckCircle,
  faCircle,
  faExclamationTriangle,
  faInfoCircle,
  faXmark,
  faXmarkCircle,
} from '@fortawesome/pro-solid-svg-icons';
import useToaster from './Toaster/useToaster';

type ToastProps = {
  status?: ToastStatus;
  title?: string;
  text: string;
  children?: ReactNode;
  hasClose?: boolean;
  pauseOnHover?: boolean;
  icon?: IconDefinition;
};

export const getToastIcon = (status: ToastStatus): [IconDefinition, string] => {
  switch (status) {
    case ToastStatus.Error:
      return [faXmarkCircle, 'text-colour-error dark:text-colour-error-dark'];
    case ToastStatus.Success:
      return [faCheckCircle, 'text-colour-success dark:text-colour-success-dark'];
    case ToastStatus.Info:
      return [faInfoCircle, 'text-colour-info dark:text-colour-info-dark'];
    case ToastStatus.Warning:
      return [faExclamationTriangle, 'text-colour-warning dark:text-colour-warning-dark'];
  }
  return [faCircle, 'text-colour-onSurface dark:text-colour-onSurface-dark'];
};

const Toast: FC<ToastProps> = ({
  title,
  text,
  status = ToastStatus.Default,
  children,
  hasClose = true,
  pauseOnHover = true,
  icon,
}) => {
  const { closeToast, timer } = useToaster();

  const articleClasses = 'w-full p-[16px] max-w-[713px] min-h-12 flex';
  const iconClasses = 'w-[24px] h-[24px]';
  const bodyPaddingX = 'px-[16px]';
  const titleClasses = `${fonts.titleMediumSemiBold} ${colours.textOnSurface}`;
  const subtextClasses = `${fonts.body} ${colours.textOnSurfaceSubtle}`;
  const dropShadow = 'shadow-[0px_1px_4px_0px_#0000001F]';

  const [defaultIcon, iconColours] = getToastIcon(status);
  const iconSymbol = icon ?? defaultIcon;
  const ico = <FontAwesomeIcon icon={iconSymbol} className={`${iconClasses} ${iconColours}`} />;

  const handleClose: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    closeToast();
  };

  const handleHover = (hovering: boolean) => () => {
    if (!pauseOnHover || !timer) return;
    hovering ? timer.pause() : timer.resume();
  };

  return (
    <article
      aria-live="polite"
      aria-atomic="true"
      className={`${articleClasses} w-full rounded rounded-1.5 ${colours.backgroundOnPrimary} ${dropShadow}`}
      onMouseEnter={handleHover(true)}
      onMouseLeave={handleHover(false)}
    >
      <div role="img" aria-label={`Icon: ${status}`}>
        {ico}
      </div>

      <div className={bodyPaddingX}>
        {title ? <h1 className={titleClasses}>{title}</h1> : null}
        <p className={subtextClasses}>{text}</p>
        {children ? <div className={'pt-1'}>{children}</div> : null}
      </div>

      {hasClose ? (
        <button
          className={`appearance-none flex ${colours.textOnSurfaceSubtle} ml-auto`}
          onClick={handleClose}
          aria-label={'close'}
        >
          <FontAwesomeIcon icon={faXmark} className={iconClasses} />
        </button>
      ) : null}
    </article>
  );
};

export default Toast;
