'use client';
import TabBar from '../components/TabBar/TabBar';
import GlobalNavigation from '../components/GlobalNavigation/GlobalNavigation';
import Headerbar from '../components/Headerbar/Headerbar';
import { NextPage } from 'next';
import React, { useState } from 'react';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import { faUserLarge, faCog } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OnlineAnalyticsImage from '@assets/online-analytics-1.svg';

const Home: NextPage<any> = (props) => {
  let [open, setOpen] = useState('profile');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="container flex flex-col">
        <Headerbar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <div className="container flex flex-col justify-center items-center pt-[150px]">
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
      </div>
    </main>
  );
};

export default Home;
