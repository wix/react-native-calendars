<<<<<<< HEAD:src/agenda/reservation-list/index.js
import _ from 'lodash';
=======
import isFunction from 'lodash/isFunction';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
import PropTypes from 'prop-types';
import XDate from 'xdate';

import React, {Component} from 'react';
import {FlatList, ActivityIndicator, View} from 'react-native';

<<<<<<< HEAD:src/agenda/reservation-list/index.js
import {extractComponentProps} from '../../component-updater';
import dateutils from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import styleConstructor from './style';
import Reservation from './reservation';

class ReservationList extends Component {
  static displayName = 'IGNORE';
=======
import {extractComponentProps} from '../../componentUpdater';
import {sameDate} from '../../dateutils';
import {toMarkingFormat} from '../../interface';
import styleConstructor from './style';
import Reservation, {ReservationProps} from './reservation';
import {AgendaEntry, AgendaSchedule} from '../../types';


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
  /** Called when the momentum scroll stops for the agenda list **/
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** A RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView */
  refreshControl?: JSX.Element;
  /** Set this true while waiting for new data from a refresh */
  refreshing?: boolean;
  /** If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly */
  onRefresh?: () => void;
};

interface DayAgenda {
  reservation?: AgendaEntry;
  date?: XDate;
}

interface State {
  reservations: DayAgenda[];
}

class ReservationList extends Component<ReservationListProps, State> {
  static displayName = 'ReservationList';
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx

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
    onMomentumScrollEnd: PropTypes.func,
    refreshControl: PropTypes.element,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func
  };
  
  static defaultProps = {
    refreshing: false,
    selectedDay: XDate(true)
  };
<<<<<<< HEAD:src/agenda/reservation-list/index.js
=======

  private style: {[key: string]: ViewStyle | TextStyle};
  private heights: number[];
  private selectedDay?: XDate;
  private scrollOver: boolean;
  private list: React.RefObject<FlatList> = React.createRef();

>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx

  constructor(props) {
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

<<<<<<< HEAD:src/agenda/reservation-list/index.js
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (!dateutils.sameDate(prevProps.topDay, this.props.topDay)) {
        this.setState(
          {
            reservations: []
          },
=======
  componentDidUpdate(prevProps: ReservationListProps) {
    if (this.props.topDay && prevProps.topDay && prevProps !== this.props) {
      if (!sameDate(prevProps.topDay, this.props.topDay)) {
        this.setState({reservations: []},
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
          () => this.updateReservations(this.props)
        );
      } else {
        this.updateReservations(this.props);
      }
    }
  }

<<<<<<< HEAD:src/agenda/reservation-list/index.js
  updateDataSource(reservations) {
    this.setState({
      reservations
    });
=======
  updateDataSource(reservations: DayAgenda[]) {
    this.setState({reservations});
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
  }

  updateReservations(props) {
    const {selectedDay} = props;
    const reservations = this.getReservations(props);
<<<<<<< HEAD:src/agenda/reservation-list/index.js
    if (this.list && !dateutils.sameDate(selectedDay, this.selectedDay)) {
=======
    
    if (this.list && !sameDate(selectedDay, this.selectedDay)) {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
    }

    this.selectedDay = selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  getReservationsForDay(iterator, props) {
    const day = iterator.clone();
    const res = props.items?.[toMarkingFormat(day)];
    
    if (res && res.length) {
<<<<<<< HEAD:src/agenda/reservation-list/index.js
      return res.map((reservation, i) => {
        return {
          reservation,
          date: i ? false : day,
          day
=======
      return res.map((reservation: AgendaEntry, i: number) => {
        return {
          reservation,
          date: i ? undefined : day
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
        };
      });
    } else if (res) {
      return [
        {
          date: iterator.clone()
        }
      ];
    } else {
      return false;
    }
  }

  getReservations(props) {
    const {selectedDay, showOnlySelectedDayItems} = props;
    
    if (!props.items || !selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }

<<<<<<< HEAD:src/agenda/reservation-list/index.js
    let reservations = [];
=======
    let reservations: DayAgenda[] = [];
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
    if (this.state.reservations && this.state.reservations.length) {
      const iterator = this.state.reservations[0].date?.clone();
      if (iterator) {
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

  onScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
<<<<<<< HEAD:src/agenda/reservation-list/index.js
    _.invoke(this.props, 'onScroll', yOffset);
=======
    this.props.onScroll?.(yOffset);
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx

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

<<<<<<< HEAD:src/agenda/reservation-list/index.js
    const day = row.day;
    const sameDate = dateutils.sameDate(day, this.selectedDay);
    if (!sameDate && this.scrollOver) {
      this.selectedDay = day.clone();
      _.invoke(this.props, 'onDayChange', day.clone());
=======
    const day = row.date;
    if (day) {
      if (!sameDate(day, this.selectedDay) && this.scrollOver) {
        this.selectedDay = day.clone();
        this.props.onDayChange?.(day.clone());
      }
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
    }
  };

  onListTouch() {
    this.scrollOver = true;
  }

  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }

  onMoveShouldSetResponderCapture = () => {
    this.onListTouch();
    return false;
  };

<<<<<<< HEAD:src/agenda/reservation-list/index.js
  renderRow = ({item, index}) => {
=======
  renderRow = ({item, index}: {item: DayAgenda; index: number}) => {
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
    const reservationProps = extractComponentProps(Reservation, this.props);

    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation {...reservationProps} item={item.reservation} date={item.date}/>
      </View>
    );
  };

<<<<<<< HEAD:src/agenda/reservation-list/index.js
  keyExtractor = (item, index) => String(index);

  render() {
    const {reservations, selectedDay, theme, style} = this.props;
    if (!reservations || !reservations[toMarkingFormat(selectedDay)]) {
      if (_.isFunction(this.props.renderEmptyData)) {
        return _.invoke(this.props, 'renderEmptyData');
      }

      return <ActivityIndicator style={this.style.indicator} color={theme && theme.indicatorColor} />;
=======
  keyExtractor = (_item: DayAgenda, index: number) => String(index);

  render() {
    const {items, selectedDay, theme, style} = this.props;
    
    if (!items || selectedDay && !items[toMarkingFormat(selectedDay)]) {
      if (isFunction(this.props.renderEmptyData)) {
        return this.props.renderEmptyData?.();
      }
      return <ActivityIndicator style={this.style.indicator} color={theme?.indicatorColor}/>;
>>>>>>> 115f18741ed6f1e9a22d7ebe2115e091b3d204ca:src/agenda/reservation-list/index.tsx
    }

    return (
      <FlatList
        ref={c => (this.list = c)}
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
