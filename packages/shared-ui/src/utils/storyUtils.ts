/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient } from '@tanstack/react-query';

/**
 * Used to disable the props (i.e hidden) from the story
 * @param props
 * @returns
 */
export const disableProps = (props: string[]) => {
  return props.reduce(
    (acc, prop) => {
      acc[prop] = {
        table: {
          disable: true,
        },
      };
      return acc;
    },
    {} as Record<string, any>,
  );
};

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
