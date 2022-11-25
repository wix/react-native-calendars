import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { isToday } from '../../dateutils';
import { getDefaultLocale } from '../../services';
// @ts-expect-error
import { RESERVATION_DATE } from '../../testIDs';
import styleConstructor from './style';
class Reservation extends Component {
    static displayName = 'Reservation';
    static propTypes = {
        date: PropTypes.any,
        item: PropTypes.any,
        theme: PropTypes.object,
        rowHasChanged: PropTypes.func,
        renderDay: PropTypes.func,
        renderItem: PropTypes.func,
        renderEmptyDate: PropTypes.func
    };
    style;
    constructor(props) {
        super(props);
        this.style = styleConstructor(props.theme);
    }
    shouldComponentUpdate(nextProps) {
        const d1 = this.props.date;
        const d2 = nextProps.date;
        const r1 = this.props.item;
        const r2 = nextProps.item;
        let changed = true;
        if (!d1 && !d2) {
            changed = false;
        }
        else if (d1 && d2) {
            if (d1.getTime() !== d2.getTime()) {
                changed = true;
            }
            else if (!r1 && !r2) {
                changed = false;
            }
            else if (r1 && r2) {
                if ((!d1 && !d2) || (d1 && d2)) {
                    if (isFunction(this.props.rowHasChanged)) {
                        changed = this.props.rowHasChanged(r1, r2);
                    }
                }
            }
        }
        return changed;
    }
    renderDate(date, item) {
        if (isFunction(this.props.renderDay)) {
            return this.props.renderDay(date, item);
        }
        const today = date && isToday(date) ? this.style.today : undefined;
        const dayNames = getDefaultLocale().dayNamesShort;
        const dayNamesShort = XDate.locales[XDate.defaultLocale].dayNamesShort;
        if (date) {
            return (<View style={this.style.day} testID={RESERVATION_DATE}>
          <Text allowFontScaling={false} style={[this.style.dayNum, today]}>
            {date.getDate()}
          </Text>
          <Text allowFontScaling={false} style={[this.style.dayText, today]}>
            {dayNamesShort ? dayNamesShort[date.getDay()] : dayNames[date.getDay()]}
          </Text>
        </View>);
        }
        else {
            return <View style={this.style.day}/>;
        }
    }
    render() {
        const { item, date } = this.props;
        let content;
        if (item) {
            const firstItem = date ? true : false;
            if (isFunction(this.props.renderItem)) {
                content = this.props.renderItem(item, firstItem);
            }
        }
        else if (isFunction(this.props.renderEmptyDate)) {
            content = this.props.renderEmptyDate(date);
        }
        return (<View style={this.style.container}>
        {this.renderDate(date, item)}
        <View style={this.style.innerContainer}>{content}</View>
      </View>);
    }
}
export default Reservation;
