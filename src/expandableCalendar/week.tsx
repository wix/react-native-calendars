import PropTypes from 'prop-types';

import React, {PureComponent} from 'react';
import {View} from 'react-native';

// @ts-expect-error
import {getWeekDates, sameMonth} from '../dateutils';
// @ts-expect-error
import {parseDate, toMarkingFormat} from '../interface';
// @ts-expect-error
import {getState} from '../day-state-manager';
// @ts-expect-error
import {extractComponentProps} from '../component-updater';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import Day from '../calendar/day/index';
// import BasicDay from '../calendar/day/basic';


interface Props extends CalendarProps {
  current: XDate
}
export type WeekProps = Props;


class Week extends PureComponent<Props> {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Calendar.propTypes,
    current: PropTypes.any
  };

  style = styleConstructor(this.props.theme);

  getWeek(date: XDate) {
    return getWeekDates(date, this.props.firstDay);
  }

  // renderWeekNumber (weekNumber) {
  //   return <BasicDay key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</BasicDay>;
  // }

  renderDay(day: XDate, id: number) {
    const {current, hideExtraDays, markedDates} = this.props;
    const dayProps = extractComponentProps(Day, this.props);

    // hide extra days
    if (current && hideExtraDays) {
      if (!sameMonth(day, parseDate(current))) {
        return <View key={id} style={this.style.emptyDayContainer} />;
      }
    }

    return (
      <View style={this.style.dayContainer} key={id}>
        <Day
          {...dayProps}
          day={day}
          state={getState(day, parseDate(current), this.props)}
          marking={markedDates?.[toMarkingFormat(day)]}
          onPress={this.props.onDayPress}
          onLongPress={this.props.onDayPress}
        />
      </View>
    );
  }

  render() {
    const {current} = this.props;
    const dates = this.getWeek(current);
    const week: any[] = [];

    if (dates) {
      dates.forEach((day: XDate, id: number) => {
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
