import { FC } from 'react';
import { AccordionChildInputProps } from './types';

const AccordionChildInput: FC<AccordionChildInputProps> = ({ fields }) => {
  return (
    <>
      <div className="w-[109.6%] ml-[-50px] h-[1px] bg-[#e7e7e7]"></div>
      <div className="m-3">
        <div className="flex">
          <div className="mr-8 mt-6 mb-6 w-full">
            <label className="mb-[10px] block text-base font-medium text-dark">{fields.firstName}</label>
            <input
              type="text"
              name="firstName"
              className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
          <div className="mr-8 mt-6 mb-6 w-full">
            <label className="mb-[10px] block text-base font-medium text-dark">{fields.lastName}</label>
            <input
              type="text"
              className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>
        <div className="flex">
          <div className="mr-8 mt-3 mb-6 w-full">
            <label className="mb-[10px] block text-base font-medium text-dark">{fields.email}</label>
            <input
              type="text"
              name="firstName"
              className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
          <div className="mr-8 mt-3 mb-6 w-full">
            <label className="mb-[10px] block text-base font-medium text-dark">{fields.phoneNumber}</label>
            <input
              type="text"
              className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AccordionChildInput;
