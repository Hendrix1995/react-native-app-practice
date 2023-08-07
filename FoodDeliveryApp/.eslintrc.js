module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'prettier/prettier': 'off',
    ['jsx-quotes']: 'off',
    'no-shadow': 'off',
    'react-native/no-inline-styles': 'off',
    curly: 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'eslint-comments/no-unlimited-disable': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              // react
              ['^react$', '^react-native$'],
              // Other packages
              ['^@?\\w'],
              // Internal packages.
              ['^(ui|utils|hooks)(/.*|$)', '^(@)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Anything not matched in another group.
              ['^'],
              // Anything that starts with a dot.
              ['^\\.'],
              // Style imports.
              ['^.+\\.s?css$'],
            ],
          },
        ],
      },
    },
  ],
};
