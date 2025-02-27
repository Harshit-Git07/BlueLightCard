export const jsonOrNull = <T>(input: string) => {
  try {
    return JSON.parse(input) as T;
  } catch (e) {
    return null;
  }
};
