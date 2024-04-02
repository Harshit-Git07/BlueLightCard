/**
 * Register a dispose function to be called at the end of the current scope. Note that the
 * [explicit resource management proposal](https://github.com/tc39/proposal-explicit-resource-management)
 * is currently in stage 3 and is not yet supported in Browsers or Node.js. Therefore, this function
 * can only be used in conjuction with build tools which will perform syntax lowering to a compatible
 * form.
 *
 * @param dispose - The dispose function to call
 * @returns An object with the dispose function registered
 * @example
 * ```ts
 * {
 *   await using _ = useAsyncDispose(async () => {
 *     console.log('cleanup');
 *   });
 *
 *   // --snip--
 *
 * } // 'cleanup' will be logged here
 * ```
 * @see https://github.com/tc39/proposal-explicit-resource-management
 */
export function useAsyncDispose(dispose: () => Promise<void>) {
  return {
    [Symbol.asyncDispose]: dispose,
  };
}
