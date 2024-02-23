/**
 * Base class for all repositories with common methods.
 */
export class Repository {
  /**
   * Checks if the given results array contains at most one element and returns it.
   * If the array is empty, returns null.
   * Throws an error if the array contains more than one element.
   */
  public atMostOne<T>(results: T[]): T | null {
    if (results.length === 0) {
      return null;
    }

    if (results.length > 1) {
      throw new Error('Received multiple results but expected at most one');
    }

    return results[0];
  }
}
