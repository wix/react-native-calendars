import React, {Component} from 'react';
import {
  View
} from 'react-native';

import autobind from 'react-autobind';

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
      currentMonth = props.current.clone();
    } else {
      currentMonth = props.selected && props.selected[0] ? props.selected[0].clone() : XDate();
    }
    this.state = {
      currentMonth
    };

    autobind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (nextProps.selected || []).reduce((prev, next, i) => {
      const currentSelected = (this.props.selected || [])[i];
      if (!currentSelected || !next || currentSelected.getTime() !== next.getTime()) {
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
      const prevDate = this.props[next];
      const nextDate = nextProps[next];
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.current && nextProps.current.toString('yyyy MM') !== this.state.currentMonth.toString('yyyy MM')) {
      this.setState({
        currentMonth: nextProps.current.clone()
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
    if (!this.props.minDate || calendar.calutils.isGTE(day, this.props.minDate)) {
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
      if (calendar.calutils.sameDate(day, selectedDays[i])) {
        return true;
      }
    }
    return false;
  }

  renderDay(day, id) {
    let state = '';
    if (this.isSelected(day)) {
      state = 'selected';
    } else if (this.props.minDate && !calendar.calutils.isGTE(day, this.props.minDate)) {
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
    if (this.props.current) {
      const lastMonthOfDay = this.props.current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
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
