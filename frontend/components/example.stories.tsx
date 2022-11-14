import { ComponentMeta, ComponentStory } from "@storybook/react";
import ExampleComponent from "./example";

export default {
    title: "Example Component",
    component: ExampleComponent,
} as ComponentMeta<typeof ExampleComponent>;

const Template: ComponentStory<typeof ExampleComponent> = (args) => <ExampleComponent {...args} />;

export const ExampleComponentStory = Template.bind({});

ExampleComponentStory.args = {
    text: "Hello World"
};