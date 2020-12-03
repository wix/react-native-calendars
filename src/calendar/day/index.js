import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component} from 'react';
import {shouldUpdate} from '../../component-updater';
import {xdateToData} from '../../interface';
import {SELECT_DATE_SLOT} from '../../testIDs';
// import styleConstructor from './style';
import Day from './basic';
import PeriodDay from './period';
import MultiDotDay from './multi-dot';
import MultiPeriodDay from './multi-period';
import CustomDay from './custom';


export default class DayComp extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    date: PropTypes.object,
    state: PropTypes.string, //TODO: deprecate??
    markingType: PropTypes.string,
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    disableAllTouchEventsForDisabledDays: PropTypes.bool,
    disabledByDefault: PropTypes.bool
  };

  // constructor(props) {
  //   super(props);
    
  //   this.style = styleConstructor(props.theme);
  // }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['date', 'markingType', 'marking', 'onPress', 'onLongPress']);
  }

  getMarkingLabel() {
    const {marking} = this.props;
    let label = '';

    if (marking.accessibilityLabel) {
      return marking.accessibilityLabel;
    }

    if (marking.selected) {
      label += 'selected ';
      if (!marking.marked) {
        label += 'You have no entries for this day ';
      }
    }
    if (marking.marked) {
      label += 'You have entries for this day ';
    }
    if (marking.startingDay) {
      label += 'period start ';
    }
    if (marking.endingDay) {
      label += 'period end ';
    }
    if (marking.disabled || marking.disableTouchEvent) {
      label += 'disabled ';
    }
    return label;
  }

  getAccessibilityLabel = (state, date) => {
    const today = XDate.locales[XDate.defaultLocale].today;
    const formatAccessibilityLabel = XDate.locales[XDate.defaultLocale].formatAccessibilityLabel;
    const isToday = state === 'today';
    const markingLabel = this.getMarkingLabel(date);

    if (formatAccessibilityLabel) {
      return `${isToday ? today : ''} ${date.toString(formatAccessibilityLabel)} ${markingLabel}`;
    }

    return `${isToday ? 'today' : ''} ${date.toString('dddd d MMMM yyyy')} ${markingLabel}`;
  };

  getDayComponent() {
    const {dayComponent, markingType} = this.props;

    if (dayComponent) {
      return dayComponent;
    }

    switch (markingType) {
      case 'period':
        return PeriodDay;
      case 'multi-dot':
        return MultiDotDay;
      case 'multi-period':
        return MultiPeriodDay;
      case 'custom':
        return CustomDay;
      default:
        return Day;
    }
  }

  render() {
    const {date, state, marking, theme, disableAllTouchEventsForDisabledDays, onPress, onLongPress} = this.props;
    const dateAsObject = xdateToData(date);
    const Component = this.getDayComponent();
    
    return (
      <Component
          date={date}
          theme={theme}
          testID={`${SELECT_DATE_SLOT}-${dateAsObject.dateString}`}
          accessibilityLabel={this.getAccessibilityLabel(state, date)}
          state={state}
          marking={marking}
          onPress={onPress}
          onLongPress={onLongPress}
          disableAllTouchEventsForDisabledDays={disableAllTouchEventsForDisabledDays}
        >
          {dateAsObject ? date.getDate() : date}
      </Component>
    );
  }
}
