let moment;

// Moment is an optional dependency
const getMoment = () => {
  if (!moment) {
    moment = require('moment');
  }

  return moment;
};

export {getMoment};
