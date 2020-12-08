import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component} from 'react';
import {shouldUpdate, extractComponentProps} from '../../component-updater';
import {xdateToData} from '../../interface';
import {SELECT_DATE_SLOT} from '../../testIDs';
import Day from './basic';
import PeriodDay from './period';


export default class DayComp extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    day: PropTypes.object,
    state: PropTypes.string, // deprecate ???
    markingType: PropTypes.string,
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    dayComponent: PropTypes.any,
    disableAllTouchEventsForDisabledDays: PropTypes.bool,
    disabledByDefault: PropTypes.bool
  };

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['day', 'markingType', 'marking', 'onPress', 'onLongPress']);
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

  getAccessibilityLabel = (day) => {
    const {state} = this.props;
    const today = XDate.locales[XDate.defaultLocale].today;
    const isToday = state === 'today'; //TODO: check if 'day' equals 'today' and remove 'state' check
    const formatAccessibilityLabel = XDate.locales[XDate.defaultLocale].formatAccessibilityLabel;
    const markingLabel = this.getMarkingLabel(day);

    if (formatAccessibilityLabel) {
      return `${isToday ? today : ''} ${day.toString(formatAccessibilityLabel)} ${markingLabel}`;
    }

    return `${isToday ? 'today' : ''} ${day.toString('dddd d MMMM yyyy')} ${markingLabel}`;
  };

  getDayComponent() {
    const {dayComponent, markingType} = this.props;

    if (dayComponent) {
      return dayComponent;
    }
    return markingType === 'period' ? PeriodDay : Day;
  }

  render() {
    const {day} = this.props;
    const dateAsObject = xdateToData(day);
    const Component = this.getDayComponent();
    const dayProps = extractComponentProps(Component, this.props);

    return (
      <Component
          {...dayProps}
          date={dateAsObject}
          testID={`${SELECT_DATE_SLOT}-${dateAsObject.dateString}`}
          accessibilityLabel={this.getAccessibilityLabel(day)}
        >
          {dateAsObject ? day.getDate() : day}
      </Component>
    );
  }
}
