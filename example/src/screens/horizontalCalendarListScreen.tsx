import React, {useMemo, useState, useCallback} from 'react';
// @ts-expect-error
import {HorizontalCalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

const initialDate = '2020-05-16';

const HorizontalCalendarListScreen = () => {
  const [selected, setSelected] = useState(initialDate);
  
  const markedDates = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        selectedColor: '#DFA460'
      }
    };
  }, [selected]);

  const onDayPress = useCallback(day => {
    setSelected(day.dateString);
  }, [setSelected]);

  const calendarProps = useMemo(() => {
    return {
      markedDates: markedDates,
      onDayPress: onDayPress
    };
  }, [selected, markedDates, onDayPress]);

  return (
    <HorizontalCalendarList
      // initialDate={initialDate}
      // staticHeader  
      // scrollRange={10}
      calendarProps={calendarProps}
      testID={testIDs.horizontalList.CONTAINER}
    />
  );
};

export default HorizontalCalendarListScreen;
