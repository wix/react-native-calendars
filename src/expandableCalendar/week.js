import _ from 'lodash';
import React, {Component} from 'react';
import {
  Dimensions,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import {SELECT_DATE_SLOT} from '../testIDs';
import styleConstructor from './style';

import Day from '../calendar/day/basic';
import UnitDay from '../calendar/day/period';
import MultiDotDay from '../calendar/day/multi-dot';
import MultiPeriodDay from '../calendar/day/multi-period';
import SingleDay from '../calendar/day/custom';
import Calendar from '../calendar';


const SCREEN_WIDTH = Dimensions.get('window').width;
const EmptyArray = [];


class Week extends Component {
  static propTypes = {
    ...Calendar.propTypes,
    dates: PropTypes.array,
    index: PropTypes.number,
    currentMonth: PropTypes.string // for 'hideExtraDays'
  };

  constructor(props) {
    super(props);
    
    this.style = styleConstructor(this.props.theme);
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    case 'multi-period':
      return MultiPeriodDay;
    case 'custom':
      return SingleDay;
    default:
      return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }

    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  // renderWeekNumber (weekNumber) {
  //   return <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>;
  // }

  renderDay(day, id) {
    const {currentMonth, hideExtraDays} = this.props;
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, parseDate(currentMonth))) { // for extra days
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }

    // hide extra days
    if (currentMonth && hideExtraDays) {
      if (!dateutils.sameMonth(day, parseDate(currentMonth))) {
        return (<View key={id} style={{flex: 1}}/>);
      }
    }

    const DayComp = this.getDayComponent();
    const date = day.getDate();
    const dateAsObject = xdateToData(day);

    return (
      <View style={{flex: 1, alignItems: 'center'}} key={id}>
        <DayComp
          testID={`${SELECT_DATE_SLOT}-${dateAsObject.dateString}`}
          state={state}
          theme={this.props.theme}
          onPress={this.props.onDayPress}
          onLongPress={this.props.onDayPress}
          date={dateAsObject}
          marking={this.getDateMarking(day)}
        >
          {date}
        </DayComp>
      </View>
    );
  }

  render() {
    const week = [];
    if (this.props.dates) {
      this.props.dates.forEach((day, id) => {
        week.push(this.renderDay(day, id));
      }, this);
    }
    
    // if (this.props.showWeekNumbers) {
    //   week.unshift(this.renderWeekNumber(item[item.length - 1].getWeek()));
    // }

    return (
      <View style={[this.style.container, this.props.style]}>
        <View style={[this.style.week, {width: SCREEN_WIDTH}]} key={this.props.index}>{week}</View>
      </View>
    );
  }
}

export default Week;
