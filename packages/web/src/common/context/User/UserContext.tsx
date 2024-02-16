import React from 'react';

type followType = {
  companyId: string;
  likeType: string;
};

export type User = {
  profile: {
    dob: string;
  };
  organisation: string;
  companies_follows: followType[];
  uuid: string;
  legacyId: string;
};

export type UserContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  error: string | undefined;

  dislikes: number[];
  isAgeGated: boolean;
};

const UserContext = React.createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  error: undefined,

  dislikes: [],
  isAgeGated: true,
});

export default UserContext;
