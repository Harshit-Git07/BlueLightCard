import ky from 'ky';
import { env } from 'src/lib/env';

type User = {
  data: {
    profile: {
      organisation: string;
    };
  };
};

export async function getUser(authToken: string) {
  return ky
    .get(`${env.USER_PROFILE_ENDPOINT}/user`, {
      headers: {
        Authorization: authToken,
      },
    })
    .json<User>();
}
