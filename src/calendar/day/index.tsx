import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {useMemo} from 'react';

import {formatNumbers, isToday} from '../../dateutils';
import {xdateToData} from '../../interface';
import {getDefaultLocale} from '../../services';
// @ts-expect-error
import {SELECT_DATE_SLOT} from '../../testIDs';
import {DateData} from '../../types';
import BasicDay, {BasicDayProps} from './basic';
import PeriodDay from './period';

const basicDayPropsTypes = omit(BasicDay.propTypes, 'date');

export interface DayProps extends Omit<BasicDayProps, 'date'> {
  /** The day to render */
  day?: XDate;
  /** Provide custom day rendering component */
  dayComponent?: React.ComponentType<DayProps & {date?: DateData}>;
}

const Day = (props: DayProps) => {
  const {day, marking, dayComponent, markingType} = props;
  const _isToday = day ? isToday(day) : undefined;

  const markingLabel = useMemo(() => {
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
  }, [marking]);

  const getAccessibilityLabel = useMemo(() => {
    const today = getDefaultLocale().today || 'today';
    const formatAccessibilityLabel = getDefaultLocale().formatAccessibilityLabel || 'dddd d MMMM yyyy';

    return `${_isToday ? today : ''} ${day?.toString(formatAccessibilityLabel)} ${markingLabel}`;
  }, [day, marking, _isToday]);

  const Component = useMemo(() => {
    if (dayComponent) {
      return dayComponent;
    }
    return markingType === 'period' ? PeriodDay : BasicDay;
  }, [dayComponent, markingType]);

  const dayProps = useMemo(() => {
    return omit(props, 'day');
  }, [day]);

  const date = useMemo(() => {
    return day && xdateToData(day);
  }, [day]);

  return (
    <Component
      {...dayProps}
      date={date}
      accessibilityLabel={getAccessibilityLabel}
      testID={`${SELECT_DATE_SLOT}-${date?.dateString}`}
    >
      {formatNumbers(day?.getDate())}
    </Component>
  );
};

export default Day;
Day.displayName = 'Day';
Day.propTypes = {
  ...basicDayPropsTypes,
  day: PropTypes.object,
  dayComponent: PropTypes.any
};
