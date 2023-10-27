'use client';
import TabBar from '../../components/TabBar/TabBar';
import GlobalNavigation from '../../components/GlobalNavigation/GlobalNavigation';
import { NextPage } from 'next';
import React, { FC, useState } from 'react';
import { faUserLarge, faCog } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import HeaderBar from '@/components/HeaderBar/HeaderBar';

const MyAccount: NextPage<any> = (props) => {
  let [open, setOpen] = useState('profile');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <main className="flex flex-row">
      <GlobalNavigation />
      <div className="w-full flex flex-col">
        <HeaderBar firstname="Daniel" surname="Cook" email="danielcook@bluelightcard.co.uk" />
        <TabBar
          items={[
            {
              icon: <FontAwesomeIcon data-testid="profile-icon" icon={faUserLarge} />,
              category: 'profile',
              title: 'Profile',
              details: () => (
                <ProfileCard
                  user_name="Lucy Wolfe"
                  user_image="https://via.placeholder.com/106x106"
                  user_ms_role="Manager"
                  data_pairs={[
                    {
                      label: 'Email',
                      value: 'lucywolfe@bluelightcard.co.uk',
                    },
                    {
                      label: 'password',
                      value: '***********',
                    },
                  ]}
                />
              ),
              open: 'profile',
            },
            {
              icon: <FontAwesomeIcon data-testid="settings-icon" icon={faCog} />,
              category: 'settings',
              title: 'Settings',
              details: '',
              open: 'settings',
            },
          ]}
          defaultOpen="profile"
          onTabClick={handleTabOpen}
          selected={open}
        />
      </div>
    </main>
  );
};

export default MyAccount;
