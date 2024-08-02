/** @type {import('eslint').Linter.Config} */
module.exports = {
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  ignorePatterns: ['.eslintrc.cjs', '*.config.*'],
  rules: {
    'import/extensions': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'arrow-parens': ['error', 'always']
  }
};
