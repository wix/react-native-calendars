/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import {Calendar, CalendarList} from 'wix-react-native-calendar';

export default class CalendarExample extends Component {
  constructor() {
    super();
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    this.setState({
      selected: day
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          selected={[this.state.selected]}
        />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          selected={['2012-05-16']}
          markedDates={{'2012-05-24': [true], '2012-05-25': [true]}}
          hideArrows={true}
          />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          displayLoadingIndicator
          markingType={'interactive'}
          markedDates={{'2012-05-24': [{startingDay: true, color: 'gray'}], '2012-05-25': [{endingDay: true, color: 'gray'}]}}
          hideArrows={true}
          />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 350
  },
  container: {
    flex: 1,
    backgroundColor: 'gray',
    marginTop: 30
  }
});

AppRegistry.registerComponent('CalendarExample', () => CalendarExample);
