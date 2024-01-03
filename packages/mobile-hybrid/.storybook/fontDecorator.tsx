import { museoFont, sourceSansPro } from "@/font";
import { Decorator } from "@storybook/react";

const fontDecorator: Decorator = (Story) => {
  return (
    <main className={`${museoFont.variable} ${sourceSansPro.variable} h-screen dark:bg-neutral-black`}>
      <Story />
    </main>
  );
};

export default fontDecorator;