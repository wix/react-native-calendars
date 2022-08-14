import React, {useState, useCallback, useMemo} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Profiler, Calendar, CalendarList, ExpandableCalendar, CalendarProvider} from 'react-native-calendars';

const INITIAL_DATE = '2022-07-07';
const enum elements {
  CALENDAR = 'Calendar',
  LIST = 'CalendarList',
  EXPANDABLE = 'Expandable',
}
const BLUE = '#00BBF2';

export default function PlaygroundScreen() {
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const [element, setElement] = useState(elements.LIST);
  
  const marked = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: '#5E60CE',
        selectedTextColor: 'white'
      }
    };
  }, [selectedDate]);

  const onDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
  }, [selectedDate]);

  const renderCalendar = () => {
    return (
      <Calendar
        current={INITIAL_DATE}
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={marked}
      />
    );
  };

  const renderCalendarList = () => {
    return (
      <CalendarList
        current={INITIAL_DATE}
        style={styles.calendar}
        horizontal
        pagingEnabled
        staticHeader
        onDayPress={onDayPress}
        markedDates={marked}
      />
    );
  };

  const renderExpendableCalendar = () => {
    return (
      <CalendarProvider date={INITIAL_DATE}>
        <ExpandableCalendar
            pastScrollRange={3}
            futureScrollRange={3}
            allowShadow={false}
            onDayPress={onDayPress}
            markedDates={marked}
            style={styles.calendar}
        />
      </CalendarProvider>
    );
  };

  const renderElement = () => {
    switch (element) {
      case elements.CALENDAR:
        return renderCalendar();
      case elements.LIST:
        return renderCalendarList();
      case elements.EXPANDABLE:
        return renderExpendableCalendar();
      default:
        return renderCalendar(); 
    }
  };

  return (
    <>
      <View style={styles.buttonsContainer}>
        <Button color={BLUE} title='Calendar' onPress={() => setElement(elements.CALENDAR)}/>
        <Button color={BLUE} title='Calendar List' onPress={() => setElement(elements.LIST)}/>
        <Button color={BLUE} title='Expandable' onPress={() => setElement(elements.EXPANDABLE)}/>
      </View>
      <Text style={styles.text}>Selected Date: {selectedDate}</Text>
      <Profiler id={element}>
        {renderElement()}
      </Profiler>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#b6c1cd'
  },
  text : {
    alignSelf: 'center',
    padding : 20,
    fontSize: 16
  }
});
