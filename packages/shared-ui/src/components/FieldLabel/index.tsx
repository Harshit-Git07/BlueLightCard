import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import Tooltip from '../Tooltip';
import { TextCase, transformTextCase } from '../../utils/transformTextCase';
import { colours, fonts } from '../../tailwind/theme';

interface Props extends PropsWithChildren {
  label?: string;
  description?: string;
  htmlFor: string;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const FieldLabel: FC<Props> = ({
  label,
  description,
  tooltip,
  htmlFor,
  tooltipPosition = 'right',
}) => {
  if (!label && !description) return null;

  return (
    <div className="flex flex-col mb-2">
      {label ? (
        <div className="flex items-center gap-2">
          <label
            className={`${fonts.body} ${colours.textOnSurface}`}
            htmlFor={htmlFor}
            aria-label={label}
          >
            {transformTextCase(label, TextCase.CAPS_FIRST_LETTER_ONLY)}
          </label>
          {tooltip ? (
            // TODO: MAMA-174 add htmlFor prop to tooltip to correctly calculate ariaDescribedBy in parent input
            // <Tooltip text={tooltip} htmlFor={htmlFor} position={tooltipPosition}>
            <Tooltip text={tooltip} position={tooltipPosition}>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={`h-3.5 ${colours.textOnSurfaceSubtle}`}
                aria-label="information"
              />
            </Tooltip>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <p
          className={`${fonts.body} ${colours.textOnSurfaceSubtle}`}
          aria-label={description}
          id={`${htmlFor}-description`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default FieldLabel;
