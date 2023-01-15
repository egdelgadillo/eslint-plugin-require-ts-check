# eslint-plugin-require-ts-check

Require @ts-check to be added in your javascript files

## Table of contents

- [Table of contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Supported options](#supported-options)
- [Contributing](#contributing)

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-require-ts-check`:

```sh
npm install eslint-plugin-require-ts-check --save-dev
```

## Usage

Add `eslint-plugin-require-ts-check` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["require-ts-check"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "require-ts-check/require-ts-check": "error"
  }
}
```

## Supported options

This rule supports a combination of any of the following options:

### include

Specify the files that should be tested using this rule. This parameter uses the [Glob filename matching pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>).

Defaults to all javascript files: `[ "**/*.js" ]`

#### `include` Usage

```json
"rules": {
    "require-ts-check/require-ts-check": ["error", { "include": ["**/my-files/*.*"] }]
  }
```

### exclude

Specify the files that this rule should ignore. This parameter uses the [Glob filename matching pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>).

Defaults to the `node_modules` folder: `[ "node_modules" ]`

#### `exclude` Usage

```json
"rules": {
    "require-ts-check/require-ts-check": ["error", { "exclude": ["**/ignored-files/*.*"] }]
  }
```

## Contributing

1. Install VSCode recommended extensions. This is needed for formatting.

   In Mac: <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>:

   Others: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>:

   Find the "Extensions: Show recommended extensions" option and install them.

   Always remember to format the code when saving if your editor does not do it automatically.

2. Fork the repo
3. Create a new branch based off of `main`
4. Add your changes
5. Create a new changelog entry by running `npm run changelog` and fill in the data

   This will create an `.md` file with a random name in the `.changeset` folder. This file should contain the changes that were added as part of your contribution. It will later be _automatically_ added to the main `CHANGELOG.md` file when a new release is created.

6. Run tests: `npm test`
7. Check the code formatting: `npm prettier`
8. Run the linter: `npm lint`
9. Push your changes and create a PR in the original repository for your new branch pointing to `main`.
