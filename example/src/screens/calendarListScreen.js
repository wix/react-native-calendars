import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import testIDs from '../testIDs';
const RANGE = 24;
const initialDate = '2022-07-05';
const nextWeekDate = '2022-07-14';
const nextMonthDate = '2022-08-05';
const CalendarListScreen = (props) => {
    const { horizontalView } = props;
    const [selected, setSelected] = useState(initialDate);
    const marked = useMemo(() => {
        return {
            [nextWeekDate]: {
                selected: selected === nextWeekDate,
                selectedTextColor: '#5E60CE',
                marked: true
            },
            [nextMonthDate]: {
                selected: selected === nextMonthDate,
                selectedTextColor: '#5E60CE',
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: '#5E60CE',
                selectedTextColor: 'white'
            }
        };
    }, [selected]);
    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
    }, []);
    return (<CalendarList testID={testIDs.calendarList.CONTAINER} current={initialDate} pastScrollRange={RANGE} futureScrollRange={RANGE} onDayPress={onDayPress} markedDates={marked} renderHeader={!horizontalView ? renderCustomHeader : undefined} calendarHeight={!horizontalView ? 390 : undefined} theme={!horizontalView ? theme : undefined} horizontal={horizontalView} pagingEnabled={horizontalView} staticHeader={horizontalView}/>);
};
const theme = {
    stylesheet: {
        calendar: {
            header: {
                dayHeader: {
                    fontWeight: '600',
                    color: '#48BFE3'
                }
            }
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
    return (<View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>);
}
export default CalendarListScreen;
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
