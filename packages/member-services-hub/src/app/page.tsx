'use client';
import GlobalNavigation from '../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import React, { useState } from 'react';
import OnlineAnalyticsImage from '@assets/online-analytics-1.svg';
import HeaderBar from '@/components/HeaderBar/HeaderBar';

const Home: NextPage<any> = (props) => {
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="w-full flex flex-col flex-grow-1">
        <HeaderBar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <div className="flex flex-col justify-center items-center pt-[150px]">
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
