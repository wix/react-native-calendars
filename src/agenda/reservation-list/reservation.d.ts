import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { Theme } from '../../types';
import { DayReservations } from './index';
export interface ReservationProps {
    item: DayReservations;
    /** Specify theme properties to override specific styles for reservation parts. Default = {} */
    theme: Theme;
    /** specify your item comparison function for increased performance */
    rowHasChanged?: (a: any, b: any) => boolean;
    /** specify how each date should be rendered. day can be undefined if the item is not first in that day */
    renderDay?: (date: XDate, item?: DayReservations) => React.Component;
    /** specify how each item should be rendered in agenda */
    renderItem?: (reservation: any, isFirst: boolean) => React.Component;
    /** specify how empty date content with no items should be rendered */
    renderEmptyDate?: (date?: XDate) => React.Component;
}
declare class Reservation extends Component<ReservationProps> {
    static displayName: string;
    static propTypes: {
        item: PropTypes.Requireable<any>;
        /** Specify theme properties to override specific styles for reservation parts. Default = {} */
        theme: PropTypes.Requireable<object>;
        /** specify your item comparison function for increased performance */
        rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
        /** specify how each date should be rendered. day can be undefined if the item is not first in that day */
        renderDay: PropTypes.Requireable<(...args: any[]) => any>;
        /** specify how each item should be rendered in agenda */
        renderItem: PropTypes.Requireable<(...args: any[]) => any>;
        /** specify how empty date content with no items should be rendered */
        renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
    };
    style: {
        container: {
            flexDirection: "row";
        };
        innerContainer: {
            flex: number;
        };
        dayNum: {
            fontSize: number;
            fontWeight: "200";
            fontFamily: string;
            color: string;
        };
        dayText: {
            fontSize: number;
            /** Specify theme properties to override specific styles for reservation parts. Default = {} */
            fontWeight: "300" | "600" | "normal" | "bold" | "100" | "200" | "400" | "500" | "700" | "800" | "900";
            fontFamily: string;
            color: string;
            backgroundColor: string;
            marginTop: number;
        };
        day: {
            width: number;
            alignItems: "center";
            justifyContent: "flex-start";
            marginTop: number;
        };
        today: {
            color: string;
        };
        indicator: {
            marginTop: number; /** specify how each item should be rendered in agenda */
        };
    };
    constructor(props: ReservationProps);
    shouldComponentUpdate(nextProps: ReservationProps): boolean;
    renderDate(date?: XDate, item?: DayReservations): JSX.Element | React.Component<{}, {}, any>;
    render(): JSX.Element;
}
export default Reservation;
