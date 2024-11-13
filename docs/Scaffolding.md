# Scaffolding

We have a set of templates that make it easier for developers to create and setup new files that consistently follow our best practices.

The tool we use to do this is [hygen](https://www.hygen.io/) and it's templating engine is powered by [ejs](https://ejs.co/), more info on how templates are structured can be found [here](https://www.hygen.io/docs/templates).

## Commands

List of commands available for using the available templates. To see options on how to use the below commands, run `npx hygen [command] help`.

### Components

To create a new component:

```sh
$ npx hygen component new

flags:
   --out: The path to ouput the new files, this should include the name of the new component folder
   --name: The name of the new component, make sure this is in camel case
```

Example of creating a new TextField component in the shared-ui package:

```sh
$ npx hygen component new --out packages/shared-ui/src/components/TextField --name TextField
```

### Storybook config

To create a new storybook config:

```sh
$ npx hygen storybook new

flags:
   --out: The path to output the new storybook config
```

Example of creating a new storybook config in a new package:

```sh
$ npx hygen storybook new --out packages/[new package]
```

The following files will be generated:

- `packages/[new package]/.storybook/main.ts`
- `packages/[new package]/.storybook/preview.ts`

## Contribution

To add templates, simply use the hygen [generator](https://www.hygen.io/docs/generators) command:

```sh
$ npx hygen generator new [template name]
```

All template files should use the extension `.ejs.t`.

Copy across the help action template files from `_templates/generator/help` to this new template `_templates/[template name]/help`, this allows developers to get help on how to use this new template command.

### Usage

```sh
$ npx hygen [template name] new [--options]
```

Add a section below the heading: [Commands](#commands), to document this new templated command.
