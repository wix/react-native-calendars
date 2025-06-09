import React, { useRef, useCallback } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import testIDs from '../testIDs';
import { agendaItems, getMarkedDates } from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import { getTheme, themeColor, lightThemeColor } from '../mocks/theme';
const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const ITEMS = agendaItems;
const CHEVRON = require('../img/next.png');
const ExpandableCalendarScreen = (props) => {
    const { weekView } = props;
    const marked = useRef(getMarkedDates());
    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor
    });
    // const onDateChanged = useCallback((date, updateSource) => {
    //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    // }, []);
    // const onMonthChange = useCallback(({dateString}) => {
    //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    // }, []);
    const renderItem = useCallback(({ item }) => {
        return <AgendaItem item={item}/>;
    }, []);
    const calendarRef = useRef(null);
    const rotation = useRef(new Animated.Value(0));
    const toggleCalendarExpansion = useCallback(() => {
        const isOpen = calendarRef.current?.toggleCalendarPosition();
        Animated.timing(rotation.current, {
            toValue: isOpen ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease)
        }).start();
    }, []);
    const renderHeader = useCallback((date) => {
        const rotationInDegrees = rotation.current.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg']
        });
        return (<TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
          <Text style={styles.headerTitle}>{date?.toString('MMMM yyyy')}</Text>
          <Animated.Image source={CHEVRON} style={{ transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }] }}/>
        </TouchableOpacity>);
    }, [toggleCalendarExpansion]);
    const onCalendarToggled = useCallback((isOpen) => {
        rotation.current.setValue(isOpen ? 1 : 0);
    }, [rotation]);
    return (<CalendarProvider date={ITEMS[1]?.title} 
    // onDateChanged={onDateChanged}
    // onMonthChange={onMonthChange}
    showTodayButton 
    // disabledOpacity={0.6}
    theme={todayBtnTheme.current}>
      {weekView ? (<WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current}/>) : (<ExpandableCalendar testID={testIDs.expandableCalendar.CONTAINER} renderHeader={renderHeader} ref={calendarRef} onCalendarToggled={onCalendarToggled} 
        // horizontal={false}
        // hideArrows
        // disablePan
        // hideKnob
        // initialPosition={ExpandableCalendar.positions.OPEN}
        // calendarStyle={styles.calendar}
        // headerStyle={styles.header} // for horizontal only
        // disableWeekScroll
        theme={theme.current} 
        // disableAllTouchEventsForDisabledDays
        firstDay={1} markedDates={marked.current} leftArrowImageSource={leftArrowIcon} rightArrowImageSource={rightArrowIcon}/>)}
      <AgendaList sections={ITEMS} renderItem={renderItem} 
    // scrollToNextEvent
    sectionStyle={styles.section}/>
    </CalendarProvider>);
};
export default ExpandableCalendarScreen;
const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', marginRight: 6 },
    section: {
        backgroundColor: lightThemeColor,
        color: 'grey',
        textTransform: 'capitalize'
    }
});
