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
  extends: ['eslint:recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react', 'jest'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 2,
    'object-curly-spacing': ['error', 'never'],
    semi: ['error', 'always'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2
  }
};
