import React, {Component} from 'react';
import {CalendarList} from 'react-native-calendars';

const testIDs = require('../testIDs');

export default class HorizontalCalendarList extends Component {
  
  render() {
    return (
      <CalendarList
        testID={testIDs.horizontalList.CONTAINER}
        current={'2012-05-16'}
        pastScrollRange={24}
        futureScrollRange={24}
        horizontal
        pagingEnabled
        style={{borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}
      />
    );
  }
}
