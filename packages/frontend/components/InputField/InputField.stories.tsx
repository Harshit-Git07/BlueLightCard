import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputTextField from "../InputTextField/InputTextField";
import InputField from "./InputField";

const componentMeta: ComponentMeta<typeof InputField> = {
    title: "Input Field Component",
    component: InputField,
};

const InputFieldTemplate: ComponentStory<typeof InputField> = (args) => (
    <InputField {...args}>
        <InputTextField type="text" />
    </InputField>
);

export const InputFieldStory = InputFieldTemplate.bind({});

InputFieldStory.args = {
    labelText: "Input Group",
};

export default componentMeta;