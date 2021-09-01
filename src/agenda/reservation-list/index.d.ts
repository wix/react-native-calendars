import PropTypes from 'prop-types';
import XDate from 'xdate';
import { Component } from 'react';
import { StyleProp, ViewStyle, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native';
import { ReservationProps } from './reservation';
import { ReservationItemType, ReservationsType } from 'agenda';
export interface DayReservations {
    reservation?: ReservationItemType;
    date?: XDate;
    day: XDate;
}
export declare type ReservationListProps = ReservationProps & {
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
    the value of date key kas to be an empty array []. If there exists no value for date key it is
    considered that the date in question is not yet loaded */
    reservations: ReservationsType;
    selectedDay: XDate;
    topDay: XDate;
    /** Show items only for the selected day. Default = false */
    showOnlySelectedDayItems: boolean;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange?: (day: Date) => void;
    /** specify what should be rendered instead of ActivityIndicator */
    renderEmptyData: () => JSX.Element;
    style?: StyleProp<ViewStyle>;
    /** onScroll ListView event */
    onScroll?: (yOffset: number) => void;
    /** Called when the user begins dragging the agenda list **/
    onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Called when the user stops dragging the agenda list **/
    onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Called when the momentum scroll starts for the agenda list **/
    onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Called when the momentum scroll stops for the agenda list **/
    onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView */
    refreshControl?: JSX.Element;
    /** Set this true while waiting for new data from a refresh */
    refreshing?: boolean;
    /** If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly */
    onRefresh?: () => void;
};
interface ReservationsListState {
    reservations: DayReservations[];
}
declare class ReservationList extends Component<ReservationListProps, ReservationsListState> {
    static displayName: string;
    static propTypes: {
        /** the list of items that have to be displayed in agenda. If you want to render item as empty date
        the value of date key kas to be an empty array []. If there exists no value for date key it is
        considered that the date in question is not yet loaded */
        reservations: PropTypes.Requireable<object>;
        selectedDay: PropTypes.Requireable<XDate>;
        topDay: PropTypes.Requireable<XDate>;
        /** Show items only for the selected day. Default = false */
        showOnlySelectedDayItems: PropTypes.Requireable<boolean>;
        /** callback that gets called when day changes while scrolling agenda list */
        onDayChange: PropTypes.Requireable<(...args: any[]) => any>;
        /** specify what should be rendered instead of ActivityIndicator */
        renderEmptyData: PropTypes.Requireable<(...args: any[]) => any>;
        /** onScroll ListView event */
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        /** Called when the user begins dragging the agenda list **/
        onScrollBeginDrag: PropTypes.Requireable<(...args: any[]) => any>;
        /** Called when the user stops dragging the agenda list **/
        onScrollEndDrag: PropTypes.Requireable<(...args: any[]) => any>;
        /** Called when the momentum scroll starts for the agenda list **/
        onMomentumScrollBegin: PropTypes.Requireable<(...args: any[]) => any>;
        /** Called when the momentum scroll stops for the agenda list **/
        onMomentumScrollEnd: PropTypes.Requireable<(...args: any[]) => any>;
        /** A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView */
        refreshControl: PropTypes.Requireable<PropTypes.ReactElementLike>;
        /** Set this true while waiting for new data from a refresh */
        refreshing: PropTypes.Requireable<boolean>;
        /** If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly */
        onRefresh: PropTypes.Requireable<(...args: any[]) => any>;
        item: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>;
        rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
        renderDay: PropTypes.Requireable<(...args: any[]) => any>;
        renderItem: PropTypes.Requireable<(...args: any[]) => any>;
        renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        refreshing: boolean;
        selectedDay: XDate;
    };
    private style;
    private heights;
    private selectedDay;
    private scrollOver;
    private list;
    constructor(props: ReservationListProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ReservationListProps): void;
    updateDataSource(reservations: DayReservations[]): void;
    updateReservations(props: ReservationListProps): void;
    getReservationsForDay(iterator: XDate, props: ReservationListProps): false | {
        reservation: ReservationItemType;
        date: XDate | undefined;
        day: XDate;
    }[] | {
        date: XDate;
        day: XDate;
    }[];
    getReservations(props: ReservationListProps): {
        reservations: DayReservations[];
        scrollPosition: number;
    };
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onListTouch(): void;
    onRowLayoutChange(index: number, event: LayoutChangeEvent): void;
    onMoveShouldSetResponderCapture: () => boolean;
    renderRow: ({ item, index }: {
        item: DayReservations;
        index: number;
    }) => JSX.Element;
    keyExtractor: (_item: DayReservations, index: number) => string;
    render(): any;
}
export default ReservationList;
