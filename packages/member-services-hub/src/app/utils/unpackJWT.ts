import jwt_decode from 'jwt-decode';

type JWT = {
  // sub: string;
  // email_verified: boolean;
  // iss: string;
  // phone_number_verified: boolean;
  // "cognito:username": string;
  // origin_jti: string;
  // aud: string;
  // event_id: string;
  // token_use: string;
  // auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  // jti: string;
  email: string;
};

export function unpackJWT(jwt: string) {
  return jwt_decode(jwt) as JWT;
}
