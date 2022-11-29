import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/pro-solid-svg-icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputTextField from "./InputTextField";

const icons = { faEnvelope };

library.add(...Object.values(icons));

const iconArgSelect = {
    options: ["none"].concat(...Object.keys(icons)),
    mapping: { none: undefined, ...icons },
    control: {
        type: "select",
        labels: {
            none: "No Icon",
            faEnvelope: "Envelope Icon",
        },
    },
};

const componentMeta: ComponentMeta<typeof InputTextField> = {
    title: "Component System/Form/InputTextField",
    component: InputTextField,
    argTypes: {
        icon: iconArgSelect,
        type: {
            options: ["text", "password"],
            control: {
                type: "select",
            },
        },
        value: {
            control: {
                type: "boolean",
            },
        },
    },
};

const InputTextFieldTemplate: ComponentStory<typeof InputTextField> = (args) => (
    <InputTextField {...args} />
);

export const InputTextFieldStory = InputTextFieldTemplate.bind({});

InputTextFieldStory.args = {
    placeholder: "Input text field",
    error: false,
    value: "",
};

export default componentMeta;
