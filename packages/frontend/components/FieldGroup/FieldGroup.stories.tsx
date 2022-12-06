import { faEnvelope } from "@fortawesome/pro-solid-svg-icons";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputTextField from "../InputTextField/InputTextField";
import FieldGroup from "./FieldGroup";

const componentMeta: ComponentMeta<typeof FieldGroup> = {
    title: "Component System/Form/FieldGroup",
    component: FieldGroup,
    argTypes: {
        labelText: {
            name: "Label Text",
        },
        invalid: {
            name: "Invalid State",
            description: "Toggle invalid state of component",
        },
        message: {
            name: "Message Text",
            description: "Small message text",
        },
    },
};

const FieldGroupTemplate: ComponentStory<typeof FieldGroup> = (args) => (
    <FieldGroup {...args}>
        <InputTextField error={args.invalid} placeholder="Placeholder text" icon={faEnvelope} />
    </FieldGroup>
);

export const FieldGroupStory = FieldGroupTemplate.bind({});

FieldGroupStory.args = {
    labelText: "Field Group",
    invalid: false,
    message: "Message",
};

export default componentMeta;
