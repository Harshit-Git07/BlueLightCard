import { FC, useState } from 'react';

const PersonalDetails: FC = () => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleChangeSecondName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondName(e.target.value);
  };
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <label className="grid gap-4 grid-cols-2 items-center w-[100%] cursor-pointer select-none text-dark">
        <input
          id={'firstName'}
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={handleChangeFirstName}
          className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
        />
        <input
          id={'secondName'}
          type="text"
          placeholder="Second Name"
          value={secondName}
          onChange={handleChangeSecondName}
          className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
        />
      </label>
      <label className="mt-[16px] grid gap-4 grid-cols-1 items-center w-full cursor-pointer select-none text-dark">
        <input
          id={'email'}
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleChangeEmail}
          className="w-full rounded-lg p-2 border border-stroke dark:border-dark-3"
        />
      </label>
    </>
  );
};

export default PersonalDetails;
