import React, {useState, useMemo, useCallback} from 'react';
import {CalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

const INITIAL_DATE = '2022-07-05';

const HorizontalCalendarListScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const markedDates = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        selectedColor: '#5E60CE',
        selectedTextColor: 'white'
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
