import _ from 'lodash';
import {ComponentDriver, RenderedNode} from 'react-component-driver';
import Day, {BasicDayProps} from '.';
// @ts-expect-error
import {extractStyles} from '../../../../test';

export class BasicDayDriver extends ComponentDriver<BasicDayProps> {
  constructor() {
    super(Day);
  }

  tap() {
    _.get(this.getComponent(), 'props.onClick');
    return this;
  }

  getAccessibilityLabel() {
    return _.get(this.getComponent(), 'props.accessibilityLabel.trim')();
  }

  getStyle() {
    return extractStyles(this.getComponent());
  }

  getTextView() {
    return _.get(this.getComponent(), 'children.find')((node: RenderedNode) => node.type === 'Text');
  }

  getTextStyle() {
    return extractStyles(this.getTextView());
  }
}
