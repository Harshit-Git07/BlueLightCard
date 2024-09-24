---
to: <%= out %>/<%= name %>.mdx
---
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as <%= name %> from './<%= name %>.stories';

<Meta of={<%= name %>} />

# <%= name %>

- [Status](#status)
- [Overview](#overview)
- [Props](#props)
- [State](#state)
- [Variants and States](#variants-and-states)
- [Implementation](#implementation)
- [Usage Guidelines](#usage-guidelines)
- [Design](#design)

## Status
Use the `<ComponentStatus />` component

## Overview

Overview description of the component

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template#Overview

## Props

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template

<Controls />

## State

## Variants and States

List of variants can be shown below here.

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template#Variants-and-States

<Canvas of={<%= name %>.Default} />

## Implementation
Usage example using jsx

```jsx
const <%= name %>: FC = () => {
  return <></>;
};
```

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template#Implementation

## Usage Guidelines

➡️ Usage guideline one

➡️ Usage guideline two

➡️ Usage guideline three

➡️ Usage guideline ...

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template#Usage-and-best-practices

## Design
Use the `<FigmaEmbed />` component.

Template Ref: https://bluelightcard.atlassian.net/wiki/spaces/PE/pages/2901344266/Storybook+documentation+template#Designs
