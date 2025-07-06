import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import some from 'lodash/some';
import React, {useMemo} from 'react';

import {dateToData, formatDate, formatNumbers, getCurrentDate, getDate, getDayOfMonth, isToday} from '../../dateutils';
import {getDefaultLocale} from '../../services';
import type {DateData} from '../../types';
import BasicDay, {type BasicDayProps} from './basic';
import PeriodDay from './period';

function areEqual(prevProps: DayProps, nextProps: DayProps) {
  const prevPropsWithoutMarkDates = omit(prevProps, 'marking');
  const nextPropsWithoutMarkDates = omit(nextProps, 'marking');
  const didPropsChange = some(prevPropsWithoutMarkDates, (value, key) => value !== nextPropsWithoutMarkDates[key]);
  const isMarkingEqual = isEqual(prevProps.marking, nextProps.marking);
  return !didPropsChange && isMarkingEqual;
}

export interface DayProps extends BasicDayProps {
  /** Provide custom day rendering component */
  dayComponent?: React.ComponentType<DayProps & {date?: DateData}>; // TODO: change 'date' prop type to string by removing it from overriding BasicDay's 'date' prop (breaking change for V2)
}

const Day = React.memo((props: DayProps) => {
  const {date, marking, dayComponent, markingType} = props;
  const _date = date ? getDate(date) : undefined;
  const _isToday = isToday(_date);

  const markingAccessibilityLabel = useMemo(() => {
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
    const formatAccessibilityLabel = getDefaultLocale().formatAccessibilityLabel || 'dddd D MMMM YYYY';

    return `${_isToday ? today : ''} ${formatDate(_date, formatAccessibilityLabel)} ${markingAccessibilityLabel}`;
  }, [_date, marking, _isToday]);

  const Component = dayComponent || (markingType === 'period' ? PeriodDay : BasicDay);
  const dayComponentProps = dayComponent ? {date: dateToData(date || getCurrentDate())} : undefined;

  return (
    //@ts-expect-error
    <Component {...props} accessibilityLabel={getAccessibilityLabel} {...dayComponentProps}>
      {formatNumbers(getDayOfMonth(_date))}
    </Component>
  );
}, areEqual);

export default Day;

Day.displayName = 'Day';
