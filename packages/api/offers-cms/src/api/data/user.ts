import ky from 'ky';

import { env } from '../../lib/env';

type User = {
  data: {
    profile: {
      organisation: string;
    };
  };
};

export async function getUser(authToken: string) {
  return ky
    .get(`${env.USER_PROFILE_ENDPOINT}`, {
      headers: {
        Authorization: authToken,
      },
    })
    .json<User>();
}
