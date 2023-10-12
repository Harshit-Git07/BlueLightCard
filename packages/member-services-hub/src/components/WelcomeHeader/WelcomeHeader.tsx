import React from 'react';
import { FC } from 'react';
import { WelcomeHeaderProps } from './types';

export const WelcomeHeader: FC<WelcomeHeaderProps> = ({ id, show, welcomeHeader, welcomeText }) => {
  if (show) {
    return (
      <div id={id} className="mr-6 lg:block font-museosans">
        <h5 className="text-xl font-semibold text-black">{welcomeHeader}</h5>
        <p className="text-sm text-body-color">{welcomeText}</p>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default WelcomeHeader;
