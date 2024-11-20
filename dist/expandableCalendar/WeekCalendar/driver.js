import { fireEvent, render, screen } from '@testing-library/react-native';
export class WeekCalendarDriver {
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
        var _a;
        return (_a = this.renderTree) === null || _a === void 0 ? void 0 : _a.getByTestId(this.getDayTestID(date));
    }
    selectDay(date) {
        fireEvent(this.getDay(date), 'onPress');
    }
}
