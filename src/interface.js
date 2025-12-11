const XDate = require('xdate');
export function padNumber(n) {
    if (n < 10) {
        return '0' + n;
    }
    return n;
}
export function xdateToData(date) {
    const d = date instanceof XDate ? date : new XDate(date);
    const dateString = toMarkingFormat(d);
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        timestamp: new XDate(dateString, true).getTime(),
        dateString: dateString
    };
}
export function parseDate(d) {
    if (!d) {
        return;
    }
    else if (d.timestamp) {
        // conventional data timestamp
        return new XDate(d.timestamp, true);
    }
    else if (d instanceof XDate) {
        // xdate
        return new XDate(toMarkingFormat(d), true);
    }
    else if (d.getTime) {
        // javascript date
        const dateString = d.getFullYear() + '-' + padNumber(d.getMonth() + 1) + '-' + padNumber(d.getDate());
        return new XDate(dateString, true);
    }
    else if (d.year) {
        const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
        return new XDate(dateString, true);
    }
    else if (d) {
        // timestamp number or date formatted as string
        return new XDate(d, true);
    }
}
export function toMarkingFormat(d) {
    if (!isNaN(d.getTime())) {
        const year = `${d.getFullYear()}`;
        const month = d.getMonth() + 1;
        const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
        const day = d.getDate();
        const doubleDigitDay = day < 10 ? `0${day}` : `${day}`;
        return year + '-' + doubleDigitMonth + '-' + doubleDigitDay;
    }
    return 'Invalid Date';
}
