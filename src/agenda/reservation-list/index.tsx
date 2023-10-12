import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent, 
  TextStyle, 
  LayoutChangeEvent,
} from 'react-native';
import XDate from 'xdate';
import { extractReservationProps } from '../../componentUpdater';
import { sameDate } from '../../dateutils';
import { toMarkingFormat } from '../../interface';
import { AgendaSchedule, DayAgenda } from '../../types';
import Reservation, { ReservationProps } from './reservation';
import styleConstructor from './style';

export type ReservationListProps = ReservationProps & {
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
  /** Rendered at the top of all the items. Can be a React Component (e.g. SomeComponent), or a React element (e.g. <SomeComponent />)**/
  ListHeaderComponent?: () => JSX.Element;

  renderStickyHeader?: () => JSX.Element;
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

class ReservationList extends Component<ReservationListProps, State> {
  static displayName = 'ReservationList';
  static propTypes = {
    ...Reservation.propTypes,
    items: PropTypes.object,
    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate),
    onDayChange: PropTypes.func,
    showOnlySelectedDayItems: PropTypes.bool,
    renderEmptyData: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollBeginDrag: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
    onMomentumScrollBegin: PropTypes.func,
    ListHeaderComponent: PropTypes.func,
    renderStickyHeader: PropTypes.object,
    onMomentumScrollEnd: PropTypes.func,
    refreshControl: PropTypes.element,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    reservationsKeyExtractor: PropTypes.func,
  };
  static defaultProps = {
    refreshing: false,
    selectedDay: new XDate(true),
  };
  private style: {[key: string]: ViewStyle | TextStyle};
  private heights: number[];
  private selectedDay?: XDate;
  private scrollOver: boolean;
  private list: React.RefObject<FlatList> = React.createRef();
  constructor(props: ReservationListProps) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.state = {
      reservations: [],
    };
    this.heights = [];
    this.selectedDay = props.selectedDay;
    this.scrollOver = true;
  }
  componentDidMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }
  componentDidUpdate(prevProps: ReservationListProps) {
    if (this.props.topDay && prevProps.topDay && prevProps !== this.props) {
      if (!sameDate(prevProps.topDay, this.props.topDay)) {
        this.setState({ reservations: [] }, () => this.updateReservations(this.props));
      }
      else {
        this.updateReservations(this.props);
      }
    }
  }
  updateDataSource(reservations: DayAgenda[]) {
    this.setState({ reservations });
  }
  updateReservations(props: ReservationListProps) {
    const { selectedDay, showOnlySelectedDayItems } = props;
    const reservations = this.getReservations(props);
    if (!showOnlySelectedDayItems && this.list) {
      this.state.reservations.forEach((reservation, index) => {
        const reservationDate = reservation.date ? toMarkingFormat(reservation.date) : undefined;
        if (reservationDate === toMarkingFormat(selectedDay)) {
          setTimeout(() => {
            this.list?.current?.scrollToIndex({ index, animated: true });
          }, 100);
        }
      });
    }

    this.selectedDay = selectedDay;
    this.updateDataSource(reservations.reservations);
  }
  getReservationsForDay(iterator: XDate, props: ReservationListProps) {
    const day = iterator.clone();
    const res = props.items?.[toMarkingFormat(day)];
    if (res && res.length) {
      return res.map((reservation, i) => {
        return {
          reservation,
          date: i ? undefined : day,
        };
      });
    }
    else if (res) {
      return [
        {
          date: iterator.clone(),
        },
      ];
    }
    else {
      return false;
    }
  }
  getReservations(props: ReservationListProps) {
    const { selectedDay, showOnlySelectedDayItems } = props;
    if (!props.items || !selectedDay) {
      return { reservations: [] };
    }

    let reservations = [];
    if (this.state.reservations && this.state.reservations.length) {
      const iterator = this.state.reservations[0].date?.clone();
      if (iterator) {
        while (iterator.getTime() < selectedDay.getTime()) {
          const res = this.getReservationsForDay(iterator, props);
          if (!res) {
            reservations = [];
            break;
          }
          else {
            reservations = reservations.concat(res as any);
          }

          iterator.addDays(1);
        }
      }
    }

    const firstDateOfTheWeek = Object.entries(this.props.items as AgendaSchedule).sort((a, b) => {
      const dateA = new Date(a[0]) as any;
      const dateB = new Date(b[0]) as any;

      return dateA - dateB;
    });
    const firstDayOfTheWeek = new XDate(firstDateOfTheWeek[0][0], true);
    const iterator = firstDayOfTheWeek.clone();
    if (showOnlySelectedDayItems) {
      const res = this.getReservationsForDay(iterator, props);
      if (res) {
        reservations = res as any;
      }

      iterator.addDays(1);
    }
    else {
      reservations = [];
      for (let i = 0; i < 31; i++) {
        const res = this.getReservationsForDay(iterator, props);
        if (res) {
          reservations = reservations.concat(res as any);
        }

        iterator.addDays(1);
      }
    }

    return { reservations };
  }
  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    this.props.onScroll?.(yOffset);
    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }

      topRowOffset += this.heights[topRow];
    }

    const row = this.state.reservations[topRow];
    if (!row)
      return;
    const day = row.date;
    if (day) {
      if (!sameDate(day, this.selectedDay) && this.scrollOver) {
        this.selectedDay = day.clone();
      }
    }
  };
  onListTouch() {
    this.scrollOver = true;
  }
  onRowLayoutChange(index: number, event: LayoutChangeEvent) {
    this.state.reservations.forEach((reservation: ReservationProps, index: number) => {
      const reservationDate = reservation.date ? toMarkingFormat(reservation.date) : undefined;
      const selectedDay = toMarkingFormat(this.selectedDay);
      if (reservationDate === selectedDay) {
        setTimeout(() => {
          this.list?.current?.scrollToIndex({ index, animated: true });
        }, 100);
      }
    });
    this.heights[index] = event.nativeEvent.layout.height;
  }
  onMoveShouldSetResponderCapture = () => {
    this.onListTouch();

    return false;
  };
  renderRow = ({ item, index }) => {
    const reservationProps = extractReservationProps(this.props);

    return (<View onLayout={this.onRowLayoutChange.bind(this, index)}>
      <Reservation {...reservationProps} date={item.date} item={item.reservation} />
    </View>);
  };
  keyExtractor = (item: DayAgenda, index: number) => {
    return this.props.reservationsKeyExtractor?.(item, index) || `${item?.reservation?.day}${index}`;
  };
  render() {
    const { items, selectedDay, theme, style } = this.props;
    if (!items || selectedDay && !items[toMarkingFormat(selectedDay)]) {
      if (isFunction(this.props.renderEmptyData)) {
        return this.props.renderEmptyData?.();
      }

      return <ActivityIndicator color={theme?.indicatorColor} style={this.style.indicator} />;
    }

    return (
      <>
        {this.props.renderStickyHeader}
        <FlatList
          contentContainerStyle={this.style.content}
          data={this.state.reservations}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.props.ListHeaderComponent}
          onMomentumScrollBegin={this.props.onMomentumScrollBegin}
          onMomentumScrollEnd={this.props.onMomentumScrollEnd}
          onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture}
          onRefresh={this.props.onRefresh}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.props.onScrollBeginDrag}
          onScrollEndDrag={this.props.onScrollEndDrag}
          ref={this.list}
          refreshControl={this.props.refreshControl}
          refreshing={this.props.refreshing}
          renderItem={this.renderRow}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          style={style} 
        />
      </>
    );
  }
}
export default ReservationList;
