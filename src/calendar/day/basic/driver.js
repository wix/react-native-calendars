import {render, fireEvent} from '@testing-library/react-native';
import {extractStyles} from '../../../testUtils';

export class BasicDayDriver {
  constructor(element) {
    this.element = element;
    this.renderTree = render(element);
    this.testID = element.props.testID;
  }

  getProps() {
    return this.element.props;
  }

  getAccessibilityLabel() {
    return this.getProps().accessibilityLabel.trim();
  }

  getStyle() {
    return extractStyles(this.element);
  }

  getText() {
    return this.renderTree.getByTestId(`${this.testID}.text`).children[0];
  }

  getTextStyle() {
    return extractStyles(this.getText());
  }

  press() {
    fireEvent.press(this.element);
    return this;
  }
}
