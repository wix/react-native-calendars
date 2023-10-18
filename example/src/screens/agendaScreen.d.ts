import React, { Component } from 'react';
import { DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
interface State {
    items?: AgendaSchedule;
}
export default class AgendaScreen extends Component<State> {
    state: State;
    render(): React.JSX.Element;
    loadItems: (day: DateData) => void;
    renderDay: (day: any) => React.JSX.Element;
    renderItem: (reservation: AgendaEntry, isFirst: boolean) => React.JSX.Element;
    renderEmptyDate: () => React.JSX.Element;
    rowHasChanged: (r1: AgendaEntry, r2: AgendaEntry) => boolean;
    timeToString(time: number): string;
}
export {};
