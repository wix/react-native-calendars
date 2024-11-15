import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import some from 'lodash/some';
import XDate from 'xdate';
import React, { useMemo } from 'react';
import { formatNumbers, isToday } from '../../dateutils';
import { getDefaultLocale } from '../../services';
import { xdateToData } from '../../interface';
import BasicDay from './basic';
import PeriodDay from './period';
function areEqual(prevProps, nextProps) {
    const prevPropsWithoutMarkDates = omit(prevProps, 'marking');
    const nextPropsWithoutMarkDates = omit(nextProps, 'marking');
    const didPropsChange = some(prevPropsWithoutMarkDates, function (value, key) {
        return value !== nextPropsWithoutMarkDates[key];
    });
    const isMarkingEqual = isEqual(prevProps.marking, nextProps.marking);
    return !didPropsChange && isMarkingEqual;
}
const Day = React.memo((props) => {
    const { date, marking, dayComponent, markingType } = props;
    const _date = date ? new XDate(date) : undefined;
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
        const formatAccessibilityLabel = getDefaultLocale().formatAccessibilityLabel || 'dddd d MMMM yyyy';
        return `${_isToday ? today : ''} ${_date?.toString(formatAccessibilityLabel)} ${markingAccessibilityLabel}`;
    }, [_date, marking, _isToday]);
    const Component = dayComponent || (markingType === 'period' ? PeriodDay : BasicDay);
    const dayComponentProps = dayComponent ? { date: xdateToData(date || new XDate()) } : undefined;
    return (
    //@ts-expect-error
    <Component {...props} accessibilityLabel={getAccessibilityLabel} {...dayComponentProps}>
      {formatNumbers(_date?.getDate())}
    </Component>);
}, areEqual);
export default Day;
Day.displayName = 'Day';
