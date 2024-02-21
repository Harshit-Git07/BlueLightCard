/**
 * Used to ensure exhaustive checks in switch statements and other conditional logic.
 *
 * This function is assumed to never execute, and will throw an error if it does.
 *
 * @example
 * ```ts
 * type MyType = "A" | "B" | "C";
 *
 * function doSomething(value: MyType) {
 *  switch (value) {
 *   case "A":
 *    return "A";
 *   case "B":
 *    return "B";
 *   case "C":
 *    return "C";
 *   default:
 *    // This will give a type error at build time if not all cases are handled
 *    // and will throw an error at runtime if it is ever executed.
 *    exhaustiveCheck(value);
 *  }
 * }
 * ```
 */
export function exhaustiveCheck(_value: never, message?: string): never {
  throw new Error(`${message ?? "Exhaustive check failed"}: ${_value}`);
}
