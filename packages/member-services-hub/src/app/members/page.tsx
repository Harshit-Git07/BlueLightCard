'use client';
import GlobalNavigation from '../../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import React from 'react';
import FileShelfImage from '@assets/files-shelf-1.svg';
import HeaderBar from '@/components/HeaderBar/HeaderBar';

const Members: NextPage<any> = (props) => {
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="container flex flex-col">
        <HeaderBar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <div className="container flex flex-col justify-center items-center pt-[150px]">
          <FileShelfImage height={340} width={340} />
          <div className="flex-col items-center gap-4 flex">
            <div className="text-black text-[32px] font-semibold font-['Museo Sans'] leading-10 tracking-tight">
              Members Area Coming Soon!
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

export default Members;
