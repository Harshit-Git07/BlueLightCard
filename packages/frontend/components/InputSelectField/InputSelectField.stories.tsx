import { faEnvelope } from "@fortawesome/pro-solid-svg-icons/faEnvelope";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputSelectField from "@/components/InputSelectField/InputSelectField";

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
            faLock: "Password Icon",
        },
    },
};

const componentMeta: ComponentMeta<typeof InputSelectField> = {
    title: "Component System/Form/InputSelectField",
    component: InputSelectField,
    argTypes: {
        icon: { name: "Icon", ...iconArgSelect },
        options: {
            name: "Select Options",
            description: "Add/Edit options to display in the select dropdown",
            control: {
                type: "object",
            },
        },
        value: {
            name: "Successful State",
            control: {
                type: "boolean",
            },
        },
        error: { name: "Error State" },
        defaultOption: { name: "Default Option" },
        onChange: {
            table: {
                disable: true,
            },
        },
    },
};

const InputSelectFieldTemplate: ComponentStory<typeof InputSelectField> = (args) => (
    <InputSelectField {...args} />
);

export const InputSelectFieldStory = InputSelectFieldTemplate.bind({});

InputSelectFieldStory.args = {
    options: {
        value0: "Option One",
        value1: "Option Two",
    },
    defaultOption: "Default Option",
    error: false,
    value: "",
};

export default componentMeta;
