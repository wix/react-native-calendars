import _ from 'lodash';
import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';

import {xdateToData} from '../../interface';
import XDate from 'xdate';
const Day = require("dayjs")
import dateutils from '../../dateutils';
import styleConstructor from './style';
import {RESERVATION_DATE} from '../../testIDs';

import {fonts,colors} from '@app/utils'

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
        <View style={this.styles.day} testID={RESERVATION_DATE}>
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
    if(this.props.item.startDate && this.props.item.endDate) {
      let s = Day(this.props.item.startDate.toString());
      let e = Day(this.props.item.endDate.toString())
      if(s.isSame(e, 'day')) {
        return (
          <View style = {{height : 40, justifyContent : 'center', marginLeft : 32}}>
            <Text style = {{fontFamily : fonts.subtitle, color : colors.subtitle, fontSize : 12}}>{s.format("MMM D")}</Text>
          </View>
        )
      }
      return (
        <View style = {{height : 40, justifyContent : 'center', marginLeft : 32}}>
          <Text style = {{fontFamily : fonts.subtitle, color : colors.subtitle, fontSize : 12}}>{s.format("MMM D")} - {e.format("D")}</Text>
        </View>
      )
    }
    const {reservation, date} = this.props.item;
    let content;
    const firstItem = date ? true : false;
    if (reservation) {
      if (_.isFunction(this.props.renderItem)) {
        content = this.props.renderItem(reservation, firstItem);
      }
    } else if (_.isFunction(this.props.renderEmptyDate)) {
      content = this.props.renderEmptyDate(date);
    }
    return (
      <TouchableWithoutFeedback onPress = {() => this.props.openAddWorkScreenWithDate(date)}>
        <View style={[this.styles.container, {marginTop : firstItem ? 30 : 8}]}>
          {this.renderDate(date, reservation)}
          <View style={{flex: 1}}>
            {content}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Reservation;
