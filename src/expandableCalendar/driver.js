import { fireEvent, render } from '@testing-library/react-native';
export class ExpandableCalendarDriver {
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
    /** Container */
    getExpandableContainer() {
        return this.renderTree.getByTestId(`${this.testID}.expandableContainer`);
    }
    isCalendarExpanded() {
        const calendarHeight = this.getExpandableContainer().props?.style?.height;
        return calendarHeight > 145;
    }
    /** Header */
    getRightArrow() {
        return this.renderTree.getAllByTestId(`${this.testID}.rightArrow`)[0];
    }
    getLeftArrow() {
        return this.renderTree.getAllByTestId(`${this.testID}.leftArrow`)[0];
    }
    /** Knob and Position */
    get knobTestID() {
        return `${this.testID}.knob`;
    }
    getKnob() {
        // NOTE: using query as the Knob is not rendered in all cases
        return this.renderTree?.queryByTestId(this.knobTestID);
    }
    toggleKnob() {
        const knob = this.getKnob();
        if (knob) {
            fireEvent(knob, 'onPress');
        }
    }
    /** CalendarList */
    getCalendarList() {
        return this.renderTree.getByTestId(`${this.testID}.calendarList.list`);
    }
    getDayTestID(date) {
        const [year, month] = date.split('-');
        return `${this.testID}.calendarList.item_${year}-${month}.day_${date}`;
    }
    getDay(date) {
        return this.renderTree?.getByTestId(this.getDayTestID(date));
    }
    selectDay(date) {
        fireEvent(this.getDay(date), 'onPress');
    }
    /** WeekCalendar */
    getWeekCalendar() {
        return this.renderTree.getByTestId(`${this.testID}.weekCalendar.list`);
    }
    getWeekDayTestID(date) {
        return `${this.testID}.weekCalendar.day_${date}`;
    }
    getWeekDay(date) {
        return this.renderTree?.getByTestId(this.getWeekDayTestID(date));
    }
    selectWeekDay(date) {
        fireEvent(this.getWeekDay(date), 'onPress');
    }
    /** today button */
    getTodayButton() {
        try {
            return this.renderTree.getByText('Today');
        }
        catch (e) {
            return undefined;
        }
    }
    /** actions */
    pressOnTodayButton() {
        const todayButton = this.getTodayButton();
        if (todayButton) {
            fireEvent(todayButton, 'onPress');
        }
    }
    pressOnHeaderArrow({ left } = {}) {
        const element = left ? this.getLeftArrow() : this.getRightArrow();
        fireEvent(element, 'onPress');
    }
}
