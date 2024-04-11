import { useMemo } from 'react';

export const useCSSConditional = (classes: Record<string, boolean>) => {
  return useMemo(() => {
    const joinedClasses = [];

    for (const className in classes) {
      if (classes[className]) {
        joinedClasses.push(className);
      }
    }

    return joinedClasses.join(' ');
  }, [classes]);
};

export const useCSSMerge = (...css: string[]) => {
  return useMemo(() => css.join(' '), [...css]);
};
