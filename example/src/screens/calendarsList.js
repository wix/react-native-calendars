import React, {Component} from 'react';
import {CalendarList} from 'react-native-calendars';

const testIDs = require('../testIDs');

export default class CalendarsList extends Component {
  
  render() {
    return (
      <CalendarList
        testID={testIDs.calendarList.CONTAINER}
        current={'2012-05-16'}
        pastScrollRange={24}
        futureScrollRange={24}
      />
    );
  }
}
