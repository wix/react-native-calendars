import { Component } from 'react';
import { DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
interface State {
    items?: AgendaSchedule;
}
export default class AgendaScreen extends Component<State> {
    state: State;
    render(): JSX.Element;
    loadItems: (day: DateData) => void;
    renderItem: (reservation: AgendaEntry, isFirst: boolean) => JSX.Element;
    renderEmptyDate: () => JSX.Element;
    rowHasChanged: (r1: AgendaEntry, r2: AgendaEntry) => boolean;
    timeToString(time: number): string;
}
export {};
