import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import XDate from 'xdate';

import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {Theme} from '../types';
import {extractComponentProps} from '../componentUpdater';
import {formatNumbers, sameMonth} from '../dateutils';
import Calendar, {CalendarProps} from '../calendar';
import styleConstructor from './style';
import {getCalendarDateString} from '../services';

export type CalendarListItemProps = CalendarProps & {
  item: any;
  calendarWidth?: number;
  calendarHeight?: number;
  horizontal?: boolean;
  theme?: Theme;
  scrollToMonth?: (date: XDate) => void;
};

type CalendarListItemState = {
  hideArrows: boolean;
  hideExtraDays: boolean;
};

class CalendarListItem extends Component<CalendarListItemProps, CalendarListItemState> {
  static displayName = 'CalendarListItem';

  static propTypes = {
    ...Calendar.propTypes,
    item: PropTypes.any,
    calendarWidth: PropTypes.number,
    calendarHeight: PropTypes.number,
    horizontal: PropTypes.bool
  };

  static defaultProps = {
    hideArrows: true,
    hideExtraDays: true
  };

  style: any;

  constructor(props: CalendarListItemProps) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: CalendarListItemProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;

    return !sameMonth(r1, r2) || !!(r2.propBump && r2.propBump !== r1.propBump);
  }

  onPressArrowLeft = (_: any, month: any) => {
    const {onPressArrowLeft, scrollToMonth} = this.props;
    const monthClone = month.clone();

    if (onPressArrowLeft) {
      onPressArrowLeft(_, monthClone);
    } else if (scrollToMonth) {
      const currentMonth = monthClone.getMonth();
      monthClone.addMonths(-1);

      // Make sure we actually get the previous month, not just 30 days before currentMonth.
      while (monthClone.getMonth() === currentMonth) {
        monthClone.setDate(monthClone.getDate() - 1);
      }

      scrollToMonth(monthClone);
    }
  };

  onPressArrowRight = (_: any, month: any) => {
    const {onPressArrowRight, scrollToMonth} = this.props;
    const monthClone = month.clone();

    if (onPressArrowRight) {
      onPressArrowRight(_, monthClone);
    } else if (scrollToMonth) {
      monthClone.addMonths(1);
      scrollToMonth(monthClone);
    }
  };

  getCalendarStyle = memoize((width, height, style) => {
    return [{width, minHeight: height}, this.style.calendar, style];
  });

  render() {
    const {
      item,
      horizontal,
      calendarHeight,
      calendarWidth,
      testID,
      style,
      headerStyle,
      onPressArrowLeft,
      onPressArrowRight,
      // @ts-expect-error
      context
    } = this.props;
    const calendarProps = extractComponentProps(Calendar, this.props);
    const calStyle = this.getCalendarStyle(calendarWidth, calendarHeight, style);

    if (item.getTime) {
      return (
        <Calendar
          {...calendarProps}
          testID={testID}
          current={getCalendarDateString(item.toString())}
          style={calStyle}
          headerStyle={horizontal ? headerStyle : undefined}
          disableMonthChange
          onPressArrowLeft={horizontal ? this.onPressArrowLeft : onPressArrowLeft}
          onPressArrowRight={horizontal ? this.onPressArrowRight : onPressArrowRight}
          context={context}
        />
      );
    } else {
      const text = formatNumbers(item.toString());

      return (
        <View style={[{height: calendarHeight, width: calendarWidth}, this.style.placeholder]}>
          <Text allowFontScaling={false} style={this.style.placeholderText}>
            {text}
          </Text>
        </View>
      );
    }
  }
}

export default CalendarListItem;
