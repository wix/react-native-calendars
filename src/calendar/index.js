import React, {Component} from 'react';
import {
  View
} from 'react-native';

import XDate from 'xdate';
import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day';
import UnitDay from './unit-day';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;
    if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth = props.selected && props.selected[0] ? parseDate(props.selected[0]) : XDate();
    }
    this.state = {
      currentMonth
    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
  }

  componentWillReceiveProps(nextProps) {
    const current= parseDate(nextProps.current);
    if (current && current.toString('yyyy MM') !== this.state.currentMonth.toString('yyyy MM')) {
      this.setState({
        currentMonth: current.clone()
      });
    }
  }

  updateMonth(day, doNotTriggerListeners) {
    if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
      return;
    }
    this.setState({
      currentMonth: day.clone()
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont)]);
        }
      }
    });
  }

  pressDay(day) {
    const minDate = parseDate(this.props.minDate);
    if (!minDate || dateutils.isGTE(day, minDate)) {
      this.updateMonth(day);
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day));
      }
    }
  }

  addMonth(count) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  isSelected(day) {
    let selectedDays = [];
    if (this.props.selected) {
      selectedDays = this.props.selected;
    }
    for (let i = 0; i < selectedDays.length; i++) {
      if (dateutils.sameDate(day, parseDate(selectedDays[i]))) {
        return true;
      }
    }
    return false;
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    let state = '';
    if (this.isSelected(day)) {
      state = 'selected';
    } else if (minDate && !dateutils.isGTE(day, minDate)) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }
    let dayComp;
    if (!dateutils.sameMonth(day, this.state.currentMonth) && this.props.hideExtraDays) {
      if (this.props.markingType === 'interactive') {
        dayComp = (<View key={id} style={{flex: 1}}/>);
      } else {
        dayComp = (<View key={id} style={{width: 32}}/>);
      }
    } else {
      const DayComp = this.props.markingType === 'interactive' ? UnitDay : Day;
      const markingExists = this.props.markedDates ? true : false;
      dayComp = (
        <DayComp
            key={id}
            state={state}
            theme={this.props.theme}
            onPress={this.pressDay.bind(this, day)}
            marked={this.getDateMarking(day)}
            markingExists={markingExists}
          >
            {day.getDate()}
          </DayComp>
        );
    }
    return dayComp;
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || [];
    if (dates.length) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);
    return (<View style={this.style.week} key={id}>{week}</View>);
  }

  render() {
    //console.log('render calendar ');
    const days = dateutils.page(this.state.currentMonth);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
        />
        {weeks}
      </View>);
  }
}

export default Calendar;
