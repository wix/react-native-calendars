const { isToday, isDateNotInRange, sameMonth } = require('./dateutils');
// const {toMarkingFormat} = require('./interface');
export function getState(day, current, props) {
    const { minDate, maxDate, disabledByDefault, context } = props;
    let state = '';
    if ((context?.date ?? current === day)) {
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
    return state;
}
