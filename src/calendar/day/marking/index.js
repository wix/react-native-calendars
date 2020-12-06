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
    
    
    //period
    textColor: PropTypes.string,
    startingDate: PropTypes.string,
    endingDate: PropTypes.string
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
        return this.renderDot(); 
      case MARKING_TYPES.custom:
        return this.renderDot();   
      default:
        return this.renderDot();
    }
  }
  
  renderDots() {
    const {dots} = this.props;
    
    if (dots && Array.isArray(dots) && dots.length > 0) {
      // Filter out dots so that we'll process only those items which have key and color property
      const validDots = dots.filter(d => (d && d.color));
      
      return validDots.map((dot, index) => {
        return this.renderDot(dot.key || index);
      });
    }
    return;
  }

  getDots() {
    const {dots} = this.props;

    if (dots && Array.isArray(dots) && dots.length > 0) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = dots.filter(d => (d && d.color));

      return validDots.map((dot, index) => {
        return this.renderDot(index, dot);
      });
    }
    return;
  }

  renderMultiDot() {
    return (
      <View style={this.style.dotContainer}>
        {this.getDots()}
      </View>
    );
  }

  renderDot(index, dot) {
    const {theme, selected, marked, dotColor, today, disabled} = this.props;
    let key = index;
    let color = dotColor;
    
    if (dot) {
      if (dot.key) {
        key = dot.key;
      }
      color = selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color;
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
