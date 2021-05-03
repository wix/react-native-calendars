import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CalendarList} from 'react-native-calendars';

const testIDs = require('../testIDs');

const CalendarsList = () => {
  return (
    <CalendarList
      testID={testIDs.calendarList.CONTAINER}
      current={'2020-06-10'}
      pastScrollRange={24}
      futureScrollRange={24}
      renderHeader={date => {
        const header = date.toString('MMMM yyyy');
        const [month, year] = header.split(' ');
        const textStyle = {
          fontSize: 18,
          fontWeight: 'bold',
          paddingTop: 10,
          paddingBottom: 10,
          color: '#5E60CE',
          paddingRight: 5
        };

        return (
          <View
            style={styles.header}
          >
            <Text style={[styles.month, {...textStyle}]}>{`${month}`}</Text>
            <Text style={[styles.year, {...textStyle}]}>{year}</Text>
          </View>
        );
      }}
      theme={{
        'stylesheet.calendar.header': {
          dayHeader: {
            fontWeight: '600',
            color: '#48BFE3'
          }
        },
        'stylesheet.day.basic': {
          today: {
            borderColor: '#48BFE3',
            borderWidth: 0.8
          },
          todayText: {
            color: '#5390D9',
            fontWeight: '800'
          }
        }
      }}
    />
  );
};

export default CalendarsList;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10
  },
  month: {
    marginLeft: 5
  },
  year: {
    marginRight: 5
  }
});
