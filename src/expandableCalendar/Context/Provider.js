import XDate from 'xdate';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { sameMonth } from '../../dateutils';
import { xdateToData } from '../../interface';
import { useDidUpdate } from '../../hooks';
import { UpdateSources } from '../commons';
import styleConstructor from '../style';
import CalendarContext from './index';
import TodayButton from './todayButton';
/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const CalendarProvider = (props) => {
    const { theme, date, onDateChanged, onMonthChange, showTodayButton = false, disabledOpacity, todayBottomMargin, todayButtonStyle, style: propsStyle, numberOfDays, timelineLeftInset = 72, children } = props;
    const style = useRef(styleConstructor(theme));
    const todayButton = useRef();
    const prevDate = useRef(date);
    const currDate = useRef(date); // for setDate only to keep prevDate up to date
    const [currentDate, setCurrentDate] = useState(date);
    const [updateSource, setUpdateSource] = useState(UpdateSources.CALENDAR_INIT);
    const wrapperStyle = useMemo(() => {
        return [style.current.contextWrapper, propsStyle];
    }, [style, propsStyle]);
    useDidUpdate(() => {
        if (date && date !== currentDate) {
            _setDate(date, UpdateSources.PROP_UPDATE);
        }
    }, [date]);
    const _setDate = useCallback((date, updateSource) => {
        prevDate.current = currDate.current;
        currDate.current = date;
        setCurrentDate(date);
        setUpdateSource(updateSource);
        onDateChanged?.(date, updateSource);
        if (!sameMonth(new XDate(date), new XDate(prevDate.current))) {
            onMonthChange?.(xdateToData(new XDate(date)), updateSource);
        }
    }, [onDateChanged, onMonthChange]);
    const _setDisabled = useCallback((disabled) => {
        if (showTodayButton) {
            todayButton.current?.disable(disabled);
        }
    }, [showTodayButton]);
    const contextValue = useMemo(() => {
        return {
            date: currentDate,
            prevDate: prevDate.current,
            updateSource: updateSource,
            setDate: _setDate,
            setDisabled: _setDisabled,
            numberOfDays,
            timelineLeftInset
        };
    }, [currentDate, updateSource, numberOfDays, _setDisabled]);
    const renderTodayButton = () => {
        return (<TodayButton ref={todayButton} disabledOpacity={disabledOpacity} margin={todayBottomMargin} style={todayButtonStyle} theme={theme}/>);
    };
    return (<CalendarContext.Provider value={contextValue}>
      <View style={wrapperStyle} key={numberOfDays}>{children}</View>
      {showTodayButton && renderTodayButton()}
    </CalendarContext.Provider>);
};
export default CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
