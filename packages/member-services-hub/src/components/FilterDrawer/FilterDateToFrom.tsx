import moment from 'moment';
import { FC, useState } from 'react';

const DateToFrom: FC = () => {
  const [dateFrom, setDateFrom] = useState(moment().format('yyyy-MM-DD'));
  const [dateTo, setDateTo] = useState(moment().format('yyyy-MM-DD'));

  const handleChangeFromDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
  };

  const handleChangeToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  };

  return (
    <>
      <label className="mt-1 grid gap-4 grid-cols-2 items-center w-full cursor-pointer select-none text-dark">
        <div className="m-0">
          <label htmlFor="fromDate" className="text-xs">
            From
          </label>
          <input
            id={'fromDate'}
            type="date"
            value={dateFrom}
            onChange={handleChangeFromDate}
            className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
          />
        </div>
        <div className="m-0">
          <label htmlFor="toDate" className="text-xs">
            To
          </label>
          <input
            id={'toDate'}
            type="date"
            value={dateTo}
            onChange={handleChangeToDate}
            className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
          />
        </div>
      </label>
    </>
  );
};

export default DateToFrom;
