import React, {Fragment, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
// @ts-expect-error
import {CalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

const RANGE = 24;
const initialDate = '2020-06-10';

const CalendarsList = () => {
  const [selected, setSelected] = useState(initialDate);
  const [numberOfColumn, setNumberOfColumn] = useState(1);
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

  const addColumn = () => {
    setNumberOfColumn(numberOfColumn + 1);
  };

  const subtractColumn = () => {
    setNumberOfColumn(numberOfColumn - 1);
  };

  return (
    <Fragment>
      <ColumnController numberOfColumn={numberOfColumn} subtractColumn={subtractColumn} addColumn={addColumn} />
      <CalendarList
        testID={testIDs.calendarList.CONTAINER}
        current={initialDate}
        pastScrollRange={RANGE}
        futureScrollRange={RANGE}
        renderHeader={renderCustomHeader}
        theme={theme}
        onDayPress={onDayPress}
        markedDates={markedDates}
        numberOfColumn={numberOfColumn}
      />
    </Fragment>
  );
};

const ColumnController = ({numberOfColumn, subtractColumn, addColumn}) => {
  return (
    <View style={styles.columnControllerContainer}>
      <Button title="-" onPress={subtractColumn} disabled={numberOfColumn < 2} />
      <Text style={styles.columnControllerText}>Number of columns: {numberOfColumn}</Text>
      <Button title="+" onPress={addColumn} disabled={numberOfColumn > 3} />
    </View>
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
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
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
  },
  columnControllerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  columnControllerText: {
    marginHorizontal: 12
  }
});
