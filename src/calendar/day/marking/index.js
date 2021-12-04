import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {shouldUpdate, extractComponentProps} from '../../../component-updater';
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
    periods: PropTypes.arrayOf(PropTypes.shape(PERIOD))
  };

  static markingTypes = MARKING_TYPES;

  constructor(props) {
    super(props);
    
    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      'type', 
      'selected', 
      'marked', 
      'today', 
      'disabled', 
      'disableTouchEvent', 
      'activeOpacity', 
      'selectedColor', 
      'selectedTextColor', 
      'dotColor',
      'dots',
      'periods'
    ]);
  }

  getItems(items) {
    const {type} = this.props;
    
    if (items && Array.isArray(items) && items.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = items.filter(d => d && d.color);
      
      return validItems.map((item, index) => {
        return type === MARKING_TYPES.multiDot ? this.renderDot(index, item) : this.renderPeriod(index, item);
      });
    }
  }

  renderMarkingByType() {
    const {type, dots, periods} = this.props;

    switch (type) {
      case MARKING_TYPES.multiDot:
        return this.renderMultiMarkings(this.style.dots, dots); 
      case MARKING_TYPES.multiPeriod:
        return this.renderMultiMarkings(this.style.periods, periods);    
      default:
        return this.renderDot();
    }
  }

  renderMultiMarkings(containerStyle, items) {
    return (
      <View style={containerStyle}>
        {this.getItems(items)}
      </View>
    );
  }

  renderPeriod(index, item) {
    const {color, startingDay, endingDay} = item;
    const style = [
      this.style.period,
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

  renderDot(index, item) {
    const {selected, dotColor} = this.props;
    const dotProps = extractComponentProps(Dot, this.props);
    const {marked } = dotProps;
    let key = index;
    let color = "red";
    
    if (item) {
      if (item.key) {
        key = item.key;
      }
      color ="red";
    }
    return (
      
      <View style={{paddingTop:3}}>
        {dotProps.selected && <Image source={require('../../../../../../app/assets/icons/cuorered.png')} style={{width:17, height:17, alignSelf:"center"}} resizeMode="contain"/>}
        {dotProps.marked && <Image source={require('../../../../../../app/assets/icons/cuorewhite.png')} style={{width:17, height:17, alignSelf:"center"}} resizeMode="contain"/>}
     
      </View>
     
    );
  }

  render() {
    return this.renderMarkingByType();
  }
}
