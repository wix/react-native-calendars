// @flow
import min from 'lodash/min';
import map from 'lodash/map';
import PropTypes from 'prop-types';

import React, {Component} from 'react';
import {View, Dimensions, ScrollView, TextStyle, ViewStyle} from 'react-native';

import {Theme} from '../types';
import styleConstructor from './style';
import populateEvents, {HALF_HOUR_BLOCK_HEIGHT} from './Packer';
import TimelineHours from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';

const LEFT_MARGIN = 60 - 1;

const {width: dimensionWidth} = Dimensions.get('window');

export interface TimelineProps {
  events: Event[];
  start?: number;
  end?: number;
  eventTapped?: (event: Event) => void; //TODO: deprecate (prop renamed 'onEventPress', as in the other components).
  onEventPress?: (event: Event) => void;
  styles?: Theme; //TODO: deprecate (prop renamed 'theme', as in the other components).
  theme?: Theme;
  scrollToFirst?: boolean;
  format24h?: boolean;
  renderEvent?: (event: PackedEvent) => JSX.Element;
}

interface State {
  _scrollY: number;
  packedEvents: PackedEvent[];
}

export default class Timeline extends Component<TimelineProps, State> {
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    eventTapped: PropTypes.func, // TODO: remove after deprecation
    onEventPress: PropTypes.func,
    format24h: PropTypes.bool,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        color: PropTypes.string
      })
    ).isRequired
  };

  static defaultProps = {
    start: 0,
    end: 24,
    events: [],
    format24h: true
  };

  private scrollView = React.createRef<ScrollView>();
  style: {[key: string]: ViewStyle | TextStyle};
  calendarHeight: number;

  constructor(props: TimelineProps) {
    super(props);

    const {start = 0, end = 0} = this.props;
    this.calendarHeight = (end - start) * HALF_HOUR_BLOCK_HEIGHT;

    this.style = styleConstructor(props.theme || props.styles, this.calendarHeight);

    const width = dimensionWidth - LEFT_MARGIN;
    const packedEvents = populateEvents(props.events, width, start);
    const firstTop = min(map(packedEvents, 'top')) ?? 0;
    const initPosition = firstTop  - this.calendarHeight / (end - start);
    const verifiedInitPosition = initPosition < 0 ? 0 : initPosition;

    this.state = {
      _scrollY: verifiedInitPosition,
      packedEvents
    };
  }

  componentDidUpdate(prevProps: TimelineProps) {
    const width = dimensionWidth - LEFT_MARGIN;
    const {events: prevEvents, start: prevStart = 0} = prevProps;
    const {events, start = 0} = this.props;

    if (prevEvents !== events || prevStart !== start) {
      this.setState({
        packedEvents: populateEvents(events, width, start)
      });
    }
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this.scrollView) {
        this.scrollView?.current?.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true
        });
      }
    }, 1);
  }

  onEventPress = (eventIndex: number) => {
    const event = this.props.events[eventIndex];
    if (this.props.eventTapped) {
      //TODO: remove after deprecation
      this.props.eventTapped(event);
    } else {
      this.props.onEventPress?.(event);
    }
  };

  renderEvents() {
    const {packedEvents} = this.state;
    const {format24h, renderEvent} = this.props;

    const events = packedEvents.map((event: PackedEvent, i: number) => {
      return (
        <EventBlock
          key={i}
          index={i}
          event={event}
          styles={this.style}
          format24h={format24h}
          onPress={this.onEventPress}
          renderEvent={renderEvent}
        />
      );
    });

    return (
      <View>
        <View style={{marginLeft: LEFT_MARGIN}}>{events}</View>
      </View>
    );
  }

  render() {
    const {format24h, start, end} = this.props;
    return (
      <ScrollView ref={this.scrollView} contentContainerStyle={[this.style.contentStyle, {width: dimensionWidth}]}>
        <TimelineHours start={start} end={end} format24h={format24h} styles={this.style} />
        {this.renderEvents()}
      </ScrollView>
    );
  }
}
