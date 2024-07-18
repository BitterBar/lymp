module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'no-debugger': 'error',
    'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'none' }
    ],

    'no-restricted-syntax': [
      'error',
      'AwaitExpression'
    ]
  },
  overrides: [
    // Node scripts
    {
      files: [
        'scripts/**',
        '*.{js,ts}',
        'packages/**/index.js',
      ],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off'
      }
    }
  ]
}
