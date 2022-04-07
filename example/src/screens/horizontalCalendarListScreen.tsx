import React, {useState, useMemo, useCallback} from 'react';
import {CalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

const INITIAL_DATE = '2020-05-16';

const HorizontalCalendarListScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const markedDates = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        selectedColor: '#DFA460'
      }
    };
  }, [selected]);

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  return (
    <CalendarList
      current={INITIAL_DATE}
      markedDates={markedDates}
      pastScrollRange={24}
      futureScrollRange={24}
      horizontal
      pagingEnabled
      onDayPress={onDayPress}
      testID={testIDs.horizontalList.CONTAINER}
      staticHeader
    />
  );
};

export default HorizontalCalendarListScreen;
