import React, {useState} from 'react';
import {CalendarList} from 'react-native-calendars';

const testIDs = require('../testIDs');
const initialDate = '2020-05-16';

const HorizontalCalendarList = () => {
  const [selected, setSelected] = useState(initialDate);
  const markedDates = {
    [selected]: {
      selected: true,
      selectedColor: '#DFA460'
    }
  };

  const onDayPress = day => {
    setSelected(day.dateString);
  };

  return (
    <CalendarList
      testID={testIDs.horizontalList.CONTAINER}
      markedDates={markedDates}
      current={initialDate}
      pastScrollRange={24}
      futureScrollRange={24}
      horizontal
      pagingEnabled
      onDayPress={onDayPress}
    />
  );
};

export default HorizontalCalendarList;
