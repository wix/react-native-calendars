import React, {Component} from 'react';
import {
  View
} from 'react-native';

import XDate from 'xdate';
import {calendar} from 'hotels-common';
import style from './style';
import Day from './day';
import UnitDay from './unit-day';
import CalendarHeader from './header';

class Calendar extends Component {
  constructor(props) {
    super(props);

    let currentMonth;
    if (props.current) {
      currentMonth = this.parseDate(props.current);
    } else {
      currentMonth = props.selected && props.selected[0] ? this.parseDate(props.selected[0]) : XDate();
    }
    this.state = {
      currentMonth
    };

    this.parseDate = this.parseDate.bind(this);
    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (nextProps.selected || []).reduce((prev, next, i) => {
      const currentSelected = (this.props.selected || [])[i];
      if (!currentSelected || !next || this.parseDate(currentSelected).getTime() !== this.parseDate(next).getTime()) {
        return {
          update: true,
          field: 'selected'
        };
      }
      return prev;
    }, {update: false});

    shouldUpdate = ['markedDates'].reduce((prev, next) => {
      if (!prev.update && nextProps[next] !== this.props[next]) {
        return {
          update: true,
          field: next
        };
      }
      return prev;
    }, shouldUpdate);

    shouldUpdate = ['minDate', 'current'].reduce((prev, next) => {
      const prevDate = this.parseDate(this.props[next]);
      const nextDate = this.parseDate(nextProps[next]);
      if (prev.update) {
        return prev;
      } else if (prevDate !== nextDate) {
        if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
          return prev;
        } else {
          return {
            update: true,
            field: next
          };
        }
      }
      return prev;
    }, shouldUpdate);

    if (nextState.currentMonth !== this.state.currentMonth) {
      shouldUpdate = {
        update: true,
        field: 'current'
      };
    }
    //console.log(shouldUpdate.field, shouldUpdate.update);
    return shouldUpdate.update;
  }

  parseDate(d) {
    if (d) {
      return XDate(d);
    }
  }

  componentWillReceiveProps(nextProps) {
    const current= this.parseDate(nextProps.current);
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
          this.props.onMonthChange(currMont);
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([currMont]);
        }
      }
    });
  }

  pressDay(day) {
    const minDate = this.parseDate(this.props.minDate);
    if (!minDate || calendar.calutils.isGTE(day, minDate)) {
      this.updateMonth(day);
      if (this.props.onDayPress) {
        this.props.onDayPress(day.clone());
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
      if (calendar.calutils.sameDate(day, this.parseDate(selectedDays[i]))) {
        return true;
      }
    }
    return false;
  }

  renderDay(day, id) {
    const minDate = this.parseDate(this.props.minDate);
    let state = '';
    if (this.isSelected(day)) {
      state = 'selected';
    } else if (minDate && !calendar.calutils.isGTE(day, minDate)) {
      state = 'disabled';
    } else if (!calendar.calutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (calendar.calutils.sameDate(day, XDate())) {
      state = 'today';
    }
    let dayComp;
    if (!calendar.calutils.sameMonth(day, this.state.currentMonth) && this.props.hideExtraDays) {
      if (this.props.markingType === 'interactive') {
        dayComp = (<View key={id} style={{flex: 1}}/>);
      } else {
        dayComp = (<View key={id} style={{width: 32}}/>);
      }
    } else {
      const DayComp = this.props.markingType === 'interactive' ? UnitDay : Day;
      dayComp = (
        <DayComp
          key={id}
          state={state}
          onPress={this.pressDay.bind(this, day)}
          marked={this.getDateMarking(day)}
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
    return (<View style={style.week} key={id}>{week}</View>);
  }

  render() {
    //console.log('render calendar ' + this.props.current.toString('yyyy-MM'));
    const days = calendar.calutils.page(this.state.currentMonth);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = this.parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
      <View style={[style.container, this.props.style]}>
        <CalendarHeader
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
