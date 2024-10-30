import { JwksClient } from 'jwks-rsa';

export function getJwksPublicKey(kid: string, issuer: string): Promise<string> {
  return jwksClient(issuer).getSigningKey(kid)
    .then(key => key.getPublicKey());
}

const TEN_MINUTES_IN_MILLISECONDS = 10 * 60 * 1000;

const jwksClient = (issuer: string) : JwksClient => new JwksClient({
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: TEN_MINUTES_IN_MILLISECONDS,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: `${issuer}.well-known/jwks.json`,
});