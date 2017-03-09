import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Calendar} from 'wix-react-native-calendar';

export default class CalendarsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          selected={[this.state.selected]}
        />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          selected={['2012-05-16']}
          markedDates={{'2012-05-24': [true], '2012-05-25': [true]}}
          hideArrows={true}
        />
        <Calendar
          style={styles.calendar}
          current={'2012-05-16'}
          minDate={'2012-05-10'}
          displayLoadingIndicator
          markingType={'interactive'}
          markedDates={{'2012-05-24': [{startingDay: true, color: 'gray'}], '2012-05-25': [{endingDay: true, color: 'gray'}]}}
          hideArrows={true}
        />
      </ScrollView>
    );
  }

  onDayPress(day) {
    this.setState({
      selected: day
    });
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    height: 350
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  }
});
