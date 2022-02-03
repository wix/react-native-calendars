import XDate from 'xdate';
import React, {PureComponent} from 'react';
import {View} from 'react-native';

<<<<<<< HEAD:src/expandableCalendar/week.js
import dateutils from '../dateutils';
import {parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractComponentProps} from '../component-updater';
=======
import {getWeekDates, sameMonth} from '../dateutils';
import {parseDate, toMarkingFormat} from '../interface';
import {getState} from '../day-state-manager';
import {extractComponentProps} from '../componentUpdater';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/week.tsx
import styleConstructor from './style';
import Calendar from '../calendar';
import Day from '../calendar/day/index';
// import BasicDay from '../calendar/day/basic';

<<<<<<< HEAD:src/expandableCalendar/week.js
class Week extends PureComponent {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Calendar.propTypes,
    /** the current date */
    current: PropTypes.any
=======

export type WeekProps = CalendarProps;

class Week extends PureComponent<WeekProps> {
  static displayName = 'Week';

  static propTypes = {
    ...Calendar.propTypes
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/week.tsx
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

<<<<<<< HEAD:src/expandableCalendar/week.js
  getWeek(date) {
    return dateutils.getWeekDates(date, this.props.firstDay);
=======
  getWeek(date?: string) {
    if (date) {
      return getWeekDates(date, this.props.firstDay);
    }
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/week.tsx
  }

  // renderWeekNumber (weekNumber) {
  //   return <BasicDay key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</BasicDay>;
  // }

  renderDay(day, id) {
    const {current, hideExtraDays, markedDates} = this.props;
    const dayProps = extractComponentProps(Day, this.props);
    const currXdate = parseDate(current);
    
    // hide extra days
    if (current && hideExtraDays) {
<<<<<<< HEAD:src/expandableCalendar/week.js
      if (!dateutils.sameMonth(day, parseDate(current))) {
        return <View key={id} style={this.style.emptyDayContainer} />;
=======
      if (!sameMonth(day, currXdate)) {
        return <View key={id} style={this.style.emptyDayContainer}/>;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/expandableCalendar/week.tsx
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
