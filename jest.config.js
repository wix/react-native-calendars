module.exports = {
  roots: ['./src'],
  preset: 'react-native',
  testMatch: ['<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts}'],
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native|react-native-swipe-gestures)/)'],
  testPathIgnorePatterns: ['/e2e/'],
  setupFiles: ['jest-date-mock']
};
