import _ from 'lodash';
import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {xdateToData} from '../../interface';
import XDate from 'xdate';
import dateutils from '../../dateutils';
import styleConstructor from './style';


class Reservation extends Component {
  static displayName = 'IGNORE';
  
  constructor(props) {
    super(props);

    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = false;
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          if (_.isFunction(this.props.rowHasChanged)) {
            changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
          }
        }
      }
    }
    return changed;
  }

  renderDate(date, item) {
    if (_.isFunction(this.props.renderDay)) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate()) ? this.styles.today : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text allowFontScaling={false} style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text allowFontScaling={false} style={[this.styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].dayNamesShort[date.getDay()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  render() {
    const {reservation, date} = this.props.item;
    let content;
    if (reservation) {
      const firstItem = date ? true : false;
      if (_.isFunction(this.props.renderItem)) {
        content = this.props.renderItem(reservation, firstItem);
      }
    } else if (_.isFunction(this.props.renderEmptyDate)) {
      content = this.props.renderEmptyDate(date);
    }
    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex: 1}}>
          {content}
        </View>
      </View>
    );
  }
}

export default Reservation;
