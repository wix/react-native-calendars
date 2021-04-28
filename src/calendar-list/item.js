import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {extractComponentProps} from '../component-updater';
import Calendar from '../calendar';
import styleConstructor from './style';

class CalendarListItem extends Component {
  static displayName = 'IGNORE';

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

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;

    return r1.toString('yyyy MM') !== r2.toString('yyyy MM') || !!(r2.propbump && r2.propbump !== r1.propbump);
  }

  onPressArrowLeft = (_, month) => {
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

  onPressArrowRight = (_, month) => {
    const {onPressArrowRight, scrollToMonth} = this.props;
    const monthClone = month.clone();

    if (onPressArrowRight) {
      onPressArrowRight(_, monthClone);
    } else if (scrollToMonth) {
      monthClone.addMonths(1);
      scrollToMonth(monthClone);
    }
  };

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
      onPressArrowRight
    } = this.props;
    const calendarProps = extractComponentProps(Calendar, this.props);

    if (item.getTime) {
      return (
        <Calendar
          {...calendarProps}
          testID={testID}
          current={item}
          style={[{height: calendarHeight, width: calendarWidth}, this.style.calendar, style]}
          headerStyle={horizontal ? headerStyle : undefined}
          disableMonthChange
          onPressArrowLeft={horizontal ? this.onPressArrowLeft : onPressArrowLeft}
          onPressArrowRight={horizontal ? this.onPressArrowRight : onPressArrowRight}
        />
      );
    } else {
      const text = item.toString();

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
