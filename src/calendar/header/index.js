import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

import styleConstructor from './style';
let style = {};

class CalendarHeader extends Component {
  constructor(props) {
    super(props);
    style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    return false;
  }

  render() {
    let leftArrow = (<View/>);
    let rightArrow = (<View/>);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity onPress={this.substractMonth} style={style.arrow}>
          <Image source={require('../img/previous.png')} style={style.arrowImage}/></TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity onPress={this.addMonth} style={style.arrow}>
          <Image source={require('../img/next.png')} style={style.arrowImage}/></TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = (<ActivityIndicator/>);
    }
    return (
      <View>
        <View style={style.header}>
          {leftArrow}
          <View style={{flexDirection: 'row'}}>
            <Text style={style.monthText}>{this.props.month.toString('MMMM yyyy')}</Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        <View style={style.week}>
          <Text style={style.dayHeader}>Sun</Text>
          <Text style={style.dayHeader}>Mon</Text>
          <Text style={style.dayHeader}>Tue</Text>
          <Text style={style.dayHeader}>Wed</Text>
          <Text style={style.dayHeader}>Thu</Text>
          <Text style={style.dayHeader}>Fri</Text>
          <Text style={style.dayHeader}>Sat</Text>
        </View>
      </View>
    );
  }
}

export default CalendarHeader;
