import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
// @ts-expect-error
import {CalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

const RANGE = 24;
const initialDate = '2020-06-10';

const CalendarsList = () => {
  const [selected, setSelected] = useState(initialDate);
  const markedDates = {
    [selected]: {
      selected: true,
      disableTouchEvent: true,
      selectedColor: '#5E60CE',
      selectedTextColor: 'white'
    }
  };
  
  const onDayPress = day => {
    setSelected(day.dateString);
  };

  const renderCustomFooter = (props) => {
    const year = new Date(props.month).getFullYear();
    const month = new Date(props.month).getMonth() + 1;
    const buttonText = `Please Tap ${year}-${month}`;
    return (
      <View>
        <Button
          title={buttonText}
          onPress={() => console.warn(buttonText)}
        />
      </View>
    );
  };

  return (
    <CalendarList
      testID={testIDs.calendarList.CONTAINER}
      current={initialDate}
      pastScrollRange={RANGE}
      futureScrollRange={RANGE}
      renderHeader={renderCustomHeader}
      renderFooter={renderCustomFooter}
      theme={theme}
      onDayPress={onDayPress}
      markedDates={markedDates}
    />
  );
};

const theme = {
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
};

function renderCustomHeader(date) {
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
    <View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month} Good!`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>
  );
}

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
