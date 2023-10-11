'use client';
import TabBar from '../components/TabBar/TabBar';
import GlobalNavigation from '../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import Image from 'next/image';
import React, { FC, useState } from 'react';
import { faUserLarge, faCog } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabItemProps } from '@/components/TabBar/types';

const Home: NextPage<any> = (props) => {
  let [open, setOpen] = useState('profile');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <main className="">
      <GlobalNavigation />
      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/member-services-hub.svg"
          alt="Member Services Hub Logo"
          width={380}
          height={77}
          priority
        />
      </div> */}

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
