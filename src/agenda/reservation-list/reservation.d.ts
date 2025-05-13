import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { Theme, AgendaEntry } from '../../types';
export interface ReservationProps {
    date?: XDate;
    item?: AgendaEntry;
    /** Specify theme properties to override specific styles for item's parts. Default = {} */
    theme?: Theme;
    /** specify your item comparison function for increased performance */
    rowHasChanged?: (a: AgendaEntry, b: AgendaEntry) => boolean;
    /** specify how each date should be rendered. date can be undefined if the item is not first in that day */
    renderDay?: (date?: XDate, item?: AgendaEntry) => JSX.Element;
    /** specify how each item should be rendered in agenda */
    renderItem?: (reservation: AgendaEntry, isFirst: boolean) => React.Component | JSX.Element;
    /** specify how empty date content with no items should be rendered */
    renderEmptyDate?: (date?: XDate) => React.Component | JSX.Element;
}
declare class Reservation extends Component<ReservationProps> {
    static displayName: string;
    static propTypes: {
        date: PropTypes.Requireable<any>;
        item: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
        renderDay: PropTypes.Requireable<(...args: any[]) => any>;
        renderItem: PropTypes.Requireable<(...args: any[]) => any>;
        renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
    };
    style: any;
    constructor(props: ReservationProps);
    shouldComponentUpdate(nextProps: ReservationProps): boolean;
    renderDate(): React.JSX.Element;
    render(): React.JSX.Element;
}
export default Reservation;
