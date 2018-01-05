import React, {Component} from 'react';

import {CalendarList} from 'react-native-calendars';

export default class CalendarSubTitle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CalendarList 
        markingType={'period'} 
        current={'2012-05-16'} 
        pastScrollRange={24} 
        futureScrollRange={24} 
        theme={{subTitleTextColor: 'orange',}}
        subTitleForDate={(date)=>{
          if(date.month === 5) {
            return `$1.${date.day}`;
          }
          return null;
        }}/>
    );
  }
}
