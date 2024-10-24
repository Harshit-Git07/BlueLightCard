import React, { FC } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from './';
import { Props } from './';
import Button from '../Button';
import Image from 'next/image';
import { faCircle, faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { ThemeVariant } from 'src/types';

const componentMeta: Meta<typeof Accordion> = {
  title: 'Component System/Accordion',
  component: Accordion,
};

const content = (
  <p>
    By passing the content as <i>children</i> we can render <b>anything</b> in the accordions, in
    any layout or style:
  </p>
);

const handleOnButtonClick = () => {
  alert('Accordion button clicked!');
};

const button = (
  <div className="mt-[10px]">
    <Button
      onClick={handleOnButtonClick}
      iconLeft={faCircle}
      iconRight={faCircle}
      variant={ThemeVariant.Tertiary}
    >
      Click here
    </Button>
  </div>
);

const DefaultTemplate: StoryFn<Props> = (args) => (
  <Accordion {...args}>
    {content}
    <Image
      src="https://picsum.photos/400/100"
      alt="Random image from picsum API."
      width={400}
      height={100}
      className="my-4"
    />
    {button}
  </Accordion>
);

const AccordionGroup1: FC = () => {
  return (
    <>
      <Accordion
        title="Accordion #1 : Custom icons for open/close "
        groupId="group1"
        openIcon={faEye}
        closeIcon={faEyeSlash}
      >
        {content}
      </Accordion>
      <Accordion
        title="Accordion #2 : Render any content or components, in any layout"
        groupId="group1"
      >
        {content}
        {button}
      </Accordion>
    </>
  );
};

type AccordionGroup2Props = { groupId: string };
const AccordionGroup2: FC<AccordionGroup2Props> = ({ groupId }) => {
  return (
    <>
      <Accordion
        title="Accordion #3 : Long titles are limited to 2 lines and truncated with ellipses. Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae reiciendis explicabo dolore incidunt fugit nemo ex, assumenda pariatur ducimus sint ipsam blanditiis corrupti beatae eaque. Culpa autem quam iusto magni?"
        groupId={groupId}
      >
        {content}
      </Accordion>
      <Accordion
        title="Accordion #4 : Separate groups can have have 1 accordion open per group"
        groupId={groupId}
      >
        {content}
      </Accordion>
    </>
  );
};

const GroupsTemplate: FC = () => {
  return (
    <>
      <AccordionGroup1 />
      <AccordionGroup2 groupId="group1" />
    </>
  );
};

const MultipleGroupsTemplate: FC = () => {
  return (
    <>
      <section>
        <h2 className="text-colour-primary dark:text-colour-primary-dark">Accordion Group 1</h2>
        <AccordionGroup1 />
      </section>
      <section className="my-[50px]">
        <h2 className="text-colour-primary dark:text-colour-primary-dark">Accordion Group 2</h2>
        <AccordionGroup2 groupId="group2" />
      </section>
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: 'Accordion Title',
};
export const Groups = GroupsTemplate.bind({});
export const MultipleGroups = MultipleGroupsTemplate.bind({});

export default componentMeta;
