import { setDefaultHighWaterMark } from "stream";
import { wait } from "./wait";

export type WaitOnOptions = {
  maxRetries?: number;
  retryInterval?: number;
};

export type TestFn<T> = () => Promise<T>;

export function waitOn<T>(test: TestFn<T>): Promise<T>;
export function waitOn<T>(options: WaitOnOptions, test: TestFn<T>): Promise<T>;
export async function waitOn<T>(optionsOrTest: WaitOnOptions | TestFn<T>, test?: TestFn<T>): Promise<T> {  
  const {
    maxRetries = 10,
    retryInterval = 1000,
    testFn,
  } = toOptions(optionsOrTest, test);

  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await testFn();
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      await wait(retryInterval);
    }
  }
  
  throw new Error('UNREACHABLE');
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
