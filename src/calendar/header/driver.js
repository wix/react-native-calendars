import { render, fireEvent } from '@testing-library/react-native';
export class CalendarHeaderDriver {
    testID;
    element;
    renderTree;
    constructor(element, testID) {
        this.element = element;
        this.renderTree = render(element);
        this.testID = testID || element.props.testID;
    }
    isTextExists(text) {
        let node;
        try {
            node = this.renderTree.queryByText(text);
        }
        catch (e) {
            return false;
        }
        return !!node;
    }
    getTitle() {
        let node;
        try {
            node = this.renderTree.getByTestId(`${this.testID}.title`).children[0];
        }
        catch (e) {
            return;
        }
        return node;
    }
    getDayNames() {
        const names = this.renderTree.queryAllByTestId(/dayName_/);
        return names.map(name => name.children.join(''));
    }
    getLoadingIndicator() {
        let node;
        try {
            node = this.renderTree.getByTestId(`${this.testID}.loader`);
        }
        catch (e) {
            return;
        }
        return node;
    }
    getLeftArrow() {
        let node;
        try {
            node = this.renderTree.getByTestId(`${this.testID}.leftArrow`);
        }
        catch (e) {
            return;
        }
        return node;
    }
    getRightArrow() {
        let node;
        try {
            node = this.renderTree.getByTestId(`${this.testID}.rightArrow`);
        }
        catch (e) {
            return;
        }
        return node;
    }
    tapLeftArrow() {
        const node = this.getLeftArrow();
        if (!node) {
            throw new Error('Left arrow not found.');
        }
        fireEvent.press(node);
    }
    tapRightArrow() {
        const node = this.getRightArrow();
        if (!node) {
            throw new Error('Right arrow not found.');
        }
        fireEvent.press(node);
    }
}
