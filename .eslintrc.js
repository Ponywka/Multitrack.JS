module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['airbnb-base'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
  rules: {
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-inner-declarations': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
    }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
  },
};
