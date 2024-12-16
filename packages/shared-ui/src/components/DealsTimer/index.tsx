import moment from 'moment';
import { useState, useEffect } from 'react';
import { DealsTimerProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-regular-svg-icons';

const DealsTimer = ({ expiry }: DealsTimerProps) => {
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [timeDifference, setTimeDifference] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const currentDate = moment();
      const expiryDate = moment(expiry);
      const timeDiff = expiryDate.diff(currentDate);

      setTimeDifference(timeDiff);

      const duration = moment.duration(timeDiff);

      setRemainingTime({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
      });
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 6000);

    return () => clearInterval(intervalId);
  }, [expiry]);

  return (
    <div className="py-2 mx-[-24px] flex items-center justify-center gap-x-2 bg-colour-error-bright-light">
      <FontAwesomeIcon className={`w-4 h-4 text-black`} size="lg" icon={faClock} />
      {timeDifference <= 0 ? (
        <p className="text-black">This deal has expired</p>
      ) : (
        <p className="text-black">
          Hurry! This deal expires in
          <time className="text-colour-onError-container font-bold">
            {' '}
            {remainingTime.days}d:{remainingTime.hours}
            h:
            {remainingTime.minutes}m
          </time>
        </p>
      )}
    </div>
  );
};

export default DealsTimer;
