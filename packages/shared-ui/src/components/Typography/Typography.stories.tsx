import { Meta, StoryFn } from '@storybook/react';
import Typography from './';
import { fonts } from '../../tailwind/theme';

const componentMeta: Meta<typeof Typography> = {
  title: 'Component System/Typography',
  component: Typography,
  argTypes: {},
};

const usageExample = `
  import { fonts } from '../../tailwind/theme';
  export const someComponent:FC = () => {
    return <h2 className={fonts.titleSmall}>Heading</h2> 
  }
`;

export const All: StoryFn<typeof Typography> = () => {
  const fontsWithoutDocGenInfo = Object.entries(fonts).filter(([k]) => !k.startsWith('_'));

  return (
    <div>
      <p>Usage</p>
      <pre>
        <code>{usageExample}</code>
      </pre>
      {fontsWithoutDocGenInfo.map(([key, classes]) => (
        <div key={key} className={'mb-6'}>
          <h2 className={classes}>{key}</h2>
          <p className={fonts.bodySmall}>fonts.{key}</p>
          <pre className={`${fonts.bodySmall} text-colour-onSurface-subtle`}>
            <code>{classes}</code>
          </pre>
        </div>
      ))}
    </div>
  );
};

const TypographyTemplate: StoryFn<typeof Typography> = (args) => (
  <Typography {...args}>{args.children}</Typography>
);

export const DisplayLargeText = TypographyTemplate.bind({});

DisplayLargeText.args = {
  variant: 'display-large-text',
  children: <h1>Display Large Text</h1>,
};

export const DisplayMediumText = TypographyTemplate.bind({});

DisplayMediumText.args = {
  variant: 'display-medium-text',
  children: <h2>Display Medium Text</h2>,
};

export const DisplaySmallText = TypographyTemplate.bind({});

DisplaySmallText.args = {
  variant: 'display-small-text',
  children: <h3>Display Small Text</h3>,
};

export const Headline = TypographyTemplate.bind({});

Headline.args = {
  variant: 'headline',
  children: <h4>Headline</h4>,
};

export const HeadlineBold = TypographyTemplate.bind({});

HeadlineBold.args = {
  variant: 'headline-bold',
  children: <h5>Headline Bold</h5>,
};

export const HeadlineSmallBold = TypographyTemplate.bind({});

HeadlineSmallBold.args = {
  variant: 'headline-small-bold',
  children: <h6>Headline Small Bold</h6>,
};

export const TitleLarge = TypographyTemplate.bind({});

TitleLarge.args = {
  variant: 'title-large',
  children: <h1>Title Large</h1>,
};

export const TitleMedium = TypographyTemplate.bind({});

TitleMedium.args = {
  variant: 'title-medium',
  children: <h2>Title Medium</h2>,
};

export const TitleMediumSemiBold = TypographyTemplate.bind({});

TitleMediumSemiBold.args = {
  variant: 'title-medium-semibold',
  children: <h1>Title Medium SemiBold</h1>,
};

export const TitleSmall = TypographyTemplate.bind({});

TitleSmall.args = {
  variant: 'title-small',
  children: <p>Title Small</p>,
};

export const Body = TypographyTemplate.bind({});

Body.args = {
  variant: 'body',
  children: <p>Body</p>,
};

export const BodyLight = TypographyTemplate.bind({});

BodyLight.args = {
  variant: 'body-light',
  children: <p>Body Light</p>,
};

export const BodySemiBold = TypographyTemplate.bind({});

BodySemiBold.args = {
  variant: 'body-semibold',
  children: <p>Body SemiBold</p>,
};

export const BodySmall = TypographyTemplate.bind({});

BodySmall.args = {
  variant: 'body-small',
  children: <p>Body Small</p>,
};

export const BodySmallSemiBold = TypographyTemplate.bind({});

BodySmallSemiBold.args = {
  variant: 'body-small-semibold',
  children: <p>Body Small SemiBold</p>,
};

export const Label = TypographyTemplate.bind({});

Label.args = {
  variant: 'label',
  children: <p>Label</p>,
};

export const LabelSemiBold = TypographyTemplate.bind({});

LabelSemiBold.args = {
  variant: 'label-semibold',
  children: <p>Label SemiBold</p>,
};

export const Button = TypographyTemplate.bind({});

Button.args = {
  variant: 'button',
  children: <p>Button</p>,
};

export default componentMeta;
