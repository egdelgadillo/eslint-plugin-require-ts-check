# `require-ts-check`

## Table of contents

- [Options](#options)
- [Examples](#examples)
- [When Not To Use It](#when-not-to-use-it)

Javascript files don't come with type checking enabled by default. In order to enable type checking to a javascript file
we need to add the following single line comment to the top of the file:

```js
// @ts-check
```

In order for this to enable type checking in the file, it needs to be added as a **single line comment** (`// ...`) (`/** */` JSDoc type
comments don't work) and it needs to be added before any code declaration/statement (`import ...`, `const ...`, etc)

This rule enforces that type checking is enabled on the file. Only `.js` files are evaluated.

## Options

This rule accepts some pattern matching options

### `include`

An array of [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>) strings. This will be the files in which the rule will be active.
Partial glob path matching is enabled.

Defaults to `['**/*.js']`

### `exclude`

An array of [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)>) strings. This will be the files in which the rule will **not** be active
This option takes precedence before the `include` one, meaning that if a file is matched by both patters, it will be ignored.
Partial glob path matching is enabled.

Defaults to `['node_modules']`

## Examples

### ✅ Correct

The following examples are considered as valid:

```js
// @ts-check
const foo = bar();

...

// @ts-check this doesn't matter
const foo = bar();

...

// A comment
/** Another comment */
// @ts-check
// Final comment
function foo() {
  console.log('bar');
};

...

//@ts-check
import foo from 'bar';

...

// @Ts-ChEcK
let foo;

```

### ❌ Incorrect

The following examples are considered as invalid

```js
const foo = bar();
// @ts-check <-- ERROR: Cannot be _below_ any code declaration


...

'use strict';
// @ts-check <- ERROR: Cannot be below expression statements
const foo = bar();

...

// invalid @ts-check <- ERROR: Cannot have any preceding characters
function foo() {
  console.log('bar');
};

...

/** @ts-check */ // <- ERROR: Cannot use JSDoc comments
import foo from 'bar';
```

### Pattern matching options

```js
// Include only .js files from the entities folder
'js-type-checking/require-ts-check': ['error', { include: ['**/entities/*.js'] }],

// Exclude all paths matching 'models'
'js-type-checking/require-ts-check': ['error', { exclude: ['models', 'node_modules'] }],

// `exclude` takes precedence over `include`. All .js files will be included except for index.js
'js-type-checking/require-ts-check': ['error', { include: ['**/*.js'], exclude: ['index.js'] }],
```

For more examples, check the tests.

## When Not To Use It

If you don't like enabling type checking on Javascript files.
