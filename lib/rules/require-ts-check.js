// @ts-check

const path = require('path');
const micromatch = require('micromatch');

/** @typedef { import('eslint').Rule.RuleContext } RuleContext */

const ERROR_MSG_TS_CHECK_MISSING = 'Type checking should be enabled by adding @ts-check to the top of the file';

/**
 * @param { RuleContext } context
 * @param { import('estree').Node } node
 */
function reportError(context, node) {
  context.report({
    node,
    message: ERROR_MSG_TS_CHECK_MISSING,
  });
}

/**
 * @typedef {object} RuleOptions
 * @property {string[]} [include] Glob matching pattern.
 * @property {string[]} [exclude] Glob matching pattern. Takes precedence over the `include` option.
 */

/** @param { RuleContext } context */
function create(context) {
  return {
    /** @param { import('eslint').AST.Program } root */
    Program(root) {
      if (context.options.length > 1) throw new Error('Rule options must be defined in a single object');
      /** @type {RuleOptions} */
      const options = context.options[0] ?? {};
      const includePatterns = options.include || ['**/*.js'];
      const excludePatterns = options.exclude || ['node_modules'];

      const filePath = path.join(context.getCwd(), context.getFilename());
      const isIncluded = micromatch([filePath], includePatterns, { contains: true }).length > 0;
      const isExcluded = micromatch([filePath], excludePatterns, { contains: true }).length > 0;

      if (isExcluded) return;
      if (!isIncluded) return;

      // Get the position of the first code declaration/statement
      const firstDeclaration = root.body[0];
      const declarationStart = firstDeclaration?.range ? firstDeclaration.range[0] : +Infinity;

      // Filter only the "Line" comments that are above any code declaration.
      const topLineComments = root.comments.filter((comment) => {
        const isLineComment = comment.type === 'Line';
        const commentEnd = comment.range ? comment.range[1] : -Infinity;

        return isLineComment && commentEnd < declarationStart;
      });

      // If there are no line comments above the code, fail
      if (!topLineComments.length) return reportError(context, root);

      // Match comments that contain case insensitive "@ts-check" without any characters before it.
      // Check the tests for examples
      const regex = new RegExp(/^\s*@ts-check.*?$/gi);
      const validComment = topLineComments.some((comment) => regex.test(comment.value));

      if (!validComment) return reportError(context, root);
    },
  };
}

/** @type {import('eslint').Rule.RuleMetaData} */
const meta = {
  schema: [
    {
      type: 'object',
      properties: {
        include: {
          type: 'array',
          items: { type: 'string' },
        },
        exclude: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      additionalProperties: false,
    },
  ],
};

module.exports = {
  ERROR_MSG_TS_CHECK_MISSING,
  create,
  meta,
};
