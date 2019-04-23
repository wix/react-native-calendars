import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  PanResponder,
  Animated,
  View
} from 'react-native';
import styleConstructor from './style';
import CalendarList from '../calendar-list';


const POSITIONS = {
  CLOSED: 'closed',
  OPEN: 'open'
};
const SPEED = 20;
const BOUNCINESS = 6;
const CLOSED_HEIGHT = 120;
const OPEN_HEIGHT = 300;
const KNOB_CONTAINER_HEIGHT = 30;

class ExpandableCalendar extends Component {
  static propTypes = {
    ...CalendarList.propTypes,
    hideKnob: PropTypes.bool,
  }

  static defaultProps = {}

  constructor(props) {
    super(props);

    this.closedHeight = CLOSED_HEIGHT + (props.hideKnob ? 0 : KNOB_CONTAINER_HEIGHT);
    this.openHeight = OPEN_HEIGHT + (props.hideKnob ? 0 : KNOB_CONTAINER_HEIGHT);
    this.style = styleConstructor(props.theme);
    this._wrapperStyles = {style: {}};
    this._height = this.closedHeight;

    this.state = {
      deltaY: new Animated.Value(this.closedHeight),
      position: POSITIONS.CLOSED
    };
    
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
  }

  componentDidMount() {
    this.updateNativeStyles();
  }
  
  updateNativeStyles() {
    this.wrapper && this.wrapper.setNativeProps(this._wrapperStyles);
  }

  /** Pan Gesture */

  handleMoveShouldSetPanResponder = (e, gestureState) => {
    return gestureState.dy > 5 || gestureState.dy < -5;
  };
  handlePanResponderGrant = () => {
  };
  handlePanResponderMove = (e, gestureState) => {
    this._wrapperStyles.style.height = this._height + gestureState.dy;
    this.updateNativeStyles();
  };
  handlePanResponderEnd = (e, gestureState) => {
    this._height += gestureState.dy;
    this.bounceToPosition();
  };

  /** Animated */
  
  bounceToPosition() {
    const {deltaY} = this.state;
    deltaY.setValue(this._height);
    const newValue = this._height > this.openHeight / 2 ? this.openHeight : this.closedHeight;
    this._height = newValue;

    Animated.spring(deltaY, {
      toValue: newValue,
      speed: SPEED,
      bounciness: BOUNCINESS
    }).start(this.onAnimatedFinished);
  }

  onAnimatedFinished = ({finished}) => {
    if (finished) {
      this.setState({position: this._height === this.closedHeight ? POSITIONS.CLOSED : POSITIONS.OPEN});
    }
  }
  
  /** Events */

  onDayPress = (date) => { // {year: 2019, month: 4, day: 22, timestamp: 1555977600000, dateString: "2019-04-23"}
    // Report date change
  }

  onVisibleMonthsChange = (value) => {
    
  }

  /** Renders */

  renderKnob() {
    return (
      <View style={this.style.knobContainer}>
        <View style={this.style.knob}/>
      </View>
    );
  }

  render() {
    const {style, hideKnob} = this.props;
    const {deltaY, position} = this.state;
    const isOpen = position === POSITIONS.OPEN;
    
    return (
      <Animated.View 
        ref={e => {this.wrapper = e;}}
        style={[style, {height: deltaY}]} 
        {...this.panResponder.panHandlers}
      >
        <CalendarList
          testID="calendar"
          {...this.props}
          horizontal
          onDayPress={this.onDayPress}
          onVisibleMonthsChange={this.onVisibleMonthsChange}
          pagingEnabled
          scrollEnabled={isOpen}
          // pastScrollRange={0}
          // futureScrollRange={0}
        />
        {!hideKnob && this.renderKnob()}
      </Animated.View>
    );
  }
}

export default ExpandableCalendar;
