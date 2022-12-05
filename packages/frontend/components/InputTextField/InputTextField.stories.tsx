import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/pro-solid-svg-icons/faEnvelope";
import { faLock } from "@fortawesome/pro-solid-svg-icons/faLock";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import InputTextField from "./InputTextField";

const icons = { faEnvelope, faLock };

library.add(...Object.values(icons));

const iconArgSelect = {
    options: ["none"].concat(...Object.keys(icons)),
    mapping: { none: undefined, ...icons },
    control: {
        type: "select",
        labels: {
            none: "No Icon",
            faEnvelope: "Envelope Icon",
            faLock: "Password Icon",
        },
    },
};

const componentMeta: ComponentMeta<typeof InputTextField> = {
    title: "Component System/Form/InputTextField",
    component: InputTextField,
    argTypes: {
        icon: { name: "Field Icon", ...iconArgSelect },
        type: {
            name: "Field Type",
            options: ["text", "password"],
            control: {
                type: "select",
            },
        },
        placeholder: { name: "Placeholder" },
        error: { name: "Error State" },
        value: {
            name: "Successful State",
            control: {
                type: "boolean",
            },
        },
        passwordVisible: {
            table: {
                disable: true,
            },
        },
        onTogglePasswordVisible: {
            table: {
                disable: true,
            },
        },
    },
};

const InputTextFieldTemplate: ComponentStory<typeof InputTextField> = (args) => {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    return (
        <InputTextField
            {...args}
            passwordVisible={passwordVisible}
            onTogglePasswordVisible={(visible) => setPasswordVisible(visible)}
        />
    );
};

export const InputTextFieldStory = InputTextFieldTemplate.bind({});

InputTextFieldStory.args = {
    placeholder: "Input text field",
    error: false,
    value: "",
};

export default componentMeta;
