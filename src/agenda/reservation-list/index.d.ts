import XDate from 'xdate';
import React, { Component } from 'react';
import { StyleProp, ViewStyle, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native';
import { ReservationProps } from './reservation';
import { AgendaEntry, AgendaSchedule, DayAgenda } from '../../types';
export declare type ReservationListProps = ReservationProps & {
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
    the value of date key kas to be an empty array []. If there exists no value for date key it is
    considered that the date in question is not yet loaded */
    items?: AgendaSchedule;
    selectedDay?: XDate;
    topDay?: XDate;
    /** Show items only for the selected date. Default = false */
    showOnlySelectedDayItems?: boolean;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange?: (day: XDate) => void;
    /** specify what should be rendered instead of ActivityIndicator */
    renderEmptyData?: () => JSX.Element;
    style?: StyleProp<ViewStyle>;
    /** onScroll FlatList event */
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
    /** Extractor for underlying FlatList. Ensure that this is unique per item, or else scrolling may have duplicated and / or missing items.  */
    reservationsKeyExtractor?: (item: DayAgenda, index: number) => string;
};
interface State {
    reservations: DayAgenda[];
}
declare class ReservationList extends Component<ReservationListProps, State> {
    static displayName: string;
    static propTypes: {
        items: any;
        selectedDay: any;
        topDay: any;
        onDayChange: any;
        showOnlySelectedDayItems: any;
        renderEmptyData: any;
        onScroll: any;
        onScrollBeginDrag: any;
        onScrollEndDrag: any;
        onMomentumScrollBegin: any;
        onMomentumScrollEnd: any;
        refreshControl: any;
        refreshing: any;
        onRefresh: any;
        reservationsKeyExtractor: any;
        date: any;
        item: any; /** onScroll FlatList event */
        theme: any;
        rowHasChanged: any;
        renderDay: any;
        renderItem: any;
        renderEmptyDate: any;
    };
    static defaultProps: {
        refreshing: boolean;
        selectedDay: XDate;
    };
    private style;
    private heights;
    private selectedDay?;
    private scrollOver;
    private list;
    constructor(props: ReservationListProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ReservationListProps): void;
    updateDataSource(reservations: DayAgenda[]): void;
    updateReservations(props: ReservationListProps): void;
    getReservationsForDay(iterator: XDate, props: ReservationListProps): false | {
        reservation: AgendaEntry;
        date: XDate | undefined;
    }[] | {
        date: XDate;
    }[];
    getReservations(props: ReservationListProps): {
        reservations: DayAgenda[];
        scrollPosition: number;
    };
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onListTouch(): void;
    onRowLayoutChange(index: number, event: LayoutChangeEvent): void;
    onMoveShouldSetResponderCapture: () => boolean;
    renderRow: ({ item, index }: {
        item: DayAgenda;
        index: number;
    }) => React.JSX.Element;
    keyExtractor: (item: DayAgenda, index: number) => string;
    render(): React.JSX.Element;
}
export default ReservationList;
