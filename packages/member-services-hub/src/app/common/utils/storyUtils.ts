/**
 * Used to disable the props (i.e hidden) from the story
 * @param props
 * @returns
 */
export const disableProps = (props: string[]) => {
  return props.reduce((acc, prop) => {
    acc[prop] = {
      table: {
        disable: true,
      },
    };
    return acc;
  }, {} as Record<string, any>);
};
