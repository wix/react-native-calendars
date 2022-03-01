import XDate from 'xdate';
import React, {PureComponent} from 'react';
import {View} from 'react-native';

import {getWeekDates, sameMonth} from '../dateutils';
import {parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractComponentProps} from '../componentUpdater';
import styleConstructor from './style';
import Calendar, {CalendarProps} from '../calendar';
import Day from '../calendar/day/index';
// import BasicDay from '../calendar/day/basic';


export type WeekProps = CalendarProps;

class Week extends PureComponent<WeekProps> {
  static displayName = 'Week';

  static propTypes = {
    ...Calendar.propTypes
  };

  style = styleConstructor(this.props.theme);

  getWeek(date?: string) {
    if (date) {
      return getWeekDates(date, this.props.firstDay);
    }
  }

  // renderWeekNumber (weekNumber) {
  //   return <BasicDay key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</BasicDay>;
  // }

  renderDay(day: XDate, id: number) {
    const {current, hideExtraDays, markedDates} = this.props;
    const dayProps = extractComponentProps(Day, this.props);
    const currXdate = parseDate(current);
    
    // hide extra days
    if (current && hideExtraDays) {
      if (!sameMonth(day, currXdate)) {
        return <View key={id} style={this.style.emptyDayContainer}/>;
      }
    }

    return (
      <View style={this.style.dayContainer} key={id}>
        <Day
          {...dayProps}
          day={day}
          state={getState(day, currXdate, this.props)}
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
