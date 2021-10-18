import invoke from 'lodash/invoke';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {ActivityIndicator, View, FlatList, StyleProp, ViewStyle, TextStyle, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent} from 'react-native';

// @ts-expect-error
import {extractComponentProps} from '../../component-updater';
// @ts-expect-error
import {sameDate} from '../../dateutils';
// @ts-expect-error
import {toMarkingFormat} from '../../interface';
import styleConstructor from './style';
import Reservation, {ReservationProps} from './reservation';
import {ReservationItemType, ReservationsType} from 'agenda';


export interface DayReservations {
  reservation?: ReservationItemType;
  date?: XDate;
  day: XDate;
}

export type ReservationListProps = ReservationProps & {
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

class ReservationList extends Component<ReservationListProps, ReservationsListState> {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Reservation.propTypes,
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
    the value of date key kas to be an empty array []. If there exists no value for date key it is
    considered that the date in question is not yet loaded */
    reservations: PropTypes.object,
    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate),
    /** Show items only for the selected day. Default = false */
    showOnlySelectedDayItems: PropTypes.bool,
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange: PropTypes.func,
    /** specify what should be rendered instead of ActivityIndicator */
    renderEmptyData: PropTypes.func,

    /** onScroll ListView event */
    onScroll: PropTypes.func,
    /** Called when the user begins dragging the agenda list **/
    onScrollBeginDrag: PropTypes.func,
    /** Called when the user stops dragging the agenda list **/
    onScrollEndDrag: PropTypes.func,
    /** Called when the momentum scroll starts for the agenda list **/
    onMomentumScrollBegin: PropTypes.func,
    /** Called when the momentum scroll stops for the agenda list **/
    onMomentumScrollEnd: PropTypes.func,
    /** A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView */
    refreshControl: PropTypes.element,
    /** Set this true while waiting for new data from a refresh */
    refreshing: PropTypes.bool,
    /** If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly */
    onRefresh: PropTypes.func
  };

  static defaultProps = {
    refreshing: false,
    selectedDay: new XDate(true)
  };
  private style: {[key: string]: ViewStyle | TextStyle};
  private heights: number[];
  private selectedDay: XDate;
  private scrollOver: boolean;
  private list: React.RefObject<FlatList> = React.createRef();


  constructor(props: ReservationListProps) {
    super(props);

    this.style = styleConstructor(props.theme);

    this.state = {
      reservations: []
    };

    this.heights = [];
    this.selectedDay = props.selectedDay;
    this.scrollOver = true;
  }

  componentDidMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  componentDidUpdate(prevProps: ReservationListProps) {
    if (prevProps !== this.props) {
      if (!sameDate(prevProps.topDay, this.props.topDay)) {
        this.setState(
          {
            reservations: []
          },
          () => this.updateReservations(this.props)
        );
      } else {
        this.updateReservations(this.props);
      }
    }
  }

  updateDataSource(reservations: DayReservations[]) {
    this.setState({
      reservations
    });
  }

  updateReservations(props: ReservationListProps) {
    const {selectedDay} = props;
    const reservations = this.getReservations(props);
    if (this.list && !sameDate(selectedDay, this.selectedDay)) {
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list?.current?.scrollToOffset({offset: scrollPosition, animated: true});
    }
    this.selectedDay = selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  getReservationsForDay(iterator: XDate, props: ReservationListProps) {
    const day = iterator.clone();
    const res = props.reservations[toMarkingFormat(day)];
    if (res && res.length) {
      return res.map((reservation: ReservationItemType, i: number) => {
        return {
          reservation,
          date: i ? undefined : day,
          day
        };
      });
    } else if (res) {
      return [
        {
          date: iterator.clone(),
          day
        }
      ];
    } else {
      return false;
    }
  }

  getReservations(props: ReservationListProps) {
    const {selectedDay, showOnlySelectedDayItems} = props;
    if (!props.reservations || !selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }

    let reservations: DayReservations[] = [];
    if (this.state.reservations && this.state.reservations.length) {
      const iterator = this.state.reservations[0].day.clone();

      while (iterator.getTime() < selectedDay.getTime()) {
        const res = this.getReservationsForDay(iterator, props);
        if (!res) {
          reservations = [];
          break;
        } else {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }
    }

    const scrollPosition = reservations.length;
    const iterator = selectedDay.clone();
    if (showOnlySelectedDayItems) {
      const res = this.getReservationsForDay(iterator, props);

      if (res) {
        reservations = res;
      }
      iterator.addDays(1);
    } else {
      for (let i = 0; i < 31; i++) {
        const res = this.getReservationsForDay(iterator, props);

        if (res) {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }
    }

    return {reservations, scrollPosition};
  }

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    invoke(this.props, 'onScroll', yOffset);

    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }

    const row = this.state.reservations[topRow];
    if (!row) return;

    const day = row.day;
    const dateIsSame = sameDate(day, this.selectedDay);
    if (!dateIsSame && this.scrollOver) {
      this.selectedDay = day.clone();
      invoke(this.props, 'onDayChange', day.clone());
    }
  };

  onListTouch() {
    this.scrollOver = true;
  }

  onRowLayoutChange(index: number, event: LayoutChangeEvent) {
    this.heights[index] = event.nativeEvent.layout.height;
  }

  onMoveShouldSetResponderCapture = () => {
    this.onListTouch();
    return false;
  };

  renderRow = ({item, index}: {item: DayReservations; index: number}) => {
    const reservationProps = extractComponentProps(Reservation, this.props);

    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation {...reservationProps} item={item} />
      </View>
    );
  };

  keyExtractor = (_item: DayReservations, index: number) => String(index);

  render() {
    const {reservations, selectedDay, theme, style} = this.props;
    if (!reservations || !reservations[toMarkingFormat(selectedDay)]) {
      if (isFunction(this.props.renderEmptyData)) {
        return invoke(this.props, 'renderEmptyData');
      }

      return <ActivityIndicator style={this.style.indicator} color={theme?.indicatorColor} />;
    }

    return (
      <FlatList
        ref={this.list}
        style={style}
        contentContainerStyle={this.style.content}
        data={this.state.reservations}
        renderItem={this.renderRow}
        keyExtractor={this.keyExtractor}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture}
        onScroll={this.onScroll}
        refreshControl={this.props.refreshControl}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
        onScrollBeginDrag={this.props.onScrollBeginDrag}
        onScrollEndDrag={this.props.onScrollEndDrag}
        onMomentumScrollBegin={this.props.onMomentumScrollBegin}
        onMomentumScrollEnd={this.props.onMomentumScrollEnd}
      />
    );
  }
}

export default ReservationList;
