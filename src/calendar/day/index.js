<<<<<<< HEAD:src/calendar/day/index.js
import _ from 'lodash';
=======
import omit from 'lodash/omit';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';

import React, {Component} from 'react';

<<<<<<< HEAD:src/calendar/day/index.js
import {shouldUpdate} from '../../component-updater';
import dateutils from '../../dateutils';
import {xdateToData} from '../../interface';
=======
import {shouldUpdate} from '../../componentUpdater';
import {formatNumbers, isToday} from '../../dateutils';
import {xdateToData} from '../../interface';
import {getDefaultLocale} from '../../services';
// @ts-expect-error
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
import {SELECT_DATE_SLOT} from '../../testIDs';
import BasicDay from './basic';
import PeriodDay from './period';
<<<<<<< HEAD:src/calendar/day/index.js

const basicDayProps = _.omit(BasicDay.propTypes, 'date');

export default class Day extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    ...basicDayProps,
    /** The day to render */
=======
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
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
    day: PropTypes.object,
    dayComponent: PropTypes.any
  };

  shouldComponentUpdate(nextProps) {
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

  getMarkingLabel(marking) {
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
<<<<<<< HEAD:src/calendar/day/index.js
    const today = XDate.locales[XDate.defaultLocale].today;
    const formatAccessibilityLabel = XDate.locales[XDate.defaultLocale].formatAccessibilityLabel;
=======
    const today = getDefaultLocale().today || 'today';
    const formatAccessibilityLabel = getDefaultLocale().formatAccessibilityLabel || 'dddd d MMMM yyyy';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
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
<<<<<<< HEAD:src/calendar/day/index.js
    const date = xdateToData(day);
    const isToday = dateutils.isToday(day);
    const Component = this.getDayComponent();
    const dayProps = _.omit(this.props, 'day');
    const accessibilityLabel = this.getAccessibilityLabel(day, marking, isToday);
  
=======
    const date = day && xdateToData(day);
    const _isToday = day ? isToday(day) : undefined;
    const Component = this.getDayComponent();
    const dayProps = omit(this.props, 'day');
    const accessibilityLabel = this.getAccessibilityLabel(day, marking, _isToday);

>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
    return (
      <Component
        {...dayProps}
        date={date}
        testID={`${SELECT_DATE_SLOT}-${date?.dateString}`}
        accessibilityLabel={accessibilityLabel}
      >
<<<<<<< HEAD:src/calendar/day/index.js
        {date ? day.getDate() : day}
=======
        {formatNumbers(day?.getDate())}
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/calendar/day/index.tsx
      </Component>
    );
  }
}
