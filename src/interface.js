const moment = require('momoent');

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function momentToData(momentObject) {
  const dateString = momentObject.format('yyyy-MM-dd');
  return {
    year: momentObject.getFullYear(),
    month: momentObject.getMonth() + 1,
    day: momentObject.getDate(),
    timestamp: momentObject(dateString, true).getTime(),
    dateString: dateString
  };
}
function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return moment(d.timestamp, true);
  } else if (d instanceof moment) { // moment
    return moment(d.toString('yyyy-MM-dd'), true);
  } else if (d.getTime) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return moment(dateString, true);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return moment(dateString, true);
  } else if (d) { // timestamp number or date formatted as string
    return moment(d, true);
  }
}

module.exports = {
  momentToData,
  parseDate
};

