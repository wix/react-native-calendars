module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  globals: {
    expect: true,
    it: true,
    describe: true
  },
  root: true,
  extends: ['@react-native', 'plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react', 'react-native', 'jest', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['warn'],
    'comma-dangle': ['error', 'never'],
    'curly': 'off',
    'eol-last': 'error',
    'no-unused-expressions': 'off',
    'max-len': ['warn', {code: 120, ignoreComments: true, ignoreStrings: true}],
    'new-cap': 'off',
    'no-mixed-operators': ['off'],
    'no-trailing-spaces': 'off',
    'no-undef': 'off',
    'operator-linebreak': 'off',
    'semi': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'never',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ],
    'react/jsx-no-bind': [
      'off',
      {
        ignoreRefs: true,
        allowArrowFunctions: false,
        allowBind: false
      }
    ],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react-native/no-inline-styles': 1
  }
};
