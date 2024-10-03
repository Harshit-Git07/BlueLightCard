import { CognitoJwtVerifier } from 'aws-jwt-verify/cognito-verifier';
import type { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { env } from 'hono/adapter';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

type IdentityVariables = {
  decodedJwt: CognitoIdTokenPayload;
  userId: string;
  userUuid: string;
  idToken: string;
};

const zEnv = z.object({
  OFFERS_CMS_COGNITO_IDP_ID: z.string(),
  OFFERS_CMS_COGNITO_CLIENT_ID: z.string(),
});

type Variables = {
  identity: IdentityVariables;
};

type Bindings = z.infer<typeof zEnv>;

export const authorizer = createMiddleware<{
  Variables: Variables;
  Bindings: Bindings;
}>(async (c, next) => {
  const e = zEnv.parse(env(c));

  const cognitoVerifier = CognitoJwtVerifier.create({
    userPoolId: e.OFFERS_CMS_COGNITO_IDP_ID,
    clientId: e.OFFERS_CMS_COGNITO_CLIENT_ID,
    tokenUse: 'id',
  });

  const bearer = c.req.header('Authorization');

  if (!bearer) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const token = splitBearer(bearer);

  if (!token) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  try {
    const decoded = await cognitoVerifier.verify(token, {
      tokenUse: 'id',
      clientId: e.OFFERS_CMS_COGNITO_CLIENT_ID,
    });

    const id = z.string().parse(decoded['custom:blc_old_id']);
    const uuid = z.string().parse(decoded['custom:blc_old_uuid']);

    c.set('identity', {
      decodedJwt: decoded,
      userId: id,
      userUuid: uuid,
      idToken: token,
    });
  } catch (error) {
    throw new HTTPException(401, { cause: error, message: 'Unauthorized' });
  }

  await next();
});

export const splitBearer = (token: string) => {
  if (!token.startsWith('Bearer ')) {
    return null;
  }

  return token.split('Bearer ')[1];
};
