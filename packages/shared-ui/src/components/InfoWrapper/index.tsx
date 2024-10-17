import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import Tooltip from '../Tooltip';

type ConditionalProps =
  | {
      label: string;
      helpIcon: true;
      helpText: string;
    }
  | {
      helpIcon?: false;
      helpText?: string;
    };

type Props = PropsWithChildren<
  {
    label?: string;
    description?: string;
    htmlFor?: string;
    helpPosition?: 'top' | 'bottom' | 'left' | 'right';
  } & ConditionalProps
>;

const fontStyle = `text-typography-body
   font-typography-body
   font-typography-body-weight
   leading-text-typography-body
   tracking-text-typography-body`;

const InfoWrapper: FC<Props> = ({
  label,
  description,
  helpIcon,
  helpText,
  htmlFor,
  helpPosition = 'right',
  children,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="flex items-center gap-[7px]">
          <label
            className={`${fontStyle} text-colour-onSurface dark:text-colour-onSurface-dark`}
            htmlFor={htmlFor}
            aria-label={label}
          >
            {label}
          </label>
          {helpIcon && (
            <Tooltip text={helpText} position={helpPosition}>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="h-3.5 text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark"
                aria-label="information"
              />
            </Tooltip>
          )}
        </div>
      ) : null}
      {description ? (
        <p
          className={`${fontStyle} text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark`}
          aria-label={description}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
};

export default InfoWrapper;
