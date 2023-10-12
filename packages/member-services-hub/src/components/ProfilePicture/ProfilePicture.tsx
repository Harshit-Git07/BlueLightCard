import React from 'react';
import { FC } from 'react';
import { ProfilePictureProps } from './types';

export const ProfilePicture: FC<ProfilePictureProps> = ({
  id,
  profilePicture,
  firstname,
  surname,
}) => {
  let initials = firstname[0] + surname[0];
  if (profilePicture === 'notset') {
    return (
      <div
        id={id}
        className="bg-background-button-standard-primary-enabled-base h-[46px] w-[46px] rounded-full object-cover object-center"
      >
        <p className="@apply text-[white] table-cell align-middle text-center no-underline h-[46px] w-[100px] text-2xl">
          {initials}
        </p>
      </div>
    );
  } else {
    return (
      <img
        id={id}
        src={profilePicture}
        alt={profilePicture}
        className="h-[46px] w-[46px] rounded-full object-cover object-center"
      />
    );
  }
};

export default ProfilePicture;
