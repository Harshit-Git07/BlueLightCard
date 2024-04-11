import { Decorator } from "@storybook/react";
import mockResolvers from "./mockResolvers";

const pageDecorator: Decorator = (Story) => {
  (window as any).webkit = {
    messageHandlers: Object.keys(mockResolvers).reduce((acc, _interface) => {
      acc[_interface] = {
        postMessage(json: any) {
          mockResolvers[_interface](window, json);
        },
      };
      return acc;
    }, {} as any)
  };
  return <Story />;
};

export default pageDecorator;