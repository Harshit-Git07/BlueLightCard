'use client';
import React from 'react';
import { NextPage } from 'next';
import GlobalNavigation from '../../components/GlobalNavigation/GlobalNavigation';
import FileShelfImage from '@assets/files-shelf-1.svg';
import Headerbar from '@/components/Headerbar/Headerbar';

const Eligibility: NextPage<any> = (props) => {
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="container flex flex-col">
        <Headerbar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <div className="container flex flex-col justify-center items-center pt-[150px]">
          <FileShelfImage height={340} width={340} />
          <div className="flex-col items-center gap-4 flex">
            <div className="text-black text-[32px] font-semibold font-['Museo Sans'] leading-10 tracking-tight">
              Eligibility Area Coming Soon!
            </div>
            <div className="text-black text-xl font-light font-['Museo Sans'] leading-normal tracking-tight">
              Please hold...Some exciting new things are in progress
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Eligibility;
