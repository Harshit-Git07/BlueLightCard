import { FC, useState } from 'react';
import { AlertProps } from './alertTypes';
import { alertColorConfig, getIconByStateOrString } from './alertConfig';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Alert: FC<AlertProps> = ({
  variant = 'Banner',
  state = 'Default',
  title,
  subtext,
  icon,
  iconAccentColor,
  alertBackgroundColor,
  children,
  isFullWidth,
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  const { iconColor, backgroundColor } = alertColorConfig[state];

  const resolvedIcon = getIconByStateOrString(state, icon);

  const backgroundAlertColor = alertBackgroundColor ?? backgroundColor;

  const iconAlertColor =
    iconAccentColor && iconAccentColor.length > 1 ? iconAccentColor : iconColor;

  const styleVariant = {
    Banner: {
      fullWidth: 'w-full',
      variant: 'sticky top-0 left-0 z-50 px-[1rem] tablet:px-[3.5rem] laptop:px-[6.5rem] py-[1rem]',
      layout: 'tablet:flex tablet:mx-6',
      title:
        'font-typography-title-small font-typography-title-small-weight text-typography-title-small leading-typography-title-small tracking-typography-title-small tablet:font-typography-title-medium-semibold tablet:font-typography-title-medium-semibold-weight tablet:text-typography-title-medium-semibold tablet:leading-typography-title-medium-semibold tablet:tracking-typography-title-medium-semibold',
      subtext:
        'pt-2 font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small tracking-typography-body-small tablet:font-typography-body tablet:font-typography-body-weight tablet:text-typography-body tablet:leading-typography-body tablet:tracking-typography-body',
      children: 'mt-[0.75rem] tablet:mt-0 tablet:justify-end',
      icon: 'tablet:items-center',
      iconSize: 'pt-1 tablet:pt-[0px] tablet:text-[24px]',
    },
    Inline: {
      fullWidth: isFullWidth ? 'w-full' : 'mx-auto',
      variant: 'relative  px-[0.75rem] py-[0.75rem]',
      title:
        'font-typography-body-small-semibold font-typography-body-small-semibold-weight text-typography-body-small-semibold leading-typography-body-small-semibold tracking-typography-body-small-semibold  ',
      subtext:
        'pt-1 font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small tracking-typography-body-small',
      layout: 'flex flex-col gap-0',
      children: 'flex flex-col gap-1',
      icon: '',
      iconSize: `pt-1 tablet:pt-[5px]`,
    },
  };

  const variantStyle = styleVariant[variant];

  const hideAlert = !visible && 'hidden';

  if (!visible) return null;

  return (
    <div
      className={`
        ${hideAlert} 
        ${variantStyle.fullWidth}
        ${backgroundAlertColor} 
        ${variantStyle.variant} 
        flex flex-col rounded justify-between 
      `}
      data-testid="alert"
    >
      <div className="flex basis-full flex-row" data-testid={`alert${variant}`}>
        {resolvedIcon && typeof resolvedIcon !== 'string' ? (
          <div className={`flex items-start ${variantStyle.icon}`}>
            <div className={`${iconAlertColor}`} data-testid="alert-icon">
              <FontAwesomeIcon
                data-testid="icon"
                icon={resolvedIcon}
                className={`text-[20px] flex content-start ${variantStyle.iconSize}`}
              />
            </div>
          </div>
        ) : null}
        <div className={`${variantStyle.layout} mx-4 m-auto w-full`}>
          <div className="flex-col content-center tablet:pr-[16px] max-w-[750px]">
            <p
              className={`w-full text-colour-onSurface-light dark:text-colour-onSurface-dark break-words ${variantStyle.title}`}
            >
              {title}
            </p>

            {subtext && (
              <div
                className={`flex-col w-full ${variantStyle.subtext} text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark break-words`}
              >
                {subtext}
              </div>
            )}
          </div>
          {children && (
            <div
              className={`flex flex-col justify-start items-start max-w-[250px] text-base w-full ${variantStyle.children}`}
            >
              {children}
            </div>
          )}
        </div>
        {variant === 'Banner' && 'isDismissable' in props && props.isDismissable && (
          <div className="flex items-start  tablet:items-center">
            <button
              onClick={() => setVisible(false)}
              aria-label="Close"
              className="content-center text-center rounded-full text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[20px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Alert;
