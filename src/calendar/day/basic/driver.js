import {ComponentDriver} from 'react-component-driver';
import Day from '.';
import {extractStyles} from '../../../../test';

export class BasicDayDriver extends ComponentDriver {
  constructor() {
    super(Day);
  }

  tap() {
    this.getComponent().props.onClick();
    return this;
  }

  getAccessibilityLabel() {
    return this.getComponent().props.accessibilityLabel.trim();
  }

  getStyle() {
    return extractStyles(this.getComponent());
  }

  getTextView() {
    return this.getComponent().children.find(node => node.type === 'Text');
  }

  getTextStyle() {
    return extractStyles(this.getTextView());
  }
}
