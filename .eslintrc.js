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
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
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
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 1,
    'object-curly-spacing': ['error', 'never'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react-native/no-inline-styles': 1,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': 1
  }
};
