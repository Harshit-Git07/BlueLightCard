import React, { useState } from 'react';
import { FC } from 'react';
import { HeaderBarProps } from './types';

import { DropdownItem } from '../DropdownItem/DropdownItem';
import { WelcomeHeader } from '../WelcomeHeader/WelcomeHeader';
import ButtonHeaderBar from '../ButtonHeaderBar/ButtonHeaderBar';
import { CalenderIcon } from '../CalenderIcon/CalenderIcon';
import { MessagesIcon } from '../MessagesIcon/MessagesIcon';
import { NotificationsIcon } from '../NotificationsIcon/NotificationsIcon';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { Chevron } from '../Chevron/Chevron';
import { Search } from '../Search/Search';
import { cssUtil } from '@/app/common/utils/cssUtil';

const HeaderBar: FC<HeaderBarProps> = ({
  firstname,
  surname,
  email,
  button,
  chevronPosition = 'right',
  messages,
  notifications,
  calender,
  welcome,
  search,
  profilePicture,
  welcomeHeader,
  welcomeText,
  buttonText,
}) => {
  const [dropdownClicked, setDropdownClicked] = useState(false);
  return (
    <header className="mx-auto w-full h-[86px] border-s-white border-s-2 border-b border-b-gray-100 px-6 lg:container">
      <div className="flex items-center justify-end bg-white py-3 px-3 sm:justify-between md:px-8">
        <div className="items-center sm:flex">
          <WelcomeHeader
            id="welcomeBoxId"
            show={welcome}
            welcomeHeader={welcomeHeader != undefined ? welcomeHeader : ''}
            welcomeText={welcomeText != undefined ? welcomeText : ''}
          />
        </div>
        <div>
          <Search id="searchBoxId" show={search} />
        </div>

        <div className="flex items-center">
          <ButtonHeaderBar
            id="button"
            show={button}
            buttonText={buttonText != undefined ? buttonText : ''}
          />
          <div className="mr-5 md:block">
            <CalenderIcon id="calenderIcon" show={calender} />
          </div>
          <div className="relative mr-5 md:block">
            <NotificationsIcon id="notificationIcon" show={notifications} />
          </div>
          <div className="relative mr-5 md:block">
            <MessagesIcon id="messagesIcon" show={messages} />
          </div>

          <div className="group relative">
            <div className="flex items-center">
              <p className="flex flex-col text-end text-[#32363C] text-base font-normal font-museosans leading-normal tracking-tight">
                {firstname + ' ' + surname}
                <span className="text-zinc-500 text-sm font-normal font-['Museo Sans'] leading-tight tracking-tight">
                  {email}
                </span>
              </p>

              <div
                className={cssUtil([
                  'flex ps-3 gap-2',
                  chevronPosition === 'left' ? ' flex-row-reverse' : 'flex-row',
                ])}
              >
                <ProfilePicture
                  id={profilePicture === undefined ? 'initials' : 'profilePicture'}
                  profilePicture={profilePicture}
                  firstname={firstname}
                  surname={surname}
                />
                <Chevron
                  id="chevron"
                  dropdownClicked={dropdownClicked}
                  setDropdownClicked={setDropdownClicked}
                />
              </div>
            </div>
            {dropdownClicked && (
              <div className="w-[202px] right-3 top-[75px] absolute z-20 h-14 py-2.5 bg-white rounded border border-zinc-200 flex-col justify-start items-start inline-flex">
                <DropdownItem id="dropdownList" link="/my-account" name="My Account" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
