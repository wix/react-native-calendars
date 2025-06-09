import React, { useState, Fragment, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import testIDs from '../testIDs';
const INITIAL_DATE = '2024-11-06';
const CalendarScreen = () => {
    const [selected, setSelected] = useState(INITIAL_DATE);
    const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
    const getDate = (count) => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };
    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
    }, []);
    const marked = useMemo(() => {
        return {
            [getDate(-1)]: {
                dotColor: 'red',
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red'
            }
        };
    }, [selected]);
    const renderCalendarWithSelectableDate = () => {
        return (<Fragment>
        <Text style={styles.text}>Selectable date</Text>
        <Calendar testID={testIDs.calendars.FIRST} enableSwipeMonths current={INITIAL_DATE} style={styles.calendar} onDayPress={onDayPress} markedDates={marked}/>
      </Fragment>);
    };
    const renderCalendarWithWeekNumbersAndSpinner = () => {
        return (<Fragment>
        <Text style={styles.text}>Week numbers and spinner</Text>
        <Calendar style={styles.calendar} hideExtraDays showWeekNumbers displayLoadingIndicator/>
      </Fragment>);
    };
    const renderCalendarWithMinAndMaxDates = () => {
        return (<Fragment>
        <Text style={styles.text}>Min and max dates</Text>
        <Calendar style={styles.calendar} hideExtraDays current={INITIAL_DATE} minDate={getDate(-6)} maxDate={getDate(6)} disableAllTouchEventsForDisabledDays/>
      </Fragment>);
    };
    const renderCalendarWithMarkedDatesAndHiddenArrows = () => {
        return (<Fragment>
        <Text style={styles.text}>Marked dates and hidden arrows</Text>
        <Calendar style={styles.calendar} current={INITIAL_DATE} hideExtraDays firstDay={1} markedDates={{
                [getDate(6)]: { selected: true, marked: true, disableTouchEvent: true },
                [getDate(7)]: { selected: true, marked: true, dotColor: 'red' },
                [getDate(8)]: { marked: true, dotColor: 'red', disableTouchEvent: true },
                [getDate(9)]: { marked: true },
                [getDate(10)]: { disabled: true, activeOpacity: 0, disableTouchEvent: false }
            }} hideArrows={true}/>
      </Fragment>);
    };
    const renderCalendarWithMultiDotMarking = () => {
        return (<Fragment>
        <Text style={styles.text}>Multi-dot marking</Text>
        <Calendar style={styles.calendar} current={INITIAL_DATE} markingType={'multi-dot'} markedDates={{
                [getDate(2)]: {
                    selected: true,
                    dots: [
                        { key: 'vacation', color: 'blue', selectedDotColor: 'red' },
                        { key: 'massage', color: 'red', selectedDotColor: 'white' }
                    ]
                },
                [getDate(3)]: {
                    disabled: true,
                    dots: [
                        { key: 'vacation', color: 'green', selectedDotColor: 'red' },
                        { key: 'massage', color: 'red', selectedDotColor: 'green' }
                    ]
                }
            }}/>
      </Fragment>);
    };
    const renderCalendarWithThemeAndDisabledDays = () => {
        return (<Fragment>
        <Text style={styles.text}>Custom theme and disabled Wednesdays</Text>
        <Calendar 
        // style={styles.calendar}
        current={INITIAL_DATE} minDate={getDate(-5)} displayLoadingIndicator theme={{
                calendarBackground: '#333248',
                textSectionTitleColor: 'white',
                textSectionTitleDisabledColor: 'pink',
                dayTextColor: 'red',
                todayTextColor: 'white',
                selectedDayTextColor: 'white',
                monthTextColor: 'white',
                indicatorColor: 'white',
                selectedDayBackgroundColor: '#333248',
                arrowColor: 'white',
                // textDisabledColor: 'red',
                stylesheet: {
                    calendar: {
                        header: {
                            week: {
                                marginTop: 30,
                                marginHorizontal: 12,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        }
                    }
                }
            }} markingType={'period'} markedDates={{
                [getDate(-2)]: { disabled: true },
                [getDate(1)]: { textColor: 'pink' },
                [getDate(2)]: { textColor: 'pink' },
                [getDate(12)]: { startingDay: true, color: 'green', endingDay: true },
                [getDate(22)]: { startingDay: true, color: 'green' },
                [getDate(23)]: { endingDay: true, color: 'gray' },
                [getDate(25)]: { startingDay: true, color: 'gray' },
                [getDate(26)]: { color: 'gray' },
                [getDate(27)]: { endingDay: true, color: 'gray' }
            }} firstDay={1} disabledDaysIndexes={[1]} disabledByWeekDays={[1]} disableAllTouchEventsForDisabledDays onDayPress={(day) => console.warn(`${day.dateString} pressed`)}/>
      </Fragment>);
    };
    const renderCalendarWithPeriodMarkingAndDotMarking = () => {
        return (<Fragment>
        <Text style={styles.text}>Marking and dot marking</Text>
        <Calendar current={INITIAL_DATE} minDate={getDate(-14)} markingType={'period'} markedDates={{
                [INITIAL_DATE]: { marked: true, dotColor: '#50cebb' },
                [getDate(4)]: { marked: true, dotColor: '#50cebb' },
                [getDate(9)]: { startingDay: true, color: '#50cebb', textColor: 'white' },
                [getDate(10)]: {
                    color: '#70d7c7',
                    customTextStyle: {
                        color: '#FFFAAA',
                        fontWeight: '700'
                    }
                },
                [getDate(11)]: { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
                [getDate(12)]: { color: '#70d7c7', inactive: true, marked: true },
                [getDate(13)]: {
                    endingDay: true,
                    color: '#50cebb',
                    textColor: 'white',
                    customContainerStyle: {
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                        backgroundColor: 'green'
                    }
                },
                [getDate(25)]: { inactive: true, disableTouchEvent: true }
            }} theme={{
                textInactiveColor: '#a68a9f',
                inactiveDotColor: '#a68a9f',
                textSectionTitleDisabledColor: 'grey',
                textSectionTitleColor: '#319e8e',
                arrowColor: '#319e8e'
            }} onDayPress={(day) => console.warn(`${day.dateString} pressed`)}/>
      </Fragment>);
    };
    const renderCalendarWithMultiPeriodMarking = () => {
        return (<Fragment>
        <Text style={styles.text}>Multi-period marking</Text>
        <Calendar style={styles.calendar} current={INITIAL_DATE} markingType={'multi-period'} markedDates={{
                [INITIAL_DATE]: {
                    periods: [
                        { startingDay: true, endingDay: false, color: 'green' },
                        { startingDay: true, endingDay: false, color: 'orange' }
                    ]
                },
                [getDate(1)]: {
                    periods: [
                        { startingDay: false, endingDay: true, color: 'green' },
                        { startingDay: false, endingDay: true, color: 'orange' },
                        { startingDay: true, endingDay: false, color: 'pink' }
                    ]
                },
                [getDate(3)]: {
                    periods: [
                        { startingDay: true, endingDay: true, color: 'orange' },
                        { color: 'transparent' },
                        { startingDay: false, endingDay: false, color: 'pink' }
                    ]
                }
            }}/>
      </Fragment>);
    };
    const renderCalendarWithCustomMarkingType = () => {
        return (<Fragment>
        <Text style={styles.text}>Custom marking type</Text>
        <Calendar style={styles.calendar} hideExtraDays current={INITIAL_DATE} minDate={INITIAL_DATE} markingType={'custom'} markedDates={{
                [INITIAL_DATE]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'white',
                            elevation: 2
                        },
                        text: {
                            color: 'red',
                            marginTop: 0
                        }
                    }
                },
                [getDate(8)]: {
                    selected: true
                },
                [getDate(9)]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'red',
                            elevation: 4
                        },
                        text: {
                            color: 'white'
                        }
                    }
                },
                [getDate(14)]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'green'
                        },
                        text: {
                            color: 'white'
                        }
                    }
                },
                [getDate(15)]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'black',
                            elevation: 2
                        },
                        text: {
                            color: 'yellow'
                        }
                    }
                },
                [getDate(21)]: {
                    disabled: true
                },
                [getDate(28)]: {
                    customStyles: {
                        text: {
                            color: 'black',
                            fontWeight: 'bold'
                        }
                    }
                },
                [getDate(30)]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'pink',
                            elevation: 4,
                            borderColor: 'purple',
                            borderWidth: 5
                        },
                        text: {
                            marginTop: 3,
                            fontSize: 11,
                            color: 'black'
                        }
                    }
                },
                [getDate(31)]: {
                    customStyles: {
                        container: {
                            backgroundColor: 'orange',
                            borderRadius: 0
                        }
                    }
                }
            }}/>
      </Fragment>);
    };
    const renderCalendarWithCustomDay = () => {
        return (<Fragment>
        <Text style={styles.text}>Custom day component</Text>
        <Calendar style={[styles.calendar, styles.customCalendar]} dayComponent={({ date, state }) => {
                return (<View>
                <Text style={[styles.customDay, state === 'disabled' ? styles.disabledText : styles.defaultText]}>
                  {date?.day}
                </Text>
              </View>);
            }}/>
      </Fragment>);
    };
    const [selectedValue, setSelectedValue] = useState(new Date());
    const getNewSelectedDate = useCallback((date, shouldAdd) => {
        const newMonth = new Date(date).getMonth();
        const month = shouldAdd ? newMonth + 1 : newMonth - 1;
        const newDate = new Date(selectedValue.setMonth(month));
        const newSelected = new Date(newDate.setDate(1));
        return newSelected;
    }, [selectedValue]);
    const onPressArrowLeft = useCallback((subtract, month) => {
        const newDate = getNewSelectedDate(month, false);
        setSelectedValue(newDate);
        subtract();
    }, [getNewSelectedDate]);
    const onPressArrowRight = useCallback((add, month) => {
        const newDate = getNewSelectedDate(month, true);
        setSelectedValue(newDate);
        add();
    }, [getNewSelectedDate]);
    const renderCalendarWithCustomHeaderTitle = () => {
        const CustomHeaderTitle = (<TouchableOpacity style={styles.customTitleContainer} onPress={() => console.warn('Tapped!')}>
        <Text style={styles.customTitle}>{selectedValue.getMonth() + 1}-{selectedValue.getFullYear()}</Text>
      </TouchableOpacity>);
        return (<Fragment>
        <Text style={styles.text}>Custom header title</Text>
        <Calendar style={styles.calendar} customHeaderTitle={CustomHeaderTitle} onPressArrowLeft={onPressArrowLeft} onPressArrowRight={onPressArrowRight}/>
      </Fragment>);
    };
    const customHeaderProps = useRef();
    const setCustomHeaderNewMonth = (next = false) => {
        const add = next ? 1 : -1;
        const month = new Date(customHeaderProps?.current?.month);
        const newMonth = new Date(month.setMonth(month.getMonth() + add));
        customHeaderProps?.current?.addMonth(add);
        setCurrentMonth(newMonth.toISOString().split('T')[0]);
    };
    const moveNext = () => {
        setCustomHeaderNewMonth(true);
    };
    const movePrevious = () => {
        setCustomHeaderNewMonth(false);
    };
    const renderCalendarWithCustomHeader = () => {
        const CustomHeader = React.forwardRef((props, ref) => {
            customHeaderProps.current = props;
            return (
            // @ts-expect-error
            <View ref={ref} {...props} style={styles.customHeader}>
          <TouchableOpacity onPress={movePrevious}>
            <Text>Previous</Text>
          </TouchableOpacity>
          <Text>Custom header!</Text>
          <Text>{currentMonth}</Text>
          <TouchableOpacity onPress={moveNext}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>);
        });
        return (<Fragment>
        <Text style={styles.text}>Custom header component</Text>
        <Calendar initialDate={INITIAL_DATE} testID={testIDs.calendars.LAST} style={[styles.calendar, styles.customCalendar]} customHeader={CustomHeader}/>
      </Fragment>);
    };
    const renderCalendarWithInactiveDays = () => {
        return (<Fragment>
        <Text style={styles.text}>Inactive days</Text>
        <Calendar style={styles.calendar} disableAllTouchEventsForInactiveDays current={INITIAL_DATE} markedDates={{
                [getDate(3)]: {
                    inactive: true
                },
                [getDate(4)]: {
                    inactive: true
                }
            }}/>
      </Fragment>);
    };
    const renderExamples = () => {
        return (<Fragment>
        {renderCalendarWithSelectableDate()}
        {renderCalendarWithWeekNumbersAndSpinner()}
        {renderCalendarWithMinAndMaxDates()}
        {renderCalendarWithCustomDay()}
        {renderCalendarWithInactiveDays()}
        {renderCalendarWithCustomHeaderTitle()}
        {renderCalendarWithCustomHeader()}
        {renderCalendarWithMarkedDatesAndHiddenArrows()}
        {renderCalendarWithMultiDotMarking()}
        {renderCalendarWithThemeAndDisabledDays()}
        {renderCalendarWithPeriodMarkingAndDotMarking()}
        {renderCalendarWithMultiPeriodMarking()}
        {renderCalendarWithCustomMarkingType()}
      </Fragment>);
    };
    return (<ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
      {renderExamples()}
    </ScrollView>);
};
export default CalendarScreen;
const styles = StyleSheet.create({
    calendar: {
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    switchText: {
        margin: 10,
        fontSize: 16
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16
    },
    disabledText: {
        color: 'grey'
    },
    defaultText: {
        color: 'purple'
    },
    customCalendar: {
        height: 250,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    customDay: {
        textAlign: 'center'
    },
    customHeader: {
        backgroundColor: '#FCC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: -4,
        padding: 8
    },
    customTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    customTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00BBF2'
    }
});
