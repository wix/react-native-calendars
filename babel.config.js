module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          'react-native-calendars': './src/index.ts',
          commons: './src/commons',
          services: './src/services',
          utils: './src/utils',
          hooks: './src/hooks.ts',
          style: './src/style.ts'
        }
      }
    ]
  ]
};
