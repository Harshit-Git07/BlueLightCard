import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Button from "./Button";

const icons = { faPlus };

library.add(...Object.values(icons));

const componentMeta: ComponentMeta<typeof Button> = {
    title: "Button Component",
    component: Button,
    argTypes: {
        iconLeft: {
            options: Object.keys(icons),
            mapping: icons,
            control: {
                type: "select",
            },
        }
    },
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonStory = Template.bind({});

ButtonStory.args = {
    text: "Button",
};

export default componentMeta;