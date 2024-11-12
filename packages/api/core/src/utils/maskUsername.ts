export function maskUsername(username: string) {
  const usernameLength = username.length;

  if (usernameLength < 3) {
    return '*'.repeat(usernameLength);
  }

  const atIndex = username.indexOf('@');
  if (atIndex > 1) {
    return `${username[0]}${'*'.repeat(atIndex - 2)}${username.slice(atIndex - 1)}`;
  }

  return `${username[0]}${'*'.repeat(usernameLength - 2)}${username[usernameLength - 1]}`;
}
