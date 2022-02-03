const _ = require('lodash');


export function shouldUpdate(props: any, newProps: any, paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
<<<<<<< HEAD:src/component-updater.js
    const equals = _.isEqual(_.get(a, paths[i]), _.get(b, paths[i]));
=======
    const equals = isEqual(get(props, paths[i]), get(newProps, paths[i]));
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/componentUpdater.ts
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
<<<<<<< HEAD:src/component-updater.js
    const componentProps = _.chain(props)
      .pickBy((_value, key) => _.includes(keys, key))
      .omit(ignoreProps)
      .value();
=======
    const componentProps = omit(
      pickBy(props, (_value: any, key: any) => includes(keys, key)),
      ignoreProps
    );
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/componentUpdater.ts
    return componentProps;
  }
  return {};
}
