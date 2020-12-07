import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View} from 'react-native';
// import {shouldUpdate} from '../../../component-updater';
import styleConstructor from './style';
import Dot from '../dot';


const MARKING_TYPES = {
  dot: 'dot',
  multiDot: 'multi-dot',
  period: 'period',
  multiPeriod: 'multi-period',
  custom: 'custom'
};

const DOT = {
  key: PropTypes.string,
  color: PropTypes.string,
  selectedDotColor: PropTypes.string
};

const PERIOD = {
  startingDay: PropTypes.bool,
  endingDay: PropTypes.bool,
  color: PropTypes.string
};


export default class Marking extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    ...Dot.propTypes,
    type: PropTypes.oneOf(Object.values(MARKING_TYPES)),
    theme: PropTypes.object,
    selected: PropTypes.bool,
    marked: PropTypes.bool,
    today: PropTypes.bool,
    disabled: PropTypes.bool,
    disableTouchEvent: PropTypes.bool,
    activeOpacity: PropTypes.number,
    selectedColor: PropTypes.string,
    selectedTextColor: PropTypes.string,
    dotColor: PropTypes.string,
    //multi-dot
    dots: PropTypes.arrayOf(PropTypes.shape(DOT)),
    //multi-period
    periods: PropTypes.arrayOf(PropTypes.shape(PERIOD)),
    
    //period
    textColor: PropTypes.string,
    startingDay: PropTypes.string,
    endingDay: PropTypes.string
  };

  static markingTypes = MARKING_TYPES;

  constructor(props) {
    super(props);
    
    this.style = styleConstructor(props.theme);
  }

  renderMarkingByType() {
    switch (this.props.type) {
      case MARKING_TYPES.multiDot:
        return this.renderMultiDot();
      case MARKING_TYPES.period:
        return this.renderDot();
      case MARKING_TYPES.multiPeriod:
        return this.renderMultiPeriod(); 
      // case MARKING_TYPES.custom:
      //   return this.renderDot();   
      default:
        return this.renderDot();
    }
  }

  getItems() {
    const {dots, periods} = this.props;
    let array = dots || periods;
    
    if (array && Array.isArray(array) && array.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = array.filter(d => d && d.color);
      
      return validItems.map((item, index) => {
        return dots ? this.renderDot(index, item) : this.renderPeriod(index, item);
      });
    }
  }

  renderMultiPeriod() {
    return (
      <View style={this.style.periods}>
        {this.getItems()}
      </View>
    );
  }

  renderPeriod(index, item) {
    const {color, startingDay, endingDay} = item;
    const baseStyle = [this.style.period];
    const style = [
      ...baseStyle,
      {
        backgroundColor: color
      }
    ];
    if (startingDay) {
      style.push(this.style.startingDay);
    }
    if (endingDay) {
      style.push(this.style.endingDay);
    }
    return <View key={index} style={style}/>;
  }

  renderMultiDot() {
    return (
      <View style={this.style.dotContainer}>
        {this.getItems()}
      </View>
    );
  }

  renderDot(index, item) {
    const {theme, selected, marked, dotColor, today, disabled} = this.props;
    let key = index;
    let color = dotColor;
    
    if (item) {
      if (item.key) {
        key = item.key;
      }
      color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
    }
    
    return (
      <Dot
        key={key}
        theme={theme}
        color={color}
        marked={marked}
        selected={selected}
        disabled={disabled}
        today={today}
      />
    );
  }

  render() {
    return this.renderMarkingByType();
  }
}
