import { FC, useMemo, useState } from 'react';
import { alertColorConfig, getIconByStateOrString } from './alertConfig';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { conditionalStrings } from '../../utils/conditionalStrings';
import { AlertProps, State } from './alertTypes';
import { fonts } from '../../tailwind/theme';

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
  isDismissable = true,
}) => {
  const [visible, setVisible] = useState(true);

  const { iconColor, backgroundColor } = alertColorConfig[state];

  const resolvedIcon = getIconByStateOrString(state as State, icon);

  const backgroundAlertColor = alertBackgroundColor ?? backgroundColor;

  const iconAlertColor =
    iconAccentColor && iconAccentColor.length > 1 ? iconAccentColor : iconColor;

  const styleVariant = {
    Banner: {
      fullWidth: 'w-full',
      variant: 'sticky top-0 left-0 z-50 px-[1rem] tablet:px-[3.5rem] laptop:px-[6.5rem] py-[1rem]',
      layout: 'tablet:flex tablet:mx-6',
      title: `${fonts.titleSmall} tablet:font-typography-title-medium-semibold tablet:font-typography-title-medium-semibold-weight tablet:text-typography-title-medium-semibold tablet:leading-typography-title-medium-semibold tablet:tracking-typography-title-medium-semibold`,
      subtext: `pt-2 ${fonts.bodySmall} tablet:font-typography-body tablet:font-typography-body-weight tablet:text-typography-body tablet:leading-typography-body tablet:tracking-typography-body`,
      children: 'mt-[0.75rem] tablet:mt-0 tablet:justify-end',
      icon: 'tablet:items-center',
      iconSize: 'pt-1 tablet:pt-[0px] tablet:text-[24px]',
    },
    Inline: {
      fullWidth: isFullWidth ? 'w-full' : 'mx-auto',
      variant: 'relative  px-3 py-2',
      title: fonts.bodySmallSemiBold,
      subtext: `pt-1 ${fonts.bodySmall}`,
      layout: 'flex flex-col gap-0',
      children: 'flex flex-col gap-1',
      icon: '',
      iconSize: `pt-1 tablet:pt-[5px]`,
    },
  };

  const variantStyle = styleVariant[variant];

  const hideAlert = !visible ? 'hidden' : '';

  const childContainer = useMemo(() => {
    if (!children) return null;

    const flexDirectionStyles = variant === 'Inline' ? 'flex-col' : 'flex-row';
    const bannerStyles = variant === 'Banner' ? 'ml-auto mr-4 items-center' : '';
    const childContainerStyles = `${variantStyle.children} ${flexDirectionStyles} ${bannerStyles} flex justify-start items-start max-w-[250px] text-base w-full`;
    return <div className={childContainerStyles}>{children}</div>;
  }, [variantStyle.children, variant]);

  if (!visible) return null;

  const contentClass = conditionalStrings({
    'flex-col content-center  max-w-[750px]': true,
    'tablet:pr-[16px]': isDismissable,
  });

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
        <div className={`${variantStyle.layout} ml-4 m-auto w-full`}>
          <div className={contentClass}>
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
          {childContainer}
        </div>
        {variant === 'Banner' && isDismissable && (
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
