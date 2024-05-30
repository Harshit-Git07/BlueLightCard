export function validateBearerToken(bearerToken: string): boolean {
  return bearerToken.toLowerCase().startsWith('bearer ')
}
