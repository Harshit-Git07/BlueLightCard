import ky from 'ky';
import { ApiGatewayV1Api } from 'sst/node/api';

type User = {
  data: {
    profile: {
      organisation: string;
    };
  };
};

export async function getUser(authToken: string) {
  return ky
    .get(`${ApiGatewayV1Api['identity'].url}/user`, {
      headers: {
        Authorization: authToken,
      },
    })
    .json<User>();
}
