import React, {useCallback, useMemo, useRef} from 'react';
import {Text} from 'react-native';
import Calendar, {type CalendarProps} from '../calendar';
import {extractCalendarProps} from '../componentUpdater';
import {
  addMonthsToDate,
  type CalendarsDate,
  getDate,
  getDayOfMonth,
  getMonth,
  setDayOfMonth,
  subtractMonthsToDate,
  toMarkingFormat
} from '../dateutils';
import type {Theme} from '../types';
import styleConstructor from './style';

export type CalendarListItemProps = CalendarProps & {
  item: any;
  calendarWidth?: number;
  calendarHeight?: number;
  horizontal?: boolean;
  theme?: Theme;
  scrollToMonth?: (date: CalendarsDate) => void;
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

  const _onPressArrowLeft = useCallback(
    (method: () => void, month?: CalendarsDate) => {
      if (month) {
        let monthClone = getDate(month);
        if (onPressArrowLeft) {
          onPressArrowLeft(method, monthClone);
        } else if (scrollToMonth) {
          const currentMonth = getMonth(monthClone);
          const previousMonth = subtractMonthsToDate(monthClone, 1);
          // Make sure we actually get the previous month, not just 30 days before currentMonth.
          while (getMonth(previousMonth) === currentMonth) {
            monthClone = setDayOfMonth(monthClone, getDayOfMonth(monthClone) - 1);
          }
          scrollToMonth(monthClone);
        }
      }
    },
    [onPressArrowLeft, scrollToMonth]
  );

  const _onPressArrowRight = useCallback(
    (method: () => void, month?: CalendarsDate) => {
      if (month) {
        let monthClone = getDate(month);
        if (onPressArrowRight) {
          onPressArrowRight(method, monthClone);
        } else if (scrollToMonth) {
          monthClone = addMonthsToDate(monthClone, 1);
          scrollToMonth(monthClone);
        }
      }
    },
    [onPressArrowRight, scrollToMonth]
  );

  if (!visible) {
    return <Text style={textStyle}>{dateString}</Text>;
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
    />
  );
});

export default CalendarListItem;
CalendarListItem.displayName = 'CalendarListItem';
