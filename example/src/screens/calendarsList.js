import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {CalendarList, LocaleConfig} from 'react-native-calendars';

export const styles = {
  containerHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderShadow: 'none'
  },
  textMonth: {
    fontFamily: 'LatamSans-LightItalic',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#10004F'
  },
  textYear: {
    color: '#5C5C5C',
    fontFamily: 'LatamSans-Bold',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: 5
  },
  customWeekStyle: {
    fontFamily: 'LatamSans-Bold', 
    color: '#138D86'
  }
};

export default class CalendarsList extends Component {
  
  headerMonthYearCustomize = (year, month) => {
    const monthNamesZero = LocaleConfig.locales[LocaleConfig.defaultLocale].monthNamesIndexFromZero;
    return (
      <View style={styles.containerHeader} accessible>
        <Text style={styles.textMonth}>{monthNamesZero[month]}</Text>
        <Text style={styles.textYear}>{year}</Text>
      </View>
    );
  };
  render() {
    return (
      <CalendarList 
        current={'2012-05-16'} 
        pastScrollRange={24} 
        futureScrollRange={24}
        markingType={'custom'}
        headerComponent={this.headerMonthYearCustomize}
        customWeekStyle={styles.customWeekStyle}
      />
    );
  }
}
