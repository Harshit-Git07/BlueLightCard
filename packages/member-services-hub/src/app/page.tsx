'use client';
import TabBar from '../components/TabBar/TabBar';
import GlobalNavigation from '../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import React, { FC, useState } from 'react';
import { faUserLarge, faCog } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabItemProps } from '@/components/TabBar/types';
import OnlineAnalyticsImage from '@assets/online-analytics-1.svg';

const Home: NextPage<any> = (props) => {
  let [open, setOpen] = useState('profile');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="container flex flex-col justify-center items-center">
        <OnlineAnalyticsImage height={340} width={340} />
        <div className="flex-col items-center gap-4 flex">
          <div className="text-black text-[32px] font-semibold font-['Museo Sans'] leading-10 tracking-tight">
            Your New Dashboard Coming Soon!
          </div>
          <div className="text-black text-xl font-light font-['Museo Sans'] leading-normal tracking-tight">
            We are working hard to get some exciting new features to you
          </div>
        </div>
      </div>

      <TabBar
        items={[
          {
            icon: <FontAwesomeIcon data-testid="profile-icon" icon={faUserLarge} />,
            category: 'profile',
            title: 'Profile',
            details: 'profile card page ',
            open: 'profile',
          },
          {
            icon: <FontAwesomeIcon data-testid="settings-icon" icon={faCog} />,
            category: 'settings',
            title: 'Settings',
            details: 'settings card page ',
            open: 'settings',
          },
        ]}
        defaultOpen="profile"
        onTabClick={handleTabOpen}
        selected={open}
      />
    </main>
  );
};

export default Home;
