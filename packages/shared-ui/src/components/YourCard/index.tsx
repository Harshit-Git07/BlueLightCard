import { FC } from 'react';
import Typography from '../Typography';
import CopyButton from '../CopyButton/CopyButton';
import { BRAND, ThemeVariant } from '../../types';
import { formatDateDDMMYYYY } from '../../utils/dates';
import { conditionalStrings } from '../../utils/conditionalStrings';
import BlcCard from './BlcCard';
import DdsCard from './DdsCard';

export interface Props {
  brand: string;
  firstName: string;
  lastName: string;
  accountNumber?: string;
  expiryDate?: string;
}

const YourCard: FC<Props> = ({
  brand,
  firstName,
  lastName,
  accountNumber,
  expiryDate = '2030-01-01T00:00:00Z',
}) => {
  const Card = brand === BRAND.DDS_UK ? DdsCard : BlcCard;

  const fullName = `${firstName} ${lastName}`;

  const expDate = formatDateDDMMYYYY(new Date(expiryDate).toString());

  const size = `w-[512px] h-[322px]`;

  const classes = conditionalStrings({
    [`relative bg-white transition border-2 rounded-[40px] shadow-md ${size}`]: true,
    'blur-[4px]': !accountNumber,
  });

  const svgClasses = `absolute top-0 left-0 ${size}`;
  const textClasses = 'absolute top-[180px] left-[40px]';

  return (
    <div className="relative w-[322px] h-[512px] tablet-xl:w-[512px] tablet-xl:h-[322px] max-[350px]:scale-[85%]">
      <div className="absolute top-0 left-0 rotate-90 origin-top-left translate-x-[322px] tablet-xl:rotate-0 tablet-xl:translate-x-0">
        <div className={classes}>
          <Card className={svgClasses} />

          <div className={textClasses}>
            <Typography variant="title-small">{fullName}</Typography>

            <div className="flex items-center gap-2">
              <Typography variant="body-light">{accountNumber ?? 'BLC0000000'}</Typography>

              {accountNumber ? (
                <CopyButton
                  variant={ThemeVariant.Tertiary}
                  label="Copy"
                  size="Small"
                  copyText={accountNumber}
                  defaultStateClassName="hidden tablet-xl:block"
                />
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Typography variant="label-semibold">Expires</Typography>

              <Typography variant="label">{expDate}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourCard;
