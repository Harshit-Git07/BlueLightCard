declare module '*.md?raw' {
  const value: string;
  export default value;
}

/**
 * A utility type to prevent the inference of a type parameter
 *
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta/#the-noinfer-utility-type
 * @todo Remove this when we upgrade to a version which supports this utility type natively
 *
 * @example
 * ```ts
 * function example<T>(inferFromThis: T, butNotThis: NoInfer<T>) {}
 * ```
 */
declare type NoInfer<T> = [T][T extends any ? 0 : never];
