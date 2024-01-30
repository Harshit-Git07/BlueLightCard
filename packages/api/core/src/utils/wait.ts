/**
 * Returns a promise which resolves after the given duration.
 * 
 * @param durationMs The duration in milliseconds to wait.
 * @returns 
 */
export async function wait(durationMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
