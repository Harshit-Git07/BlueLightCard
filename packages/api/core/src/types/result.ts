/**
 * A Result type that can be used to represent a successful or failed operation.
 *
 * @example
 * ```ts
 * const result = Math.random() > 0.5
 *  ? Result.ok(42)
 *  : Result.err('Something went wrong');
 *
 * if (result.isSuccess) {
 *  console.log(result.value);
 * } else {
 *  console.error(result.error);
 * }
 * ```
 */
export const Result = {
  ok: <T>(value: T) => new Ok(value),
  err: <E>(error: E) => new Err(error),
};

/**
 * A Result type that can be used to represent a successful or failed operation.
 *
 * @example
 * ```ts
 * const result = Math.random() > 0.5
 *  ? Result.ok(42)
 *  : Result.err('Something went wrong');
 *
 * if (result.isSuccess) {
 *  console.log(result.value);
 * } else {
 *  console.error(result.error);
 * }
 * ```
 */
export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  public readonly isSuccess: true = true;
  public readonly isFailure: false = false;

  constructor(public readonly value: T) {}
}

export class Err<E> {
  public readonly isSuccess: false = false;
  public readonly isFailure: true = true;

  constructor(public readonly error: E) {}
}
