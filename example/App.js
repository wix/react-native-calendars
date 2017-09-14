import React, { Component } from 'react';
import AppNavigator from './src/AppNavigator';

// eslint-disable-next-line no-console
console.ignoredYellowBox = ['Remote debugger'];

export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}
