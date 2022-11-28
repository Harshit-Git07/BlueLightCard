import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputSelectField from "@/components/InputSelectField/InputSelectField";

const componentMeta: ComponentMeta<typeof InputSelectField> = {};

const InputSelectFieldTemplate: ComponentStory<typeof InputSelectField> = (args) => (
    <InputSelectField {...args} />
);

export const InputSelectFieldStory = InputSelectFieldTemplate.bind({});

InputSelectFieldStory.args = {};

export default componentMeta;
