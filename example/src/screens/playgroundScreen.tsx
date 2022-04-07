import React, {useState, useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {ExpandableCalendar, CalendarProvider} from 'react-native-calendars';

const INITIAL_DATE = '2019-04-01';

export default function PlaygroundScreen() {
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);

  const onDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected Date: {selectedDate}</Text>
      <CalendarProvider date={INITIAL_DATE}>
        <ExpandableCalendar
            pastScrollRange={3}
            futureScrollRange={3}
            allowShadow={false}
            onDayPress={onDayPress}
            style={styles.calendar}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#b6c1cd'
  },
  text : {
    marginLeft: 10,
    padding : 20,
    color : '#00BBF2',
    fontSize: 16
  }
});
