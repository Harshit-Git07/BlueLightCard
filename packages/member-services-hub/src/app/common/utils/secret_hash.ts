import crypto from 'crypto';

export function secretHash(username: string, client_id: string, client_secret: string) {
  const key = client_secret;
  const message = username + client_id;

  const hmac = crypto.createHmac('sha256', key).update(message).digest('base64');
  return hmac;
}
