import React from 'react';
import {CalendarList} from 'react-native-calendars';

const testIDs = require('../testIDs');

const HorizontalCalendarList = () => {
  const [selectedDate, setSelectedDate] = React.useState('2020-05-16');
  const [markedDates, setMarkedDates] = React.useState({});

  const setNewDaySelected = date => {
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: '#DFA460'
    };
    setSelectedDate(date);
    setMarkedDates(markedDate);
  };

  return (
    <CalendarList
      testID={testIDs.horizontalList.CONTAINER}
      markedDates={markedDates}
      current={selectedDate}
      pastScrollRange={24}
      futureScrollRange={24}
      horizontal
      pagingEnabled
      onDayPress={day => {
        setNewDaySelected(day.dateString);
      }}
    />
  );
};

export default HorizontalCalendarList;
