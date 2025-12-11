const { isToday, isDateNotInRange, sameMonth } = require('./dateutils');
const { toMarkingFormat } = require('./interface');
export function getState(day, current, props, disableDaySelection) {
    const { minDate, maxDate, disabledByDefault, disabledByWeekDays, context } = props;
    let state;
    if (!disableDaySelection && (context?.selectedDate ?? toMarkingFormat(current)) === toMarkingFormat(day)) {
        state = 'selected';
    }
    else if (isToday(day)) {
        state = 'today';
    }
    else if (disabledByDefault) {
        state = 'disabled';
    }
    else if (isDateNotInRange(day, minDate, maxDate)) {
        state = 'disabled';
    }
    else if (!sameMonth(day, current)) {
        state = 'disabled';
    }
    else if (disabledByWeekDays && disabledByWeekDays.indexOf(day.getDay()) !== -1) {
        state = 'disabled';
    }
    return state;
}
