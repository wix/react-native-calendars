import { render, act } from '@testing-library/react-native';
//@ts-ignore
import { swipeDirections } from 'react-native-swipe-gestures';
import { DayDriver } from './day/driver';
import { CalendarHeaderDriver } from './header/driver';
export class CalendarDriver {
    testID;
    element;
    renderTree;
    constructor(element) {
        this.element = element;
        this.renderTree = render(element);
        this.testID = element.props.testID;
    }
    /** Days */
    getDay(date) {
        return new DayDriver(this.element, `${this.testID}.day_${date}`);
    }
    getTextValues(elements) {
        const values = elements.map(element => {
            const testID = element.props.testID;
            if (testID?.endsWith('.text')) {
                return this.renderTree.getByTestId(testID).children[0];
            }
        });
        return values.filter(value => !!value);
    }
    getDays() {
        return this.getTextValues(this.renderTree.queryAllByTestId(/day_/));
    }
    getWeekNumbers() {
        return this.getTextValues(this.renderTree.queryAllByTestId(/weekNumber_/));
    }
    /** Header */
    getHeader() {
        return new CalendarHeaderDriver(this.element, `${this.testID}.header`);
    }
    /** GestureRecognizer */
    queryElement(testID) {
        const elements = this.renderTree.queryAllByTestId(testID);
        if (elements.length > 1) {
            console.warn(`Found more than one element with testID: ${testID}`);
        }
        return elements?.[0];
    }
    isRootGestureRecognizer() {
        const node = this.queryElement(`${this.testID}.container`);
        return !!node?.props?.onSwipe;
    }
    swipe(direction) {
        // direction === 'left' ? this.getHeader().tapLeftArrow() : this.getHeader().tapRightArrow();
        const node = this.queryElement(`${this.testID}.container`);
        // console.log(this.element.props, tree?.props?.onSwipe);
        // tree?.props?.onSwipe?.(direction);
        // act(() => fireEvent(tree, 'onSwipe', direction));
        act(() => node?.props?.onSwipe?.(direction));
        // fireEvent(tree, 'onSwipe', direction);
    }
    swipeLeft() {
        this.swipe(swipeDirections.SWIPE_LEFT);
    }
    swipeRight() {
        this.swipe(swipeDirections.SWIPE_RIGHT);
    }
}
