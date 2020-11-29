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

function extractComponentProps(component, props, ignoreProps) {
  const componentPropTypes = component.propTypes;
  const componentProps = _.chain(props)
    .pickBy((_value, key) => _.includes(Object.keys(componentPropTypes), key))
    .omit(ignoreProps)
    .value();

  return componentProps;
}

module.exports = {
  shouldUpdate,
  extractComponentProps
};
