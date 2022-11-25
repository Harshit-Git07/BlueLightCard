import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus } from "@fortawesome/pro-regular-svg-icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Button from "./Button";

const icons = { faPlus, faMinus };

library.add(...Object.values(icons));

const iconArgSelect = {
    options: ["none"].concat(...Object.keys(icons)),
    mapping: { none: undefined, ...icons },
    control: {
        type: "select",
        labels: {
            none: "No Icon",
            faPlus: "Plus Icon",
            faMinus: "Minus Icon",
        },
    },
};

const componentMeta: ComponentMeta<typeof Button> = {
    title: "Component System/Button Component",
    component: Button,
    argTypes: {
        iconLeft: iconArgSelect,
        iconRight: iconArgSelect,
    },
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonStory = Template.bind({});

ButtonStory.args = {
    text: "Button",
};

export default componentMeta;