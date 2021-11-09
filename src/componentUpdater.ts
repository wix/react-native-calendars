const get = require('lodash/get');
const omit = require('lodash/omit');
const pickBy = require('lodash/pickBy');
const isEqual = require('lodash/isEqual');
const includes = require('lodash/includes');


export function shouldUpdate(props: any, newProps: any, paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
    const equals = isEqual(get(props, paths[i]), get(newProps, paths[i]));
    if (!equals) {
      return true;
    }
  }
  return false;
}

export function extractComponentProps(component: any, props: any, ignoreProps?: string[]) {
  const componentPropTypes = component.propTypes;
  if (componentPropTypes) {
    const keys = Object.keys(componentPropTypes);
    const componentProps = omit(
      pickBy(props, (_value: any, key: any) => includes(keys, key)),
      ignoreProps
    );
    return componentProps;
  }
  return {};
}
