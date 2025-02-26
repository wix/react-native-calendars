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
  extends: '@react-native',
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
    semi: ['error', 'always'],
    'no-unused-expressions': 'off',
    'no-undef': 'off',
    'arrow-parens': 'off',
    'comma-dangle': ['error', 'never'],
    'no-mixed-operators': ['off'],
    'no-trailing-spaces': 'off',
    'operator-linebreak': 'off',
    'max-len': ['warn', {code: 120, ignoreComments: true, ignoreStrings: true}],
    'new-cap': 'off',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    "@typescript-eslint/non-nullable-type-assertion-style": "error",
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react-native/no-inline-styles': 1,
    'react/jsx-no-bind': [
      'off',
      {
        ignoreRefs: true,
        allowArrowFunctions: false,
        allowBind: false
      }
    ]
  }
};
