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
      "no-unused-vars": 2,
      "react/jsx-uses-vars": 2,
      "react/jsx-uses-react": 2,
      "indent": [
          "error",
          2
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ]
  }
};
