import jwt_decode from "jwt-decode";

export type JWT = {
  sub: string;
  exp: number;
  iss: string;
  iat: number;
  email: string;
  'custom:blc_old_uuid': string;
  'custom:blc_old_id': string;
  phone_number?: string;
  memberUuid?: string;
  legacyUserId?: string;
}

export type Auth0Jwt = {
  sub: string;
  exp: number;
  iss: string;
  iat: number;
  email: string;
  memberUuid: string;
  legacyUserId?: string;
}

export function unpackJWT(jwt: string): JWT {
  try {
    const decodedToken = jwt_decode(jwt)

    if (isAuth0Jwt(decodedToken)) {
      return {
        ...decodedToken,
        'custom:blc_old_uuid': decodedToken.memberUuid,
        'custom:blc_old_id': decodedToken.legacyUserId,
      } as JWT
    }
    return decodedToken as JWT;
  } catch (error) {
    console.error('Error decoding token', error)
    throw error;
  }
}

function isAuth0Jwt(decoded: any): decoded is Auth0Jwt {
  return typeof decoded['memberUuid'] === 'string';
}
