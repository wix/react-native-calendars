import { fireEvent, render, screen } from '@testing-library/react-native';
export class WeekCalendarDriver {
    testID;
    element;
    renderTree;
    constructor(testID, element) {
        this.testID = testID;
        this.element = element;
        this.renderTree = this.render(element);
    }
    render(element = this.element) {
        if (!element)
            throw 'Element is missing';
        this.renderTree = render(element);
        return this.renderTree;
    }
    getWeekCalendar() {
        return this.renderTree.getByTestId(`${this.testID}.weekCalendar.list`);
    }
    /** List */
    getListProps() {
        const props = screen.getByTestId(`${this.testID}.list`).props;
        return props;
    }
    getItemTestID(date) {
        return `${this.testID}.week_${date}`;
    }
    getListItem(date) {
        return screen.getByTestId(this.getItemTestID(date));
    }
    /** Day */
    getDayTestID(date) {
        return `${this.testID}.day_${date}`;
    }
    getDay(date) {
        return this.renderTree?.getByTestId(this.getDayTestID(date));
    }
    selectDay(date) {
        fireEvent(this.getDay(date), 'onPress');
    }
}
