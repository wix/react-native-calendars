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
  if (componentPropTypes) {
    const keys = Object.keys(componentPropTypes);
    const componentProps = _.chain(props)
      .pickBy((_value, key) => _.includes(keys, key))
      .omit(ignoreProps)
      .value();
    return componentProps;
  }
  return {};
}

module.exports = {
  shouldUpdate,
  extractComponentProps
};
