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
  settings: {
    react: {
      version: 'detect' // Automatically detect the react version
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', 'react-native', 'jest', '@typescript-eslint'],
  rules: {
    'react-native/no-inline-styles': 1,
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 1,
    'object-curly-spacing': ['error', 'never'],
    semi: ['error', 'always'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': 1
  }
};
