import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import Tooltip from '../Tooltip';
import { colours, fonts } from '../../tailwind/theme';

interface Props extends PropsWithChildren {
  label?: string;
  description?: string;
  htmlFor?: string;
  helpText?: string;
  helpPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoWrapper: FC<Props> = ({
  label,
  description,
  helpText,
  htmlFor,
  helpPosition = 'right',
  children,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="flex items-center gap-[7px]">
          <label className={`${fonts.body} ${colours.textOnSurface}`} htmlFor={htmlFor}>
            {label}
          </label>
          {helpText ? (
            <Tooltip text={helpText} position={helpPosition}>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={`h-3.5 ${colours.textOnSurface}`}
                aria-label="information"
              />
            </Tooltip>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <p className={`${fonts.body} ${colours.textOnSurfaceSubtle}`} aria-label={description}>
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
};

export default InfoWrapper;
