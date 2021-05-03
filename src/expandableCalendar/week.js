import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {PureComponent} from 'react';
import {View} from 'react-native';
import dateutils from '../dateutils';
import {parseDate} from '../interface';
import {extractComponentProps} from '../component-updater';
import styleConstructor from './style';
import Calendar from '../calendar';
import Day from '../calendar/day/index';
// import BasicDay from '../calendar/day/basic';

const EmptyArray = [];

class Week extends PureComponent {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Calendar.propTypes,
    /** the current date */
    current: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  getWeek(date) {
    return dateutils.getWeekDates(date, this.props.firstDay);
  }

  getDateMarking(day) {
    const {markedDates} = this.props;
    if (!markedDates) {
      return false;
    }

    const dates = markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  getState(day) {
    const {current, disabledByDefault} = this.props;
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';

    if (disabledByDefault) {
      state = 'disabled';
    } else if (dateutils.isDateNotInTheRange(minDate, maxDate, day)) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, parseDate(current))) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }
    return state;
  }

  // renderWeekNumber (weekNumber) {
  //   return <BasicDay key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>;
  // }

  renderDay(day, id) {
    const {current, hideExtraDays} = this.props;
    const dayProps = extractComponentProps(Day, this.props);

    // hide extra days
    if (current && hideExtraDays) {
      if (!dateutils.sameMonth(day, parseDate(current))) {
        return <View key={id} style={this.style.emptyDayContainer} />;
      }
    }

    return (
      <View style={this.style.dayContainer} key={id}>
        <Day
          {...dayProps}
          day={day}
          state={this.getState(day)}
          marking={this.getDateMarking(day)}
          onPress={this.props.onDayPress}
          onLongPress={this.props.onDayPress}
        />
      </View>
    );
  }

  render() {
    const {current} = this.props;
    const dates = this.getWeek(current);
    const week = [];

    if (dates) {
      dates.forEach((day, id) => {
        week.push(this.renderDay(day, id));
      }, this);
    }

    // if (this.props.showWeekNumbers) {
    //   week.unshift(this.renderWeekNumber(item[item.length - 1].getWeek()));
    // }

    return (
      <View style={this.style.container}>
        <View style={[this.style.week, this.props.style]}>{week}</View>
      </View>
    );
  }
}

export default Week;
