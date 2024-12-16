import React from 'react';
import MinistryOfDefenceLogo from 'assets/dds-ministry-of-defence.svg';
import RoyalNavyLogo from 'assets/dds-royal-navy.svg';
import BritishArmyLogo from 'assets/dds-british-army.svg';
import RAFLogo from 'assets/dds-royal-airfoce.svg';
import ArmedForcesLogo from 'assets/dds-armed-forces-covenant.svg';

const DDSLogos = () => {
  return (
    <div className="flex gap-[18px] items-center justify-between w-full">
      <MinistryOfDefenceLogo className="fill-black dark:fill-white" />
      <RoyalNavyLogo className="fill-black dark:fill-white" />
      <BritishArmyLogo className="fill-black dark:fill-white" />
      <RAFLogo className="fill-black dark:fill-white" />
      <ArmedForcesLogo className="fill-black dark:fill-white" />
    </div>
  );
};

export default DDSLogos;
