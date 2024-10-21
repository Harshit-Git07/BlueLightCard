import { FC, useState } from 'react';

const CardNumber: FC = () => {
  const [cardNumber, setCardNumber] = useState('');

  const handleChangeCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
  };

  return (
    <label className="mt-1 grid gap-4 grid-cols-1 items-center w-full cursor-pointer select-none text-dark">
      <input
        id={'cardNumber'}
        type="number"
        placeholder="Card Number"
        value={cardNumber}
        onChange={handleChangeCardNumber}
        className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
      />
    </label>
  );
};

export default CardNumber;
