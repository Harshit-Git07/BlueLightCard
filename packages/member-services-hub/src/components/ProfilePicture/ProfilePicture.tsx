import React from 'react';
import { FC } from 'react';
import { ProfilePictureProps } from './types';
import Image from 'next/image';

export const ProfilePicture: FC<ProfilePictureProps> = ({
  id,
  profilePicture,
  alt,
  firstname,
  surname,
}) => {
  let initials = firstname[0] + surname[0];
  return profilePicture ? (
    <Image
      id={id}
      src={profilePicture || ''}
      height={46}
      width={46}
      alt={alt || ''}
      className="h-[46px] w-[46px] rounded-full object-cover object-center"
    />
  ) : (
    <div
      id={id}
      className="w-[51.50px] h-[51.50px] left-[-1px] top-[-1px]  bg-[#AD85AD] rounded-full flex items-center justify-center"
    >
      <p className="text-white text-base font-normal font-museosans uppercase leading-normal tracking-tight">
        {initials}
      </p>
    </div>
  );
};

export default ProfilePicture;
