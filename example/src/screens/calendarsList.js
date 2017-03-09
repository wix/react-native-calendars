import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {CalendarList} from 'wix-react-native-calendar';

export default class CalendarsList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CalendarList current={'2012-05-16'}/>
    );
  }
}