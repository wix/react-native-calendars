import {render, fireEvent} from '@testing-library/react-native';
import {extractStyles} from '../../testUtils';

export class DayDriver {
  testID: string;
  element: React.ReactElement;
  renderTree: ReturnType<typeof render>;

  constructor(element, testID) {
    this.element = element;
    this.renderTree = render(element);
    this.testID = testID || element.props.testID;
  }

  getStyle() {
    return extractStyles(this.renderTree.getByTestId(this.testID));
  }

  getDayText() {
    return this.renderTree.getByTestId(`${this.testID}.text`).children.join('');
  }

  getTextStyle() {
    return extractStyles(this.renderTree.getByTestId(`${this.testID}.text`));
  }

  getAccessibilityLabel() {
    const node = this.renderTree.getByTestId(this.testID);
    return node?.props?.accessibilityLabel.trim();
  }

  tap() {
    const node = this.renderTree.getByTestId(this.testID);
    if (!node) {
      throw new Error('Day not found.');
    }
    fireEvent.press(node);
  }
}
