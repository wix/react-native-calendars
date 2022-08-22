import XDate from 'xdate';
import React, {useRef, useMemo, useContext, useCallback} from 'react';
import {Text} from 'react-native';
import {Theme} from '../types';
import {toMarkingFormat} from '../interface';
import {extractCalendarProps} from '../componentUpdater';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import CalendarContext from '../expandableCalendar/Context';

export type CalendarListItemProps = CalendarProps & {
  item: any;
  calendarWidth?: number;
  calendarHeight?: number;
  horizontal?: boolean;
  theme?: Theme;
  scrollToMonth?: (date: XDate) => void;
  visible?: boolean;
};

const CalendarListItem = React.memo((props: CalendarListItemProps) => {  
  const {
    item,
    theme,
    scrollToMonth,
    horizontal,
    calendarHeight,
    calendarWidth,
    style: propsStyle,
    headerStyle,
    onPressArrowLeft,
    onPressArrowRight,
    visible
  } = props;
  const context = useContext(CalendarContext);

  const style = useRef(styleConstructor(theme));
  
  const calendarProps = extractCalendarProps(props);
  const dateString = toMarkingFormat(item);
  
  const calendarStyle = useMemo(() => {
    return [
      {
        width: calendarWidth,
        minHeight: calendarHeight
      }, 
      style.current.calendar,
      propsStyle
    ];
  }, [calendarWidth, calendarHeight, propsStyle]);
  
  const textStyle = useMemo(() => {
    return [calendarStyle, style.current.placeholderText];
  }, [calendarStyle]);
  
  const _onPressArrowLeft = useCallback((method: () => void, month?: XDate) => {
    const monthClone = month?.clone();
    if (monthClone) {
      if (onPressArrowLeft) {
        onPressArrowLeft(method, monthClone);
      } else if (scrollToMonth) {
        const currentMonth = monthClone.getMonth();
        monthClone.addMonths(-1);
        // Make sure we actually get the previous month, not just 30 days before currentMonth.
        while (monthClone.getMonth() === currentMonth) {
          monthClone.setDate(monthClone.getDate() - 1);
        }
        scrollToMonth(monthClone);
      }
    }
  }, [onPressArrowLeft, scrollToMonth]);

  const _onPressArrowRight = useCallback((method: () => void, month?: XDate) => {
    const monthClone = month?.clone();
    if (monthClone) {
      if (onPressArrowRight) {
        onPressArrowRight(method, monthClone);
      } else if (scrollToMonth) {
        monthClone.addMonths(1);
        scrollToMonth(monthClone);
      }
    }
  }, [onPressArrowRight, scrollToMonth]);

  if (!visible) {
    return (
      <Text style={textStyle}>{dateString}</Text>
    );
  }

  return (
    <Calendar
      hideArrows={true}
      hideExtraDays={true}
      {...calendarProps}
      current={dateString}
      style={calendarStyle}
      headerStyle={horizontal ? headerStyle : undefined}
      disableMonthChange
      onPressArrowLeft={horizontal ? _onPressArrowLeft : onPressArrowLeft}
      onPressArrowRight={horizontal ? _onPressArrowRight : onPressArrowRight}
      context={context} // ???
    />
  );
});

export default CalendarListItem;
CalendarListItem.displayName = 'CalendarListItem';
