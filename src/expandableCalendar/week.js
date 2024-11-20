import XDate from 'xdate';
import React, { useRef, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import isEqual from 'lodash/isEqual';
import { getPartialWeekDates, getWeekDates, sameMonth } from '../dateutils';
import { parseDate, toMarkingFormat } from '../interface';
import { getState } from '../day-state-manager';
import { extractDayProps } from '../componentUpdater';
import styleConstructor from './style';
import Day from '../calendar/day/index';
function arePropsEqual(prevProps, nextProps) {
    const { context: prevContext, markedDates: prevMarkings, ...prevOthers } = prevProps;
    const { context: nextContext, markedDates: nextMarkings, ...nextOthers } = nextProps;
    return isEqual(prevContext, nextContext) && isEqual(prevMarkings, nextMarkings) && isEqual(prevOthers, nextOthers);
}
const Week = React.memo((props) => {
    const { theme, current, firstDay, hideExtraDays, markedDates, onDayPress, onDayLongPress, style: propsStyle, numberOfDays = 1, timelineLeftInset, testID, } = props;
    const style = useRef(styleConstructor(theme));
    const disableDaySelection = useMemo(() => {
        return !!numberOfDays && numberOfDays > 1;
    }, [numberOfDays]);
    const getWeek = useCallback((date) => {
        if (date) {
            return getWeekDates(date, firstDay);
        }
    }, [firstDay]);
    const partialWeekStyle = useMemo(() => {
        return [style.current.partialWeek, { paddingLeft: timelineLeftInset }];
    }, [timelineLeftInset]);
    const dayProps = extractDayProps(props);
    const currXdate = useMemo(() => parseDate(current), [current]);
    const renderDay = (day, id) => {
        // hide extra days
        if (current && hideExtraDays) {
            if (!sameMonth(day, currXdate)) {
                return <View key={id} style={style.current.emptyDayContainer}/>;
            }
        }
        const dayString = toMarkingFormat(day);
        return (<View style={style.current.dayContainer} key={id}>
        <Day {...dayProps} testID={`${testID}.day_${dayString}`} date={dayString} state={getState(day, currXdate, props, disableDaySelection)} marking={disableDaySelection ? { ...markedDates?.[dayString], disableTouchEvent: true } : markedDates?.[dayString]} onPress={onDayPress} onLongPress={onDayLongPress}/>
      </View>);
    };
    const renderWeek = () => {
        const dates = numberOfDays > 1 ? getPartialWeekDates(current, numberOfDays) : getWeek(current);
        const week = [];
        if (dates) {
            const todayIndex = dates?.indexOf(parseDate(new Date())) || -1;
            const sliced = dates.slice(todayIndex, numberOfDays);
            const datesToRender = numberOfDays > 1 && todayIndex > -1 ? sliced : dates;
            datesToRender.forEach((day, id) => {
                const d = day instanceof XDate ? day : new XDate(day);
                week.push(renderDay(d, id));
            }, this);
        }
        return week;
    };
    return (<View style={style.current.container} testID={`${testID}.week_${current}`}>
      <View style={[style.current.week, numberOfDays > 1 ? partialWeekStyle : undefined, propsStyle]}>
        {renderWeek()}
      </View>
    </View>);
}, arePropsEqual);
export default Week;
Week.displayName = 'Week';
