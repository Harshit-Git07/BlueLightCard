import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Form } from "react-bootstrap";
import FieldGroup from "./FieldGroup";

const componentMeta: ComponentMeta<typeof FieldGroup> = {
    title: "Component System/Form/FieldGroup",
    component: FieldGroup,
};

const FieldGroupTemplate: ComponentStory<typeof FieldGroup> = (args) => (
    <FieldGroup {...args}>
        <Form.Control type="text" />
    </FieldGroup>
);

export const FieldGroupStory = FieldGroupTemplate.bind({});

FieldGroupStory.args = {
    labelText: "Field Group",
};

export default componentMeta;