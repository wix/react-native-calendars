const { isToday, isDateNotInRange, sameMonth } = require('./dateutils');
// const {toMarkingFormat} = require('./interface');
//@ts-ignore
export function getState(day, current, props, disableDaySelection) {
    var _a;
    const { minDate, maxDate, disabledByDefault, context } = props;
    let state = '';
    if (((_a = context === null || context === void 0 ? void 0 : context.date) !== null && _a !== void 0 ? _a : current === day)) {
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
