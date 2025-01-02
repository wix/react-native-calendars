import React, {useRef, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar, ExpandableCalendarImperativeMethods} from 'react-native-calendars';
import testIDs from '../testIDs';
import {agendaItems, getMarkedDates} from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../mocks/theme';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
  const {weekView} = props;
  const calendarRef = useRef<ExpandableCalendarImperativeMethods>();
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const onDateChanged = useCallback((date, updateSource) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  }, []);

  const onMonthChange = useCallback(({dateString}) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  }, []);

  const onPressHeader = useCallback(() => {
    calendarRef.current?.togglePosition();
  }, []);

  const renderHeader = useCallback((month) => {
    const title = month?.toString('MMMM yyyy');
    const imageSource = calendarRef.current?.isOpen() ? require('../img/previous.png') : require('../img/next.png');
    
    return (
      <TouchableOpacity style={styles.customHeader} onPress={onPressHeader} activeOpacity={1}>
        <Text style={{color: theme.current.expandableKnobColor, fontSize: 18, marginRight: 8}}>{title}</Text>
        <Image source={imageSource} style={{transform: [{rotate: '90deg'}]}}/>
      </TouchableOpacity>
    );
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item}/>;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
      // disableAutoDaySelection
    >
      {weekView ? (
        <WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current}/>
      ) : (
        <ExpandableCalendar
          ref={calendarRef}
          testID={testIDs.expandableCalendar.CONTAINER}
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          renderHeader={renderHeader}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          // animateScroll
          // closeOnDayPress={false}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        // scrollToNextEvent
        sectionStyle={styles.section}
        // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
