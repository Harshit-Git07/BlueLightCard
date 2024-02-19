import { useContext, useEffect, useState } from 'react';
import UserContext, { User } from './UserContext';
import { IDENTITY_USER_PROFILE_ENDPOINT } from '@/global-vars';
import AuthContext from '../Auth/AuthContext';
import axios, { AxiosError } from 'axios';

const ageGated = (dob: string) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18;
};

type UserProviderProps = {
  children: React.ReactNode;
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [dislikes, setDislikes] = useState<number[]>([]);
  const [isAgeGated, setIsAgeGated] = useState<boolean>(true); // Default to true, in case the user which hasnt been found yet is age gated

  const authCtx = useContext(AuthContext);

  // Fetch user data
  useEffect(() => {
    const updateDislikes = (userData: User) => {
      if (!userData) {
        setDislikes([]);
        setIsAgeGated(true);
        return;
      }

      // Convert the user's companies_follows array into an array of company IDs which are disliked
      const dislikes = userData.companies_follows.flatMap(
        (obj: { companyId: string; likeType: string }) =>
          obj.likeType === 'Dislike' ? [parseInt(obj.companyId, 10)] : []
      );

      setDislikes(dislikes);

      setIsAgeGated(ageGated(userData.profile.dob));
    };

    const fetchUser = async () => {
      let userData;

      await axios
        .request({
          url: IDENTITY_USER_PROFILE_ENDPOINT,
          headers: {
            Authorization: `Bearer ${authCtx.authState.idToken}`,
          },
        })
        .then((response) => {
          userData = mapUser(response.data.data);
          setUser(userData);
          updateDislikes(userData);
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 401) {
            setError('You are not logged in');
          } else {
            setError('An unknown error occurred');
          }
        })
        .catch((error) => {
          setError('An unknown error occurred');
        });
    };

    if (!authCtx.isReady) return;

    if (!user) {
      fetchUser();
    }
  }, [authCtx.authState.idToken, authCtx.isReady, user]);

  return (
    <UserContext.Provider value={{ user, setUser, error, dislikes, isAgeGated }}>
      {children}
    </UserContext.Provider>
  );
};

const mapUser = (fetchUserResponse: any): User => {
  const user: User = {
    profile: {
      dob: fetchUserResponse.profile.dob,
      organisation: fetchUserResponse.profile.organisation,
    },
    companies_follows: fetchUserResponse.companies_follows,
    uuid: fetchUserResponse.uuid,
    legacyId: fetchUserResponse.legacyId,
  };

  return user;
};

export default UserProvider;
