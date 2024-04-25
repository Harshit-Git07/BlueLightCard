import { setDefaultHighWaterMark } from "stream";
import { wait } from "./wait";

export type WaitOnOptions = {
  maxAttempts?: number;
  retryInterval?: number;
};

export type TestFn<T> = () => Promise<T>;

export function waitOn<T>(test: TestFn<T>): Promise<T>;
export function waitOn<T>(options: WaitOnOptions, test: TestFn<T>): Promise<T>;
export async function waitOn<T>(optionsOrTest: WaitOnOptions | TestFn<T>, test?: TestFn<T>): Promise<T> {  
  const {
    maxAttempts = 10,
    retryInterval = 1000,
    testFn,
  } = toOptions(optionsOrTest, test);

  let retries = 0;
  while (retries < maxAttempts) {
    try {
      return await testFn();
    } catch (error) {
      retries++;
      if (retries === maxAttempts) {
        throw error;
      }
      await wait(retryInterval);
    }
  }
  
  throw new Error('maxAttempts must be greater than 0');
}

function toOptions<T>(optionsOrTest: WaitOnOptions | TestFn<T>, test?: TestFn<T>): WaitOnOptions & { testFn: TestFn<T> } {
  if (typeof optionsOrTest === 'function') {
    return { testFn: optionsOrTest };
  }

  if (!test) {
    throw new Error('Invalid arguments: test argument is required when options is provided');
  }

  return {
    ...optionsOrTest,
    testFn: test,
  };
}
