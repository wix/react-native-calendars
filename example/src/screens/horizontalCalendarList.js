import React, {Component} from 'react';

import {CalendarList} from 'react-native-calendars';

export default class HorizontalCalendarList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CalendarList
        current={'2012-05-16'}
        pastScrollRange={24}
        futureScrollRange={24}
        horizontal
        pagingEnabled
      />
    );
  }
}
