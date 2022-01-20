import React, {useState} from 'react';
import {Button, View} from 'react-native';
// @ts-expect-error
import {CalendarList} from 'react-native-calendars';
import testIDs from '../testIDs';

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

  const renderFooter = (props) => {
    const year = new Date(props.month).getFullYear();
    const month = new Date(props.month).getMonth() + 1;
    const buttonText = `Please Tap ${year}-${month}`;
    return (
      <View>
        <Button
          title={buttonText}
          onPress={() => console.warn(`You Tapped: ${year}-${month}}`)}
        />
      </View>
    );
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
      renderFooter={renderFooter}
    />
  );
};

export default HorizontalCalendarList;
