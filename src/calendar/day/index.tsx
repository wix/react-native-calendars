import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import React, {Component} from 'react';

import {shouldUpdate} from '../../componentUpdater';
import {formatNumbers, isToday} from '../../dateutils';
import {xdateToData} from '../../interface';
import {getDefaultLocale} from '../../services';
// @ts-expect-error
import {SELECT_DATE_SLOT} from '../../testIDs';
import BasicDay, {BasicDayProps} from './basic';
import PeriodDay from './period';
import {MarkingProps} from './marking';
import {DateData} from '../../types';

const basicDayPropsTypes = omit(BasicDay.propTypes, 'date');

export interface DayProps extends Omit<BasicDayProps, 'date'> {
  /** The day to render */
  day?: XDate;
  /** Provide custom day rendering component */
  dayComponent?: React.ComponentType<DayProps & {date?: DateData}>;
}

export default class Day extends Component<DayProps> {
  static displayName = 'Day';

  static propTypes = {
    ...basicDayPropsTypes,
    day: PropTypes.object,
    dayComponent: PropTypes.any
  };

  shouldComponentUpdate(nextProps: DayProps) {
    return shouldUpdate(this.props, nextProps, [
      'day',
      'dayComponent',
      'state',
      'markingType',
      'marking',
      'onPress',
      'onLongPress'
    ]);
  }

  getMarkingLabel(marking: MarkingProps) {
    let label = '';

    if (marking) {
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
    }
    return label;
  }

  getAccessibilityLabel = memoize((day, marking, isToday) => {
    const today = getDefaultLocale().today || 'today';
    const formatAccessibilityLabel = getDefaultLocale().formatAccessibilityLabel || 'dddd d MMMM yyyy';
    const markingLabel = this.getMarkingLabel(marking);

    return `${isToday ? today : ''} ${day.toString(formatAccessibilityLabel)} ${markingLabel}`;
  });

  getDayComponent() {
    const {dayComponent, markingType} = this.props;

    if (dayComponent) {
      return dayComponent;
    }
    return markingType === 'period' ? PeriodDay : BasicDay;
  }

  render() {
    const {day, marking} = this.props;
    const date = day && xdateToData(day);
    const _isToday = day ? isToday(day) : undefined;
    const Component = this.getDayComponent();
    const dayProps = omit(this.props, 'day');
    const accessibilityLabel = this.getAccessibilityLabel(day, marking, _isToday);

    return (
      <Component
        {...dayProps}
        date={date}
        testID={`${SELECT_DATE_SLOT}-${date?.dateString}`}
        accessibilityLabel={accessibilityLabel}
      >
        {formatNumbers(day?.getDate())}
      </Component>
    );
  }
}
