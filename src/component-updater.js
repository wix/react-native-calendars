const _ = require('lodash');

function shouldUpdate(a, b, paths) {
  for (let i = 0; i < paths.length; i++) {
    const equals = _.isEqual(_.get(a, paths[i]), _.get(b, paths[i]));
    if (!equals) {
      return true;
    }
  }
  return false;
}

module.exports = {
  shouldUpdate
};
