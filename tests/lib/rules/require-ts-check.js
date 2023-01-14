// @ts-check
const rule = require('../../../lib/rules/require-ts-check');
const RuleTester = require('eslint').RuleTester;

// @ts-ignore - For some reason, eslint types exclude `setDefaultConfig` from RuleTester
RuleTester.setDefaultConfig({
  parserOptions: { ecmaVersion: 6 },
});

const ruleTester = new RuleTester();

/**
 * Simple test cases
 */
const simpleTests = {
  valid: ['// @ts-check', '//@ts-check', '// @TS-checK', '// @ts-check with some comments'],
  invalid: ['/** @ts-check */', '/*@ts-check*/', '// some comments @ts-check', '// ts-check', '// @tscheck'],
};

// @ts-ignore - TS doesn't like the type of `rule` here
ruleTester.run('require-ts-check', rule, {
  /**
   * Valid tests
   */
  valid: [
    ...simpleTests.valid.map((tc) => ({ code: tc, filename: 'test.js' })),
    {
      // should be valid if comment is before any code declaration
      code: `
      // @ts-check

      const foo = require('bar');
      `,
      filename: 'test.js',
    },
    {
      // should be valid even if amongst other comments and before any code declaration
      code: `
      // Some other comment
      /** Another one */
      // @ts-check
      // Final one

      function foo() {
        return 'bar';
      };
      `,
      filename: 'test.js',
    },
    {
      // should ignore other comments below any code declaration
      code: `
      // @ts-check

      let foo;
      // @ts-check - This is ignored
      `,
      filename: 'test.js',
    },
    {
      // should ignore by default non .js extensions
      code: 'ignored',
      filename: 'anotherFile.ts',
    },
    {
      // should ignore by default the node_modules folder
      code: 'ignored',
      filename: 'node_modules/moduleFile.js',
    },
    {
      // should ignore specified files
      options: [{ exclude: ['**/*.js'] }],
      code: 'ignored',
      filename: 'ignoredFile.js',
    },
  ],

  /**
   * Invalid tests
   */
  invalid: [
    ...simpleTests.invalid.map((tc) => ({
      code: tc,
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'test.js',
    })),
    {
      // should error when file is empty
      code: '',
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'test.js',
    },
    {
      // should error when comment is below code declaration
      code: `
      const a = require('b');
      // @ts-check
      `,
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'test.js',
    },
    {
      // should error when using JSDoc comments
      code: `
      /** @ts-check */
      function foo() {
        return 'bar';
      };
      // @ts-check
      `,
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'test.js',
    },
    {
      // should error when below an "Expression Statement"
      code: `
      'use strict';
      // @ts-check

      let foo;
      // @ts-check - This is ignored
      `,
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'test.js',
    },
    {
      // should be able to include other file extensions
      options: [{ include: ['**/*.ts'] }],
      code: 'ignored',
      errors: [{ message: rule.ERROR_MSG_TS_CHECK_MISSING }],
      filename: 'differentExtension.ts',
    },
  ],
});
