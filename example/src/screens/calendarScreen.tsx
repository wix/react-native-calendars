import React, {useState, Fragment, useCallback, useMemo, useRef} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import testIDs from '../testIDs';

const INITIAL_DATE = '2022-07-06';

const CalendarScreen = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: 'orange',
        selectedTextColor: 'red'
      },
      ['2022-07-22']: {
        dotColor: 'red',
        marked: true
      }
    };
  }, [selected]);

  const renderCalendarWithSelectableDate = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with selectable date</Text>
        <Calendar
          testID={testIDs.calendars.FIRST}
          enableSwipeMonths
          current={INITIAL_DATE}
          style={styles.calendar}
          onDayPress={onDayPress}
          markedDates={marked}
        />
      </Fragment>
    );
  };

  const renderCalendarWithWeekNumbers = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with week numbers</Text>
        <Calendar style={styles.calendar} hideExtraDays showWeekNumbers/>
      </Fragment>
    );
  };

  const renderCalendarWithMinAndMaxDates = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with min and max dates</Text>
        <Calendar
          style={styles.calendar}
          hideExtraDays
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          maxDate={'2012-05-20'}
        />
      </Fragment>
    );
  };

  const renderCalendarWithMarkedDatesAndHiddenArrows = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with marked dates and hidden arrows</Text>
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          hideExtraDays
          disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={{
            '2012-05-23': {selected: true, marked: true, disableTouchEvent: true},
            '2012-05-24': {selected: true, marked: true, dotColor: 'red'},
            '2012-05-25': {marked: true, dotColor: 'red', disableTouchEvent: true},
            '2012-05-26': {marked: true},
            '2012-05-27': {disabled: true, activeOpacity: 0, disableTouchEvent: false}
          }}
          hideArrows={true}
          // disabledByDefault={true}
        />
      </Fragment>
    );
  };

  const renderCalendarWithMultiDotMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with multi-dot marking</Text>
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          markingType={'multi-dot'}
          markedDates={{
            '2012-05-08': {
              selected: true,
              dots: [
                {key: 'vacation', color: 'blue', selectedDotColor: 'red'},
                {key: 'massage', color: 'red', selectedDotColor: 'white'}
              ]
            },
            '2012-05-09': {
              disabled: true,
              dots: [
                {key: 'vacation', color: 'green', selectedDotColor: 'red'},
                {key: 'massage', color: 'red', selectedDotColor: 'green'}
              ]
            }
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithPeriodMarkingAndSpinner = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with period marking and spinner</Text>
        <Calendar
          // style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          displayLoadingIndicator
          markingType={'period'}
          theme={{
            calendarBackground: '#333248',
            textSectionTitleColor: 'white',
            textSectionTitleDisabledColor: 'gray',
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
          }}
          markedDates={{
            '2012-05-17': {disabled: true},
            '2012-05-08': {textColor: 'pink'},
            '2012-05-09': {textColor: 'pink'},
            '2012-05-14': {startingDay: true, color: 'green', endingDay: true},
            '2012-05-21': {startingDay: true, color: 'green'},
            '2012-05-22': {endingDay: true, color: 'gray'},
            '2012-05-24': {startingDay: true, color: 'gray'},
            '2012-05-25': {color: 'gray'},
            '2012-05-26': {endingDay: true, color: 'gray'}
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithPeriodMarkingAndDotMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with period marking and dot marking</Text>
        <Calendar
          current={'2012-05-16'}
          minDate={'2012-05-01'}
          markingType={'period'}
          markedDates={{
            '2012-05-15': {marked: true, dotColor: '#50cebb'},
            '2012-05-16': {marked: true, dotColor: '#50cebb'},
            '2012-05-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
            '2012-05-22': {
              color: '#70d7c7',
              customTextStyle: {
                color: '#FFFAAA',
                fontWeight: '700'
              }
            },
            '2012-05-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
            '2012-05-24': {color: '#70d7c7', inactive: true},
            '2012-05-25': {
              endingDay: true,
              color: '#50cebb',
              textColor: 'white',
              customContainerStyle: {
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5
              }
            },
            '2012-05-30': {inactive: true, disableTouchEvent: true}
          }}
          disabledDaysIndexes={[0, 6]}
          theme={{
            textInactiveColor: '#a68a9f',
            textSectionTitleDisabledColor: 'grey',
            textSectionTitleColor: '#319e8e',
            arrowColor: '#319e8e'
          }}
          onDayPress={(day) => console.warn(`${day.dateString} pressed`)}
        />
      </Fragment>
    );
  };

  const renderCalendarWithMultiPeriodMarking = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with multi-period marking</Text>
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          markingType={'multi-period'}
          markedDates={{
            '2012-05-16': {
              periods: [
                {startingDay: true, endingDay: false, color: 'green'},
                {startingDay: true, endingDay: false, color: 'orange'}
              ]
            },
            '2012-05-17': {
              periods: [
                {startingDay: false, endingDay: true, color: 'green'},
                {startingDay: false, endingDay: true, color: 'orange'},
                {startingDay: true, endingDay: false, color: 'pink'}
              ]
            },
            '2012-05-18': {
              periods: [
                {startingDay: true, endingDay: true, color: 'orange'},
                {color: 'transparent'},
                {startingDay: false, endingDay: false, color: 'pink'}
              ]
            }
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithCustomMarkingType = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Custom calendar with custom marking type</Text>
        <Calendar
          style={styles.calendar}
          hideExtraDays
          current={'2018-03-01'}
          minDate={'2018-03-01'}
          markingType={'custom'}
          markedDates={{
            '2018-03-01': {
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
            '2018-03-08': {
              selected: true
            },
            '2018-03-09': {
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
            '2018-03-14': {
              customStyles: {
                container: {
                  backgroundColor: 'green'
                },
                text: {
                  color: 'white'
                }
              }
            },
            '2018-03-15': {
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
            '2018-03-21': {
              disabled: true
            },
            '2018-03-28': {
              customStyles: {
                text: {
                  color: 'black',
                  fontWeight: 'bold'
                }
              }
            },
            '2018-03-30': {
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
            '2018-03-31': {
              customStyles: {
                container: {
                  backgroundColor: 'orange',
                  borderRadius: 0
                }
              }
            }
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithCustomDay = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with custom day component</Text>
        <Calendar
          style={[styles.calendar, styles.customCalendar]}
          dayComponent={({date, state}) => {
            return (
              <View>
                <Text style={[styles.customDay, state === 'disabled' ? styles.disabledText : styles.defaultText]}>
                  {date?.day}
                </Text>
              </View>
            );
          }}
        />
      </Fragment>
    );
  };

  const renderCalendarWithCustomHeaderTitle = () => {
    const [selectedValue, setSelectedValue] = useState(new Date());

    const getNewSelectedDate = useCallback(
      (date, shouldAdd) => {
        const newMonth = new Date(date).getMonth();
        const month = shouldAdd ? newMonth + 1 : newMonth - 1;
        const newDate = new Date(selectedValue.setMonth(month));
        const newSelected = new Date(newDate.setDate(1));
        return newSelected;
      },
      [selectedValue]
    );
    const onPressArrowLeft = useCallback(
      (subtract, month) => {
        const newDate = getNewSelectedDate(month, false);
        setSelectedValue(newDate);
        subtract();
      },
      [getNewSelectedDate]
    );
  
    const onPressArrowRight = useCallback(
      (add, month) => {
        const newDate = getNewSelectedDate(month, true);
        setSelectedValue(newDate);
        add();
      },
      [getNewSelectedDate]
    );

    const CustomHeaderTitle = (
      <TouchableOpacity style={styles.customTitleContainer} onPress={() => console.warn('Tapped!')}>
        <Text style={styles.customTitle}>{selectedValue.getMonth() + 1}-{selectedValue.getFullYear()}</Text>
      </TouchableOpacity>
    );

    return (
      <Fragment>
        <Text style={styles.text}>Calendar with custom header title</Text>
        <Calendar
          style={styles.calendar}
          customHeaderTitle={CustomHeaderTitle}
          onPressArrowLeft={onPressArrowLeft}
          onPressArrowRight={onPressArrowRight}
        />
      </Fragment>
    );
  };

  const customHeaderProps: any = useRef();

  const setCustomHeaderNewMonth = (next = false) => {
    const add = next ? 1 : -1;
    const month = customHeaderProps?.current?.month;
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
        </View>
      );
    });

    return (
      <Fragment>
        <Text style={styles.text}>Calendar with custom header component</Text>
        <Calendar
          initialDate={INITIAL_DATE}
          testID={testIDs.calendars.LAST}
          style={[styles.calendar, styles.customCalendar]}
          customHeader={CustomHeader}
        />
      </Fragment>
    );
  };

  const renderCalendarWithInactiveDays = () => {
    return (
      <Fragment>
        <Text style={styles.text}>Calendar with inactive days</Text>
        <Calendar
          style={styles.calendar}
          disableAllTouchEventsForInactiveDays
          current={INITIAL_DATE}
          markedDates={{
            '2020-02-10': {
              inactive: true
            },
            '2020-02-11': {
              inactive: true
            }
          }}
        />
      </Fragment>
    );
  };

  const renderExamples = () => {
    return (
      <Fragment>
        {renderCalendarWithSelectableDate()}
        {renderCalendarWithWeekNumbers()}
        {renderCalendarWithMinAndMaxDates()}
        {renderCalendarWithCustomDay()}
        {renderCalendarWithInactiveDays()}
        {renderCalendarWithCustomHeaderTitle()}
        {renderCalendarWithCustomHeader()}
        {renderCalendarWithMarkedDatesAndHiddenArrows()}
        {renderCalendarWithMultiDotMarking()}
        {renderCalendarWithPeriodMarkingAndSpinner()}
        {renderCalendarWithPeriodMarkingAndDotMarking()}
        {renderCalendarWithMultiPeriodMarking()}
        {renderCalendarWithCustomMarkingType()}
      </Fragment>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} testID={testIDs.calendars.CONTAINER}>
      {renderExamples()}
    </ScrollView>
  );
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
