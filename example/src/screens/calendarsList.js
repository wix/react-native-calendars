import React, {Component} from 'react';
import {CalendarList} from 'react-native-calendars';

export default class CalendarList extends Component {
  render() {
    return (
      <CalendarList onHeaderPress={date => console.log('Header Pressed!', date)} current={'2012-05-16'} pastScrollRange={24} futureScrollRange={24} />
    );
  }
}
