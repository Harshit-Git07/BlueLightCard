import React from 'react';
import { FC } from 'react';
import { HeaderbarProps } from './types';

import { DropdownItem } from '../DropdownItem/DropdownItem';
import { WelcomeHeader } from '../WelcomeHeader/WelcomeHeader';
import { ButtonHeaderbar } from '../ButtonHeaderbar/ButtonHeaderbar';
import { CalenderIcon } from '../CalenderIcon/CalenderIcon';
import { MessagesIcon } from '../MessagesIcon/MessagesIcon';
import { NotificationsIcon } from '../NotificationsIcon/NotificationsIcon';
import { ProfilePicture } from '../ProfilePicture/ProfilePicture';
import { Chevron } from '../Chevron/Chevron';
import { Search } from '../Search/Search';

const Headerbar: FC<HeaderbarProps> = ({
  firstname,
  surname,
  email,
  button,
  rightChevron,
  leftChevron,
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
  return (
    <header>
      <div className="mx-auto w-full px-4 lg:container">
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
            <ButtonHeaderbar
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
              <button className="flex items-center">
                <p className="mr-4 text-right text-sm font-medium text-black font-museosans">
                  {firstname + ' ' + surname}
                  <span className="block text-xs font-normal text-body-color">{email}</span>
                </p>
                <Chevron id="leftChevron" show={leftChevron} />
                <ProfilePicture
                  id={profilePicture === undefined ? 'initials' : 'profilePicture'}
                  profilePicture={profilePicture === undefined ? 'notset' : profilePicture}
                  firstname={firstname}
                  surname={surname}
                />
                <Chevron
                  id="rightChevron"
                  show={rightChevron === undefined ? true : rightChevron}
                />
              </button>
              <div className="invisible absolute right-0 top-[120%] mt-3 w-[200px] space-y-2 rounded bg-white p-3 opacity-0 shadow-card-2 duration-200 group-hover:visible group-hover:top-full group-hover:opacity-100">
                <DropdownItem id="dropdownList" link="/#" name="My Account" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headerbar;
