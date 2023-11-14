'use client';
import GlobalNavigation from '../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import React, { useState } from 'react';
import OnlineAnalyticsImage from '@assets/DashboardImg.svg';
import HeaderBar from '@/components/HeaderBar/HeaderBar';
const Home: NextPage<any> = (props) => {
  return (
    <main className="flex flex-row bg-[#FAFAFA]">
      <GlobalNavigation />
      <div className="w-full flex flex-col flex-grow-1">
        <HeaderBar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <div className="h-[994px] pb-36 flex-col justify-center items-center inline-flex">
          <div className="flex-col justify-center items-center gap-6 flex">
            <OnlineAnalyticsImage height={340} width={340} />
            <div className="flex-col justify-start items-center gap-4 flex">
              <h1 className="text-neutral-700 text-[32px] font-semibold font-['Museo Sans'] leading-10 tracking-tight">
                Your New Dashboard Coming Soon!
              </h1>
              <p className="text-neutral-700 text-xl font-light font-['Museo Sans'] leading-normal tracking-tight">
                Please hold....Some exciting new things are in progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
