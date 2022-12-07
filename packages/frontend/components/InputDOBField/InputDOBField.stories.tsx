import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputDOBField from "@/components/InputDOBField/InputDOBField";

const componentMeta: ComponentMeta<typeof InputDOBField> = {};

const InputDOBFieldTemplate: ComponentStory<typeof InputDOBField> = (args) => (
    <InputDOBField {...args} />
);

export const InputDOBFieldStory = InputDOBFieldTemplate.bind({});

InputDOBFieldStory.args = {};

export default componentMeta;
