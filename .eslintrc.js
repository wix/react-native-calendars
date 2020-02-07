module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "globals": {
    "expect": true,
    "it": true,
    "describe": true,
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "comma-dangle": ['error', 'never'],
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "no-unused-vars": 2,
      "object-curly-spacing": ["error", "never"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      'react/jsx-space-before-closing': ["error", "never"],
      "react/jsx-uses-react": 2,
      "react/jsx-uses-vars": 2
  }
};
