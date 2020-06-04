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
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#10004F'
  },
  textYear: {
    color: '#5C5C5C',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: 5
  },
  customWeekStyle: {
    color: '#138D86'
  }
};

// const defaultBaseText = {
//   width: 48,
//   height: 48,
//   borderWidth: 1,
//   borderColor: '#bbb',
//   justifyContent: 'flex-end',
//   alignItems: 'flex-end',
//   borderRadius: 8,
//   padding: 2,
//   margin: 0
// };

const themeLatam = {
  todayTextStyle: {
    color: '#138D86'
  },
  selectedStyle: {
    borderRadius: 8,
    borderColor: 'rgba(45, 52, 206, 0.15)'
  },
  dayHeaderStyle: {
    fontFamily: 'LatamSans-Bold',
    color: '#138D86'
  },
  dayTextColor: '#5C5C5C',
  disabledContainerStyle: {
    backgroundColor: '#F5F5F5'
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
        current={'2020-05-16'} 
        pastScrollRange={24} 
        futureScrollRange={24}
        markingType={'custom'}
        headerComponent={this.headerMonthYearCustomize}
        customWeekStyle={styles.customWeekStyle}
        theme={themeLatam}
        selected={'2020-05-15'}
      />
    );
  }
}
