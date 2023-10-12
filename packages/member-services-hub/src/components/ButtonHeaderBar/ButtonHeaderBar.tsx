import React from 'react';
import { FC } from 'react';
import { ButtonHeaderBarProps } from './types';

export const ButtonHeaderBar: FC<ButtonHeaderBarProps> = ({ id, show, buttonText }) => {
  if (show) {
    return (
      <button className="bg-background-button-standard-primary-enabled-base inline-flex items-center justify-center rounded-md py-4 px-10 text-center text-base font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10 font-museosans mr-3">
        {buttonText}
      </button>
    );
  } else {
    return <div></div>;
  }
};

export default ButtonHeaderBar;
