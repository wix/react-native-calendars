import XDate from 'xdate';

import React, {useRef, useMemo, useContext} from 'react';
import {Text, View} from 'react-native';

import {Theme} from '../types';
import {formatNumbers} from '../dateutils';
import {getCalendarDateString} from '../services';
import Calendar, {CalendarProps} from '../calendar';
import styleConstructor from './style';
import CalendarContext from '../expandableCalendar/Context';

export type CalendarListItemProps = CalendarProps & {
  item: any;
  calendarWidth?: number;
  calendarHeight?: number;
  horizontal?: boolean;
  theme?: Theme;
  scrollToMonth?: (date: XDate) => void;
};

const CalendarListItem = React.memo((props: CalendarListItemProps) => {  
  const {
    theme,
    item,
    scrollToMonth,
    horizontal,
    calendarHeight,
    calendarWidth,
    testID,
    style: propsStyle,
    headerStyle,
    onPressArrowLeft,
    onPressArrowRight
  } = props;
  const context = useContext(CalendarContext);
  
  const style = useRef(styleConstructor(theme));
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

  const _onPressArrowLeft = (method: () => void, month?: XDate) => {
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
  };

  const _onPressArrowRight = (method: () => void, month?: XDate) => {
    const monthClone = month?.clone();
    if (monthClone) {
      if (onPressArrowRight) {
        onPressArrowRight(method, monthClone);
      } else if (scrollToMonth) {
        monthClone.addMonths(1);
        scrollToMonth(monthClone);
      }
    }
  };

  if (item.getTime) {
    return (
      <Calendar
        hideArrows={true}
        hideExtraDays={true}
        {...props}
        testID={testID}
        current={getCalendarDateString(item.toString())}
        style={calendarStyle}
        headerStyle={horizontal ? headerStyle : undefined}
        disableMonthChange
        onPressArrowLeft={horizontal ? _onPressArrowLeft : onPressArrowLeft}
        onPressArrowRight={horizontal ? _onPressArrowRight : onPressArrowRight}
        context={context} // ???
      />
    );
  } else {
    const text = formatNumbers(item.toString());
    return (
      <View style={[{height: calendarHeight, width: calendarWidth}, style.current.placeholder]}>
        <Text allowFontScaling={false} style={style.current.placeholderText}>
          {text}
        </Text>
      </View>
    );
    }
});

export default CalendarListItem;
CalendarListItem.displayName = 'CalendarListItem';
